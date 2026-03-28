import React, { useState, useEffect, Component } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import MealPlanView from './components/MealPlanView';
import WorkoutPlanView from './components/WorkoutPlanView';
import ProgressView from './components/ProgressView';
import AICoach from './components/AICoach';
import InputForm from './components/InputForm';
import Login from './components/Login';
import DailyCheckIn from './components/DailyCheckIn';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorProfile from './components/DoctorProfile';
import MedicationView from './components/MedicationView';
import FamilyTreeView from './components/FamilyTreeView';
import { UserProfile, GeneratedPlan, UserRole, HealthLog, Gender, ActivityLevel, FitnessGoal, FoodPreference, ViewState } from './types';
import { generateFitnessPlan } from './services/geminiService';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, getDocFromServer, collection, query, where } from 'firebase/firestore';

// Error Boundary Component
class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let message = "Something went wrong.";
      try {
        const errInfo = JSON.parse(this.state.error.message);
        message = `Database Error: ${errInfo.error} during ${errInfo.operationType} at ${errInfo.path}`;
      } catch (e) {
        message = this.state.error?.message || message;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-ll-bg p-4 transition-colors duration-200">
          <div className="max-w-md w-full glass p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-ll-danger mb-4">Application Error</h2>
            <p className="text-ll-text-muted mb-6">{message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-ll-accent text-ll-bg px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allPatients, setAllPatients] = useState<UserProfile[]>([]);
  const [familyMembers, setFamilyMembers] = useState<UserProfile[]>([]);
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [draftEmail, setDraftEmail] = useState<string>('');
  const [draftPassword, setDraftPassword] = useState<string>('');
  const [draftRole, setDraftRole] = useState<UserRole>(UserRole.Patient);
  const [authError, setAuthError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fatalError, setFatalError] = useState<any>(null);

  // Validate connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('fitcoach_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);

  // Auth state listener
  useEffect(() => {
    // Force sign out once to start from login page as requested by user
    const forceLogout = async () => {
      const hasForcedLogout = sessionStorage.getItem('forced_logout_v1');
      if (!hasForcedLogout) {
        await signOut(auth);
        sessionStorage.setItem('forced_logout_v1', 'true');
      }
    };
    forceLogout();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in, set up real-time profile listener
          const userRef = doc(db, 'users', user.uid);
          const unsubProfile = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as UserProfile;
              setCurrentUser(userData);
              // If we're on LOGIN view, move to DASHBOARD
              setView(prev => prev === 'LOGIN' ? 'DASHBOARD' : prev);
            } else {
              // User exists in Auth but not in Firestore
              setDraftEmail(user.email || '');
              setView('PROFILE');
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          });
          
          return () => unsubProfile();
        } else {
          setCurrentUser(null);
          setCurrentPlan(null);
          setView('LOGIN');
        }
      } catch (error) {
        console.error("Auth state error:", error);
        setFatalError(error);
      } finally {
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time patients listener for Doctors
  useEffect(() => {
    if (!currentUser || !isAuthReady || currentUser.role !== UserRole.Doctor) return;

    const patientsQuery = query(collection(db, 'users'), where('role', '==', UserRole.Patient));
    const unsubscribe = onSnapshot(patientsQuery, (snapshot) => {
      const patients = snapshot.docs.map(doc => doc.data() as UserProfile);
      setAllPatients(patients);
    }, (error) => {
      console.error("Patients listener error:", error);
      console.error("Current User UID:", currentUser?.id);
      console.error("Current User Role:", currentUser?.role);
      setFatalError(error);
    });

    return () => unsubscribe();
  }, [currentUser, isAuthReady]);

  // Real-time plan listener
  useEffect(() => {
    if (!currentUser || !isAuthReady) return;

    const planRef = doc(db, 'plans', currentUser.id);
    const unsubscribe = onSnapshot(planRef, (doc) => {
      if (doc.exists()) {
        setCurrentPlan(doc.data() as GeneratedPlan);
      } else {
        setCurrentPlan(null);
      }
    }, (error) => {
      console.error("Plan listener error:", error);
      setFatalError(error);
    });

    return () => unsubscribe();
  }, [currentUser, isAuthReady]);

  // Daily check-in logic
  useEffect(() => {
    if (currentUser && isAuthReady && view === 'DASHBOARD') {
      const today = new Date().toISOString().split('T')[0];
      const hasLoggedToday = currentUser.healthLogs?.some(log => log.date.startsWith(today));
      if (!hasLoggedToday) {
        setShowDailyCheckIn(true);
      }
    }
  }, [currentUser, isAuthReady, view]);

  // Log on Login logic
  useEffect(() => {
    const logOnLogin = async () => {
      if (currentUser && isAuthReady && view === 'DASHBOARD') {
        const today = new Date().toISOString().split('T')[0];
        const hasLoggedToday = currentUser.healthLogs?.some(log => log.date.startsWith(today));
        
        if (!hasLoggedToday) {
          console.log("Logging login event for today...");
          const lastLog = currentUser.healthLogs?.[currentUser.healthLogs.length - 1];
          const newHealthLog: HealthLog = {
            date: new Date().toISOString(),
            weight: currentUser.weight,
            healthScore: lastLog?.healthScore || currentPlan?.longevityAnalysis?.longevityScore || 50,
            bioAge: lastLog?.bioAge || currentPlan?.longevityAnalysis?.estimatedBiologicalAge || currentUser.age,
            steps: currentUser.dailySteps || 0
          };
          
          const updatedHealthLogs = [...(currentUser.healthLogs || []), newHealthLog];
          const userRef = doc(db, 'users', currentUser.id);
          
          try {
            await updateDoc(userRef, { healthLogs: updatedHealthLogs });
            setCurrentUser(prev => prev ? { ...prev, healthLogs: updatedHealthLogs } : null);
          } catch (error) {
            console.error("Error logging login event:", error);
          }
        }
      }
    };
    
    logOnLogin();
  }, [currentUser?.id, isAuthReady, view]);

  // Theme toggle handler
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fitcoach_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fitcoach_theme', 'light');
    }
  };

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterStart = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setAuthError('');
    try {
      // We create the user in Auth first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      if (role === UserRole.Doctor) {
        setDraftRole(role);
        // For doctors, we skip the health metrics input and create a basic profile
        const userRef = doc(db, 'users', uid);
        const newDoctor: UserProfile = {
          id: uid,
          email: email,
          role: UserRole.Doctor,
          name: email.split('@')[0], // Default name
          age: 35, // Default values that won't be used for analysis
          height: 175,
          weight: 70,
          gender: Gender.Male,
          activityLevel: ActivityLevel.ModeratelyActive,
          fitnessGoal: FitnessGoal.Maintain,
          foodPreference: FoodPreference.NonVeg,
          createdAt: new Date().toISOString(),
          weightLogs: [],
          healthLogs: []
        };
        await setDoc(userRef, newDoctor);
        setCurrentUser(newDoctor);
        setView('DASHBOARD');
      } else {
        setDraftEmail(email);
        setDraftRole(role);
        setView('PROFILE');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setAuthError(error.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorProfileUpdate = async (name: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { name });
      setCurrentUser({ ...currentUser, name });
      setView('DASHBOARD');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (formData: Omit<UserProfile, 'id' | 'createdAt' | 'weightLogs' | 'healthLogs' | 'role'>) => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    
    try {
      const newUser: UserProfile = currentUser ? {
        ...currentUser,
        ...formData
      } : {
        ...formData,
        id: uid,
        role: draftRole,
        email: auth.currentUser.email || '',
        createdAt: new Date().toISOString(),
        weightLogs: [{ date: new Date().toISOString().split('T')[0], weight: formData.weight }],
        healthLogs: []
      };

      await setDoc(userRef, newUser);
      setCurrentUser(newUser);
      
      // Clear draft data
      setDraftEmail('');
      setDraftPassword('');
      
      // Trigger analysis immediately
      await handleGeneratePlan(newUser);
      
      setView('DASHBOARD');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (userToUse?: UserProfile, isRegeneration: boolean = false) => {
    const user = userToUse || currentUser;
    if (!user) return;
    setIsLoading(true);
    try {
      const plan = await generateFitnessPlan(user, isRegeneration);
      const planRef = doc(db, 'plans', user.id);
      const userRef = doc(db, 'users', user.id);
      
      const planData = {
        ...plan,
        userId: user.id,
        updatedAt: new Date().toISOString()
      };

      // Add a health log entry if longevity analysis is available
      if (plan.longevityAnalysis) {
        const newHealthLog: HealthLog = {
          date: new Date().toISOString(),
          weight: user.weight,
          healthScore: plan.longevityAnalysis.longevityScore,
          bioAge: plan.longevityAnalysis.estimatedBiologicalAge,
          steps: user.dailySteps || 0
        };
        
        const updatedHealthLogs = [...(user.healthLogs || []), newHealthLog];
        await updateDoc(userRef, { healthLogs: updatedHealthLogs });
        setCurrentUser({ ...user, healthLogs: updatedHealthLogs });
      }

      await setDoc(planRef, planData);
      // onSnapshot will update currentPlan
    } catch (error) {
      console.error("Plan generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogWeight = async (weight: number) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newLog = { date: today, weight };
    const existingLogs = currentUser.weightLogs || [];
    const otherLogs = existingLogs.filter(l => l.date !== today);
    const updatedLogs = [...otherLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const userRef = doc(db, 'users', currentUser.id);
    try {
      await updateDoc(userRef, {
        weight: weight,
        weightLogs: updatedLogs
      });
      // Local state will be updated by the next render if we use onSnapshot for user too, 
      // but here we just update it manually for immediate feedback
      setCurrentUser({
        ...currentUser,
        weight,
        weightLogs: updatedLogs
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  const handleDailyCheckIn = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', currentUser.id);
    
    try {
      // 1. Update user profile with latest metrics
      const updatedUser = {
        ...currentUser,
        ...data,
      };
      
      // 2. Create a new health log entry for today
      const lastLog = currentUser.healthLogs?.[currentUser.healthLogs.length - 1];
      
      // Extract feedback and medication from data (passed via @ts-ignore in DailyCheckIn)
      // @ts-ignore
      const { dailyFeedback, medicationTaken, ...profileData } = data;

      const newHealthLog: HealthLog = {
        date: new Date().toISOString(),
        weight: data.weight || currentUser.weight,
        healthScore: lastLog?.healthScore || currentPlan?.longevityAnalysis?.longevityScore || 50,
        bioAge: lastLog?.bioAge || currentPlan?.longevityAnalysis?.estimatedBiologicalAge || currentUser.age,
        steps: data.dailySteps || currentUser.dailySteps || 0,
        dailyFeedback: dailyFeedback || '',
        medicationTaken: medicationTaken !== undefined ? medicationTaken : true
      };
      
      const updatedHealthLogs = [...(currentUser.healthLogs || []), newHealthLog];
      
      await updateDoc(userRef, {
        ...profileData,
        healthLogs: updatedHealthLogs
      });
      
      setCurrentUser({
        ...updatedUser,
        healthLogs: updatedHealthLogs
      });
      
      setShowDailyCheckIn(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  const handleResetProgress = async () => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure you want to reset your health history? This cannot be undone.")) return;
    
    const userRef = doc(db, 'users', currentUser.id);
    try {
      await updateDoc(userRef, {
        healthLogs: [],
        weightLogs: [{ date: new Date().toISOString().split('T')[0], weight: currentUser.weight }]
      });
      setCurrentUser({
        ...currentUser,
        healthLogs: [],
        weightLogs: [{ date: new Date().toISOString().split('T')[0], weight: currentUser.weight }]
      });
      alert("Progress data has been reset.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentPlan(null);
      setView('LOGIN');
      setAuthError('');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fetch family members if familyId exists
  useEffect(() => {
    const targetUser = selectedPatient || currentUser;
    if (!targetUser?.familyId) {
      setFamilyMembers([]);
      return;
    }

    const q = query(
      collection(db, 'users'),
      where('familyId', '==', targetUser.familyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => doc.data() as UserProfile);
      setFamilyMembers(members);
    }, (error) => {
      console.error("Error fetching family members:", error);
    });

    return () => unsubscribe();
  }, [currentUser?.familyId]);

  const handlePrescribePills = async (patientId: string, pills: string[]) => {
    const userRef = doc(db, 'users', patientId);
    try {
      await updateDoc(userRef, { prescribedPills: pills });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${patientId}`);
    }
  };

  const handleLinkFamily = async (patientId: string, familyId: string, relationship: string) => {
    try {
      await updateDoc(doc(db, 'users', patientId), {
        familyId,
        familyRelationship: relationship
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${patientId}`);
    }
  };

  const handleToggleMedication = async (taken: boolean) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', currentUser.id);
    
    try {
      const existingLogs = currentUser.healthLogs || [];
      const todayLogIndex = existingLogs.findIndex(l => l.date.startsWith(today));
      
      let updatedLogs;
      if (todayLogIndex !== -1) {
        updatedLogs = [...existingLogs];
        updatedLogs[todayLogIndex] = {
          ...updatedLogs[todayLogIndex],
          medicationTaken: taken
        };
      } else {
        const lastLog = existingLogs[existingLogs.length - 1];
        const newLog: HealthLog = {
          date: new Date().toISOString(),
          weight: currentUser.weight,
          healthScore: lastLog?.healthScore || currentPlan?.longevityAnalysis?.longevityScore || 50,
          bioAge: lastLog?.bioAge || currentPlan?.longevityAnalysis?.estimatedBiologicalAge || currentUser.age,
          steps: currentUser.dailySteps || 0,
          medicationTaken: taken
        };
        updatedLogs = [...existingLogs, newLog];
      }
      
      await updateDoc(userRef, { healthLogs: updatedLogs });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.id}`);
    }
  };

  if (fatalError) {
    throw fatalError;
  }

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ll-bg transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ll-accent"></div>
      </div>
    );
  }

  if (view === 'LOGIN') {
    return <Login onLogin={handleLogin} onRegister={handleRegisterStart} error={authError} isLoading={isLoading} />;
  }

  const handleNavigate = (newView: ViewState) => {
    setSelectedPatient(null);
    setView(newView);
  };

  return (
    <ErrorBoundary>
      {showDailyCheckIn && currentUser && (
        <DailyCheckIn 
          user={currentUser} 
          onSave={handleDailyCheckIn} 
          onClose={() => setShowDailyCheckIn(false)} 
        />
      )}
      <div className="flex h-screen bg-ll-bg overflow-hidden font-sans text-ll-text transition-colors duration-200">
        {/* Sidebar */}
        {currentUser && (
          <Sidebar 
            activeView={view} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            user={currentUser}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto h-full p-4 md:p-8 relative z-10 ${currentUser ? 'md:ml-64' : ''}`}>
          <div className="max-w-5xl mx-auto">
            {view === 'DASHBOARD' && currentUser && (
              currentUser.role === UserRole.Doctor ? (
                <DoctorDashboard 
                  patients={allPatients} 
                  onPrescribe={handlePrescribePills}
                  onViewFamilyTree={(patient) => {
                    setSelectedPatient(patient);
                    setView('FAMILY_TREE');
                  }}
                  onLinkFamily={handleLinkFamily}
                />
              ) : (
                <DashboardHome 
                  user={currentUser} 
                  plan={currentPlan} 
                  onNavigate={handleNavigate} 
                  onOpenCheckIn={() => setShowDailyCheckIn(true)}
                  onReAnalyze={() => handleGeneratePlan(currentUser, true)}
                  isLoading={isLoading}
                />
              )
            )}

            {view === 'MEDICATIONS' && currentUser && (
              <MedicationView 
                user={currentUser} 
                onToggleMedication={handleToggleMedication}
              />
            )}

            {view === 'FAMILY_TREE' && currentUser && (
              <FamilyTreeView 
                currentUser={selectedPatient || currentUser} 
                familyMembers={familyMembers}
                allPatients={allPatients}
                isDoctorView={currentUser.role === UserRole.Doctor}
                onLinkFamily={handleLinkFamily}
              />
            )}

            {view === 'PROFILE' && (
              <div className="space-y-8">
                {(currentUser?.role === UserRole.Doctor || draftRole === UserRole.Doctor) ? (
                  currentUser ? (
                    <DoctorProfile 
                      user={currentUser} 
                      onSubmit={handleDoctorProfileUpdate} 
                      isLoading={isLoading} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-20 glass rounded-[2.5rem]">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ll-accent mb-4"></div>
                      <p className="text-ll-text-muted font-medium animate-pulse">Initializing Doctor Profile...</p>
                    </div>
                  )
                ) : (
                  <InputForm 
                    initialData={currentUser} 
                    draftEmail={draftEmail}
                    onSubmit={handleProfileSubmit} 
                    isLoading={isLoading} 
                  />
                )}
                {currentUser && currentUser.role === UserRole.Patient && (
                  <div className="glass p-8 rounded-3xl border border-ll-danger/20 bg-ll-danger/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-ll-danger font-syne">Reset Health History</h3>
                      <p className="text-ll-text-muted text-sm mt-1">This will permanently delete all your progress logs and trend data.</p>
                    </div>
                    <button 
                      onClick={handleResetProgress}
                      className="px-8 py-3 rounded-xl bg-ll-danger text-white font-bold hover:bg-ll-danger/90 transition-all active:scale-95 whitespace-nowrap"
                    >
                      Reset All Data
                    </button>
                  </div>
                )}
              </div>
            )}

            {view === 'MEAL_PLAN' && (
              <MealPlanView 
                plan={currentPlan} 
                onGenerate={() => handleGeneratePlan(currentUser, true)} 
                isLoading={isLoading} 
              />
            )}

            {view === 'WORKOUT_PLAN' && (
              <WorkoutPlanView 
                plan={currentPlan} 
                onGenerate={() => handleGeneratePlan(currentUser, true)} 
                isLoading={isLoading} 
              />
            )}

            {view === 'PROGRESS' && currentUser && (
              <ProgressView logs={currentUser.healthLogs || []} onReset={handleResetProgress} />
            )}

            {view === 'COACH' && currentUser && (
              <AICoach user={currentUser} plan={currentPlan} logs={currentUser.healthLogs || []} />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;

import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  onRegister: (email: string, password: string, role: UserRole) => void;
  error?: string;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, error, isLoading }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Patient);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      onRegister(email.trim(), password.trim(), role);
    } else {
      onLogin(email.trim(), password.trim(), role);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setValidationError('');
    // Keep email/password but clear specific errors
  };

  return (
    <div className="min-h-screen bg-ll-bg flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full glass rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in transition-colors border border-white/5">
        <div className="bg-gradient-to-br from-ll-accent to-ll-accent2 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3 border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tighter font-syne">LifeLens AI</h1>
            <p className="text-white/80 mt-2 font-medium text-sm uppercase tracking-widest">Longevity Intelligence</p>
          </div>
        </div>
        
        <div className="p-10 bg-ll-surface/50">
          <h2 className="text-2xl font-extrabold text-ll-text mb-2 text-center font-syne tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-ll-text-muted text-center mb-8 text-sm font-medium">
            {isRegistering ? 'Start your longevity journey today' : 'Enter your details to sign in'}
          </p>
          
          {(error || validationError) && (
            <div className="mb-6 bg-ll-danger/10 border border-ll-danger/20 text-ll-danger px-4 py-3 rounded-xl text-sm font-bold text-center">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => setRole(UserRole.Patient)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${role === UserRole.Patient ? 'bg-ll-accent text-ll-bg shadow-lg shadow-ll-accent/20' : 'bg-white/5 text-ll-text-muted border border-white/5'}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.Doctor)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${role === UserRole.Doctor ? 'bg-ll-accent text-ll-bg shadow-lg shadow-ll-accent/20' : 'bg-white/5 text-ll-text-muted border border-white/5'}`}
              >
                Doctor
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-ll-text-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-ll-text/5 border border-ll-text/10 rounded-2xl focus:ring-2 focus:ring-ll-accent/50 focus:border-ll-accent outline-none transition text-ll-text placeholder-ll-text-muted/30 font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <svg className="h-5 w-5 text-ll-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-ll-text/5 border border-ll-text/10 rounded-2xl focus:ring-2 focus:ring-ll-accent/50 focus:border-ll-accent outline-none transition text-ll-text placeholder-ll-text-muted/30 font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="animate-fade-in space-y-2">
                <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-ll-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <input 
                    type="password" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-ll-text/5 border border-ll-text/10 rounded-2xl focus:ring-2 focus:ring-ll-accent/50 focus:border-ll-accent outline-none transition text-ll-text placeholder-ll-text-muted/30 font-medium"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-ll-accent hover:bg-ll-accent/90 text-ll-bg font-extrabold font-syne py-5 rounded-2xl shadow-xl shadow-ll-accent/20 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-ll-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-sm text-ll-text-muted font-medium">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="font-bold text-ll-accent hover:underline focus:outline-none"
              >
                {isRegistering ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
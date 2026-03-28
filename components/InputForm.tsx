import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, ActivityLevel, FitnessGoal, FoodPreference, SmokingStatus, DietQuality, StressLevel } from '../types';

interface InputFormProps {
  initialData?: UserProfile | null;
  draftEmail?: string;
  onSubmit: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'weightLogs' | 'healthLogs' | 'role'>) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ initialData, draftEmail, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: Gender.Male,
    activityLevel: ActivityLevel.Sedentary,
    fitnessGoal: FitnessGoal.LoseWeight,
    foodPreference: FoodPreference.NonVeg,
    healthIssues: '',
    restingHeartRate: '72',
    dailySleep: '7',
    dailySteps: '5000',
    systolicBP: '120',
    smokingStatus: SmokingStatus.NonSmoker,
    dietQuality: DietQuality.Average,
    stressLevel: StressLevel.Moderate
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        age: initialData.age.toString(),
        height: initialData.height.toString(),
        weight: initialData.weight.toString(),
        gender: initialData.gender,
        activityLevel: initialData.activityLevel,
        fitnessGoal: initialData.fitnessGoal,
        foodPreference: initialData.foodPreference,
        healthIssues: initialData.healthIssues || '',
        restingHeartRate: (initialData.restingHeartRate || 72).toString(),
        dailySleep: (initialData.dailySleep || 7).toString(),
        dailySteps: (initialData.dailySteps || 5000).toString(),
        systolicBP: (initialData.systolicBP || 120).toString(),
        smokingStatus: initialData.smokingStatus || SmokingStatus.NonSmoker,
        dietQuality: initialData.dietQuality || DietQuality.Average,
        stressLevel: initialData.stressLevel || StressLevel.Moderate
      });
    } else if (draftEmail) {
      setFormData(prev => ({ ...prev, email: draftEmail }));
    }
  }, [initialData, draftEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email: formData.email,
      name: formData.name,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseFloat(formData.weight),
      gender: formData.gender as Gender,
      activityLevel: formData.activityLevel as ActivityLevel,
      fitnessGoal: formData.fitnessGoal as FitnessGoal,
      foodPreference: formData.foodPreference as FoodPreference,
      healthIssues: formData.healthIssues,
      restingHeartRate: parseInt(formData.restingHeartRate),
      dailySleep: parseFloat(formData.dailySleep),
      dailySteps: parseInt(formData.dailySteps),
      systolicBP: parseInt(formData.systolicBP),
      smokingStatus: formData.smokingStatus as SmokingStatus,
      dietQuality: formData.dietQuality as DietQuality,
      stressLevel: formData.stressLevel as StressLevel
    });
  };

  const loadSampleData = () => {
    setFormData({
      ...formData,
      name: 'John Doe',
      gender: Gender.Male,
      age: '52',
      weight: '95',
      height: '170',
      activityLevel: ActivityLevel.Sedentary,
      fitnessGoal: FitnessGoal.LoseWeight,
      foodPreference: FoodPreference.NonVeg,
      restingHeartRate: '82',
      dailySleep: '5',
      dailySteps: '2000',
      systolicBP: '145',
      smokingStatus: SmokingStatus.CurrentSmoker,
      dietQuality: DietQuality.Poor,
      stressLevel: StressLevel.High
    });
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Health Metrics Input</h1>
          <p className="text-ll-text-muted mt-2 font-medium">Provide your vitals for precise longevity analysis.</p>
        </div>
        <button 
          type="button"
          onClick={loadSampleData}
          className="glass px-4 py-2 rounded-lg text-[10px] font-bold text-ll-accent uppercase tracking-widest hover:bg-ll-accent/10 transition"
        >
          Load Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Metrics */}
          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30 md:col-span-2">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Full Name</label>
            <input
              required
              name="name"
              type="text"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Gender</label>
            <select
              name="gender"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.gender}
              onChange={handleChange}
            >
              {Object.values(Gender).map(g => <option key={g} value={g} className="bg-ll-surface text-ll-text">{g}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Age (Years)</label>
            <input
              required
              name="age"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Weight (Kg)</label>
            <input
              required
              name="weight"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Height (Cm)</label>
            <input
              required
              name="height"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.height}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Resting Heart Rate (BPM)</label>
            <input
              required
              name="restingHeartRate"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.restingHeartRate}
              onChange={handleChange}
            />
          </div>

          {/* Lifestyle Metrics */}
          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Daily Sleep (Hours)</label>
            <input
              required
              name="dailySleep"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.dailySleep}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Daily Steps</label>
            <input
              required
              name="dailySteps"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.dailySteps}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Systolic Blood Pressure</label>
            <input
              required
              name="systolicBP"
              type="number"
              className="w-full bg-transparent text-3xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition"
              value={formData.systolicBP}
              onChange={handleChange}
            />
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Smoking Status</label>
            <select
              name="smokingStatus"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.smokingStatus}
              onChange={handleChange}
            >
              {Object.values(SmokingStatus).map(s => <option key={s} value={s} className="bg-ll-surface text-ll-text">{s}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Diet Quality</label>
            <select
              name="dietQuality"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.dietQuality}
              onChange={handleChange}
            >
              {Object.values(DietQuality).map(d => <option key={d} value={d} className="bg-ll-surface text-ll-text">{d}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Activity Level</label>
            <select
              name="activityLevel"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              {Object.values(ActivityLevel).map(a => <option key={a} value={a} className="bg-ll-surface text-ll-text">{a}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Fitness Goal</label>
            <select
              name="fitnessGoal"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.fitnessGoal}
              onChange={handleChange}
            >
              {Object.values(FitnessGoal).map(f => <option key={f} value={f} className="bg-ll-surface text-ll-text">{f}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Food Preference</label>
            <select
              name="foodPreference"
              className="w-full bg-transparent text-xl font-bold text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition appearance-none"
              value={formData.foodPreference}
              onChange={handleChange}
            >
              {Object.values(FoodPreference).map(f => <option key={f} value={f} className="bg-ll-surface text-ll-text">{f}</option>)}
            </select>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30 md:col-span-2">
            <label className="block text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-3">Health Issues / Notes</label>
            <textarea
              name="healthIssues"
              className="w-full bg-transparent text-lg font-medium text-ll-text outline-none border-b border-ll-text/10 focus:border-ll-accent transition h-10 resize-none"
              value={formData.healthIssues}
              onChange={handleChange}
              placeholder="Any existing conditions?"
            />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative px-12 py-5 bg-ll-accent text-ll-bg font-extrabold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--ll-accent)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? 'Analyzing...' : 'Analyze My Health'}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-ll-accent to-ll-accent2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
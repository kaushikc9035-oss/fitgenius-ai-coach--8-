import React, { useState } from 'react';
import { UserProfile, SmokingStatus, DietQuality, StressLevel } from '../types';

interface DailyCheckInProps {
  user: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  onClose: () => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ user, onSave, onClose }) => {
  const [weight, setWeight] = useState(user.weight);
  const [heartRate, setHeartRate] = useState(user.restingHeartRate || 70);
  const [sleep, setSleep] = useState(user.dailySleep || 7);
  const [steps, setSteps] = useState(user.dailySteps || 5000);
  const [bp, setBp] = useState(user.systolicBP || 120);
  const [stress, setStress] = useState<StressLevel>(user.stressLevel || StressLevel.Moderate);
  const [feedback, setFeedback] = useState('');
  const [medTaken, setMedTaken] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      weight,
      restingHeartRate: heartRate,
      dailySleep: sleep,
      dailySteps: steps,
      systolicBP: bp,
      stressLevel: stress,
      // We'll pass the feedback through the onSave which will be handled in App.tsx to update healthLogs
      // @ts-ignore - adding temporary field for App.tsx to pick up
      dailyFeedback: feedback,
      // @ts-ignore
      medicationTaken: medTaken
    });
  };

  const isCancerPatient = user.healthIssues?.toLowerCase().includes('cancer');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass max-w-2xl w-full p-8 rounded-3xl border border-white/10 bg-ll-surface/90 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold font-syne text-ll-text tracking-tight">Daily Check-in</h2>
            <p className="text-ll-text-muted text-xs font-bold uppercase tracking-widest mt-1">Track your progress for today</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-ll-text-muted hover:text-ll-text transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Weight (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Heart Rate (bpm)</label>
              <input 
                type="number" 
                value={heartRate} 
                onChange={(e) => setHeartRate(parseInt(e.target.value))}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Sleep (hours)</label>
              <input 
                type="number" 
                value={sleep} 
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors"
                step="0.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Daily Steps</label>
              <input 
                type="number" 
                value={steps} 
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Systolic BP</label>
              <input 
                type="number" 
                value={bp} 
                onChange={(e) => setBp(parseInt(e.target.value))}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Stress Level</label>
              <select 
                value={stress} 
                onChange={(e) => setStress(e.target.value as StressLevel)}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors appearance-none"
              >
                {Object.values(StressLevel).map(s => (
                  <option key={s} value={s} className="bg-ll-surface text-ll-text">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Medication Taken Today?</label>
              <button 
                type="button"
                onClick={() => setMedTaken(!medTaken)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${medTaken ? 'bg-ll-accent/20 text-ll-accent border-ll-accent/30' : 'bg-ll-danger/10 text-ll-danger border-ll-danger/30'}`}
              >
                {medTaken ? 'YES' : 'NO'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">
                {isCancerPatient ? 'Detailed Clinical Feedback (Notion-style)' : 'Daily Feedback / Symptoms'}
              </label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={isCancerPatient ? 'Enter detailed symptoms, energy levels, pain markers, and nutritional intake...' : 'How are you feeling today?'}
                className="w-full bg-ll-text/5 border border-ll-text/10 rounded-xl px-4 py-3 text-ll-text focus:outline-none focus:border-ll-accent transition-colors min-h-[150px] resize-none"
              />
              {isCancerPatient && (
                <p className="text-[8px] text-ll-accent font-bold uppercase tracking-widest opacity-60">
                  * High-detail reporting requested for clinical monitoring.
                </p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-ll-accent to-ll-accent2 hover:opacity-90 text-ll-bg font-extrabold font-syne py-4 rounded-2xl shadow-lg shadow-ll-accent/20 transition-all active:scale-[0.98] mt-4"
          >
            SAVE TODAY'S DATA
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyCheckIn;

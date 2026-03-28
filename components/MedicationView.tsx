import React from 'react';
import { UserProfile } from '../types';

interface MedicationViewProps {
  user: UserProfile;
  onToggleMedication: (taken: boolean) => void;
}

const MedicationView: React.FC<MedicationViewProps> = ({ user, onToggleMedication }) => {
  const pills = user.prescribedPills || [];
  const today = new Date().toISOString().split('T')[0];
  const todayLog = user.healthLogs?.find(l => l.date.startsWith(today));
  const isTakenToday = todayLog?.medicationTaken || false;

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black font-syne text-ll-text tracking-tighter leading-none mb-2">Prescribed <span className="text-gradient-cyan">Medications</span></h1>
          <p className="text-ll-text-muted text-lg font-medium">Your clinical prescription roadmap.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 bg-ll-surface/30">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Active Prescriptions</p>
            <p className="text-ll-text text-sm font-black">{pills.length} Medications</p>
          </div>
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 bg-ll-surface/30">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Status Today</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isTakenToday ? 'bg-ll-accent3 animate-pulse' : 'bg-ll-danger'}`}></div>
              <p className={`text-sm font-black ${isTakenToday ? 'text-ll-accent3' : 'text-ll-danger'}`}>
                {isTakenToday ? 'COMPLETED' : 'PENDING'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tracking Card */}
      {pills.length > 0 && (
        <div className="glass p-10 rounded-[3rem] border border-ll-accent/20 bg-ll-accent/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <svg className="w-40 h-40 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h3 className="text-4xl font-black text-ll-text font-syne mb-4 tracking-tight">Daily Protocol <span className="text-gradient-cyan">Tracking</span></h3>
              <p className="text-ll-text-muted text-lg font-medium leading-relaxed">
                Consistency is key to longevity. Mark your medications as taken for today to keep your clinical timeline accurate and help your doctor monitor your progress.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => onToggleMedication(!isTakenToday)}
                className={`group relative px-12 py-6 rounded-2xl font-black font-syne text-xl tracking-tighter transition-all duration-500 active:scale-95 ${
                  isTakenToday 
                    ? 'bg-ll-accent3/20 text-ll-accent3 border border-ll-accent3/30' 
                    : 'bg-ll-accent text-ll-bg shadow-[0_0_30px_rgba(var(--ll-accent-rgb),0.3)] hover:shadow-[0_0_50px_rgba(var(--ll-accent-rgb),0.5)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isTakenToday ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      MEDICATION TAKEN
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      MARK AS TAKEN
                    </>
                  )}
                </div>
              </button>
              {isTakenToday && (
                <p className="text-[10px] font-black text-ll-accent3 uppercase tracking-widest animate-pulse">
                  Protocol Verified for {new Date().toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {pills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pills.map((pill, idx) => (
            <div key={idx} className="bento-card glass shimmer p-8 rounded-[2rem] border border-ll-accent/20 bg-ll-accent/5 group hover:bg-ll-accent/10 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-ll-accent/20 flex items-center justify-center text-ll-accent border border-ll-accent/20 shadow-[0_0_20px_rgba(var(--ll-accent-rgb),0.2)] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-ll-accent/20 text-ll-accent text-[10px] font-black rounded-full uppercase tracking-widest border border-ll-accent/20">
                  Active
                </span>
              </div>
              <h3 className="text-3xl font-black font-syne text-ll-text mb-2 tracking-tight">{pill}</h3>
              <p className="text-ll-text-muted text-sm font-medium mb-6">Prescribed by your attending physician for longevity optimization.</p>
              
              <div className="pt-6 border-t border-ll-accent/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ll-accent rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-ll-accent uppercase tracking-widest">Verified Protocol</span>
                </div>
                <svg className="w-5 h-5 text-ll-accent opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-ll-accent/50 to-ll-accent2/50 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative glass p-20 rounded-[3rem] border border-dashed border-ll-accent/30 bg-ll-accent/5 text-center overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="w-24 h-24 bg-ll-accent/20 rounded-[2rem] flex items-center justify-center text-ll-accent mx-auto mb-10 border border-ll-accent/20 shadow-[0_0_50px_rgba(var(--ll-accent-rgb),0.3)]">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-5xl font-black text-ll-text font-syne mb-6 tracking-tighter leading-none">No Active <span className="text-gradient-cyan">Prescriptions</span></h3>
              <p className="text-ll-text-muted text-xl mb-12 font-medium leading-relaxed">Your doctor has not prescribed any specific medications yet. Once they do, they will appear here as part of your longevity protocol.</p>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Note */}
      <div className="glass p-8 rounded-[2rem] border border-white/5 bg-ll-surface/30">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-xl bg-ll-accent2/20 flex items-center justify-center text-ll-accent2 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-black text-ll-text font-syne mb-2">Clinical Compliance</h4>
            <p className="text-ll-text-muted font-medium leading-relaxed">
              Always follow the dosage instructions provided by your physician. If you experience any adverse effects, please use the <strong>AI Coach</strong> to log your symptoms immediately or contact your healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationView;

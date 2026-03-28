import React from 'react';
import { UserProfile, GeneratedPlan } from '../types';

interface DashboardHomeProps {
  user: UserProfile;
  plan: GeneratedPlan | null;
  onNavigate: (view: any) => void;
  onOpenCheckIn: () => void;
  onReAnalyze?: () => void;
  isLoading?: boolean;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user, plan, onNavigate, onOpenCheckIn, onReAnalyze, isLoading }) => {
  const bmi = (user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1);
  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const healthScore = plan?.longevityAnalysis?.longevityScore || null;
  const bioAge = plan?.longevityAnalysis?.estimatedBiologicalAge || null;
  const impactFactors = plan?.longevityAnalysis?.impactFactors;

  const today = new Date().toISOString().split('T')[0];
  const todayLog = user.healthLogs?.find(l => l.date.startsWith(today));
  const isTakenToday = todayLog?.medicationTaken || false;

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ll-bg/80 backdrop-blur-xl">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-t-4 border-ll-accent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-4 border-ll-accent2 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-t-4 border-ll-accent3 animate-spin"></div>
            </div>
            <h2 className="text-3xl font-black text-ll-text font-syne tracking-tight">Synthesizing Data</h2>
            <p className="text-ll-text-muted text-lg mt-2 font-medium">Our AI is mapping your longevity profile...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-6xl font-black font-syne text-ll-text tracking-tighter leading-none mb-2">Health <span className="text-gradient-cyan">Intelligence</span></h1>
          <p className="text-ll-text-muted text-lg font-medium">Your biological roadmap to longevity.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={onOpenCheckIn}
            className="flex-1 md:flex-none glass px-8 py-4 bg-ll-accent/10 hover:bg-ll-accent text-ll-accent hover:text-ll-bg rounded-2xl text-sm font-black uppercase tracking-widest border border-ll-accent/20 transition-all active:scale-95 shadow-[0_0_20px_rgba(var(--ll-accent-rgb),0.1)] flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Daily Vitals
          </button>
          <div className="glass px-6 py-4 rounded-2xl border border-white/5 bg-ll-surface/30">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Current Cycle</p>
            <p className="text-ll-text text-sm font-black">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Top Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bento-card glass shimmer p-8 rounded-[2rem] border border-white/5 bg-ll-surface/30 group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">Health Score</p>
            <div className="w-8 h-8 rounded-xl bg-ll-accent/10 flex items-center justify-center text-ll-accent group-hover:bg-ll-accent group-hover:text-ll-bg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
          <p className="text-6xl font-black font-syne text-gradient-cyan mb-4">{healthScore ?? '--'}</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 ${healthScore && healthScore > 70 ? 'bg-ll-accent/20 text-ll-accent' : 'bg-ll-accent2/20 text-ll-accent2'} text-[10px] font-black rounded-full uppercase tracking-widest`}>
              {healthScore ? (healthScore > 70 ? 'Optimal' : 'Needs Attention') : 'Pending'}
            </span>
          </div>
        </div>

        <div className="bento-card glass shimmer p-8 rounded-[2rem] border border-white/5 bg-ll-surface/30 group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">Biological Age</p>
            <div className="w-8 h-8 rounded-xl bg-ll-accent2/10 flex items-center justify-center text-ll-accent2 group-hover:bg-ll-accent2 group-hover:text-ll-bg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-6xl font-black font-syne text-gradient-purple mb-4">{bioAge ?? '--'}</p>
          <div className="flex items-center gap-2 text-[10px] font-black">
            <span className="text-ll-text-muted uppercase tracking-widest">Chronological: {user.age}</span>
            {bioAge && (
              <span className={`${bioAge <= user.age ? 'text-ll-accent bg-ll-accent/20' : 'text-ll-accent2 bg-ll-accent2/20'} px-2 py-0.5 rounded-full`}>
                {bioAge <= user.age ? '-' : '+'}{Math.abs(bioAge - user.age)}
              </span>
            )}
          </div>
        </div>

        <div className="bento-card glass shimmer p-8 rounded-[2rem] border border-white/5 bg-ll-surface/30 group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">Body Index</p>
            <div className="w-8 h-8 rounded-xl bg-ll-accent3/10 flex items-center justify-center text-ll-accent3 group-hover:bg-ll-accent3 group-hover:text-ll-bg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
          <p className="text-6xl font-black font-syne text-ll-text mb-4">{bmi}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 ? 'bg-ll-accent3' : 'bg-ll-accent2'} animate-pulse`}></div>
            <span className="text-ll-text-muted text-[10px] font-black uppercase tracking-widest">{getBmiStatus(parseFloat(bmi))}</span>
          </div>
        </div>
      </div>

      {/* Prescribed Medications Section */}
      {user.prescribedPills && user.prescribedPills.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-ll-accent rounded-full"></div>
              <h2 className="text-3xl font-black font-syne text-ll-text tracking-tighter">Prescribed <span className="text-gradient-cyan">Medications</span></h2>
            </div>
            <div className={`glass px-6 py-2 rounded-xl border ${isTakenToday ? 'border-ll-accent3/20 bg-ll-accent3/5 text-ll-accent3' : 'border-ll-danger/20 bg-ll-danger/5 text-ll-danger'} flex items-center gap-3 transition-colors`}>
              <div className={`w-2 h-2 rounded-full ${isTakenToday ? 'bg-ll-accent3 animate-pulse' : 'bg-ll-danger'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isTakenToday ? 'All Medications Taken' : 'Medication Pending'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.prescribedPills.map((pill, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl border border-ll-accent/20 bg-ll-accent/5 flex items-center gap-4 group hover:bg-ll-accent/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-ll-accent/20 flex items-center justify-center text-ll-accent group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-black text-ll-text font-syne leading-tight">{pill}</p>
                  <p className="text-[10px] font-black text-ll-accent uppercase tracking-widest opacity-70">Doctor Prescribed</p>
                </div>
                {isTakenToday && (
                  <div className="text-ll-accent3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact Factors Section */}
      {impactFactors ? (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
            <div>
              <h2 className="text-4xl font-black font-syne text-ll-text tracking-tighter leading-none mb-2">Longevity <span className="text-gradient-purple">Drivers</span></h2>
              <p className="text-ll-text-muted text-lg font-medium">The biological forces shaping your future.</p>
            </div>
            <div className="flex gap-3">
              <div className="glass px-4 py-2 rounded-xl border border-ll-accent/20 bg-ll-accent/5 flex items-center gap-3">
                <div className="w-2 h-2 bg-ll-accent rounded-full"></div>
                <span className="text-[10px] font-black text-ll-accent uppercase tracking-widest">{impactFactors.positive.length} Boosters</span>
              </div>
              <div className="glass px-4 py-2 rounded-xl border border-ll-accent2/20 bg-ll-accent2/5 flex items-center gap-3">
                <div className="w-2 h-2 bg-ll-accent2 rounded-full"></div>
                <span className="text-[10px] font-black text-ll-accent2 uppercase tracking-widest">{impactFactors.negative.length} Risks</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Positive Factors */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-ll-accent/30 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative glass p-10 rounded-[2.5rem] border border-ll-accent/20 bg-ll-accent/5 h-full overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                  <svg className="w-48 h-48 text-ll-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                </div>
                
                <div className="relative z-10 space-y-8">
                  {impactFactors.positive.map((item, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-ll-accent/20 flex items-center justify-center text-ll-accent border border-ll-accent/20 shadow-[0_0_20px_rgba(var(--ll-accent-rgb),0.2)] group-hover/item:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-xl font-black text-ll-text font-syne leading-none mb-1">{item.factor}</p>
                            <p className="text-[10px] font-black text-ll-accent uppercase tracking-[0.2em] opacity-70">Healthspan Catalyst</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-ll-accent font-syne leading-none block mb-1">{item.impact}</span>
                          <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest">Score Lift</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-ll-accent/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-ll-accent to-ll-accent3 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Negative Factors */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-ll-accent2/30 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative glass p-10 rounded-[2.5rem] border border-ll-accent2/20 bg-ll-accent2/5 h-full overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12">
                  <svg className="w-48 h-48 text-ll-accent2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" transform="rotate(180 12 12)"/></svg>
                </div>

                <div className="relative z-10 space-y-8">
                  {impactFactors.negative.map((item, idx) => (
                    <div key={idx} className="group/item">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-ll-accent2/20 flex items-center justify-center text-ll-accent2 border border-ll-accent2/20 shadow-[0_0_20px_rgba(var(--ll-accent2-rgb),0.2)] group-hover/item:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                          </div>
                          <div>
                            <p className="text-xl font-black text-ll-text font-syne leading-none mb-1">{item.factor}</p>
                            <p className="text-[10px] font-black text-ll-accent2 uppercase tracking-[0.2em] opacity-70">Longevity Risk</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-ll-accent2 font-syne leading-none block mb-1">{item.impact}</span>
                          <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest">Score Drag</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-ll-accent2/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-ll-accent2 to-ll-danger rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-ll-accent/50 to-ll-accent2/50 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative glass p-20 rounded-[3rem] border border-dashed border-ll-accent/30 bg-ll-accent/5 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-64 h-64 bg-ll-accent rounded-full blur-[100px]"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-ll-accent2 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="w-24 h-24 bg-ll-accent/20 rounded-[2rem] flex items-center justify-center text-ll-accent mx-auto mb-10 border border-ll-accent/20 shadow-[0_0_50px_rgba(var(--ll-accent-rgb),0.3)] animate-bounce-slow">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-5xl font-black text-ll-text font-syne mb-6 tracking-tighter leading-none">Unlock Your <span className="text-gradient-cyan">Impact DNA</span></h3>
              <p className="text-ll-text-muted text-xl mb-12 font-medium leading-relaxed">Discover the specific biological drivers behind your longevity score. Our AI will pinpoint exactly what's boosting your health and what's holding you back.</p>
              <button 
                onClick={onReAnalyze || (() => onNavigate('PROFILE'))}
                className="group relative px-16 py-6 bg-ll-accent text-ll-bg font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(var(--ll-accent-rgb),0.4)]"
              >
                <span className="relative z-10 flex items-center gap-4">
                  <svg className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  GENERATE NEW PLAN
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-ll-accent to-ll-accent2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Row */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bento-card glass p-10 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 pointer-events-none">
            <svg className="w-48 h-48 text-ll-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h3 className="text-[10px] font-black text-ll-accent uppercase tracking-[0.3em] mb-10 flex items-center gap-3 relative z-10">
            <span className="w-1.5 h-4 bg-ll-accent rounded-full animate-pulse"></span>
            Biological Age Analysis
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-ll-accent/10 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-ll-accent/5"></div>
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(var(--ll-accent-rgb),0.2)]">
                <circle cx="112" cy="112" r="104" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-ll-text/5" />
                <circle 
                  cx="112" 
                  cy="112" 
                  r="104" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={653} 
                  strokeDashoffset={653 - (653 * ((bioAge || user.age) / 100))} 
                  strokeLinecap="round"
                  className={`${bioAge && bioAge <= user.age ? 'text-ll-accent' : 'text-ll-accent2'} transition-all duration-1000 ease-out`} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black font-syne text-ll-text tracking-tighter">{bioAge ?? '--'}</span>
                <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-[0.2em]">Bio Age</span>
              </div>
            </div>

            <div className="space-y-8 flex-1">
              <p className="text-ll-text-muted text-lg leading-relaxed font-medium">Your biological age reflects the actual state of your internal systems.</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-ll-text font-syne tracking-tight">{user.age}</p>
                  <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest">Chronological</p>
                </div>
                <div className="space-y-1">
                  <p className={`text-3xl font-black ${bioAge && bioAge <= user.age ? 'text-ll-accent' : 'text-ll-accent2'} font-syne tracking-tight`}>{bioAge ?? '--'}</p>
                  <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest">Biological</p>
                </div>
              </div>
              {bioAge && (
                <div className={`glass p-4 rounded-2xl border ${bioAge <= user.age ? 'border-ll-accent/20 bg-ll-accent/5 text-ll-accent' : 'border-ll-accent2/20 bg-ll-accent2/5 text-ll-accent2'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${bioAge <= user.age ? 'bg-ll-accent/20' : 'bg-ll-accent2/20'} flex items-center justify-center`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-xs font-black uppercase tracking-wide leading-tight">
                      {bioAge <= user.age 
                        ? `Aging ${user.age - bioAge} years slower than expected.` 
                        : `Aging ${bioAge - user.age} years faster than expected.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bento-card glass p-10 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 -rotate-12 pointer-events-none">
            <svg className="w-48 h-48 text-ll-accent2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>

          <h3 className="text-[10px] font-black text-ll-accent uppercase tracking-[0.3em] mb-10 flex items-center gap-3 relative z-10">
            <span className="w-1.5 h-4 bg-ll-accent rounded-full animate-pulse"></span>
            Vitals Analysis
          </h3>

          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-6 rounded-[2rem] border border-white/5 bg-ll-surface/20 group/stat hover:bg-ll-surface/40 transition-colors">
                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-3">Sleep Quality</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-ll-text font-syne leading-none">{user.dailySleep || '--'}</span>
                  <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1">hrs</span>
                </div>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-white/5 bg-ll-surface/20 group/stat hover:bg-ll-surface/40 transition-colors">
                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-3">Daily Steps</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-ll-text font-syne leading-none">{user.dailySteps?.toLocaleString() || '--'}</span>
                  <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1">steps</span>
                </div>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-white/5 bg-ll-surface/20 group/stat hover:bg-ll-surface/40 transition-colors">
                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-3">Resting HR</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-ll-text font-syne leading-none">{user.restingHeartRate || '--'}</span>
                  <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1">bpm</span>
                </div>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-white/5 bg-ll-surface/20 group/stat hover:bg-ll-surface/40 transition-colors">
                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-3">Systolic BP</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-ll-text font-syne leading-none">{user.systolicBP || '--'}</span>
                  <span className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1">mmHg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
import React from 'react';
import { HealthLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressViewProps {
  logs: HealthLog[];
  onReset?: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ logs, onReset }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12 animate-fade-in">
        <div className="glass p-8 rounded-full mb-8 bg-ll-accent/10 border border-ll-accent/20 shadow-2xl shadow-ll-accent/10">
          <svg className="w-16 h-16 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold font-syne text-ll-text mb-4 tracking-tight">No Health History Yet</h2>
        <p className="text-ll-text-muted max-w-md mb-10 text-lg font-medium leading-relaxed">
          Log your daily metrics to start tracking your biological age and health score trends.
        </p>
      </div>
    );
  }

  if (logs.length === 1) {
    const latest = logs[0];
    return (
      <div className="space-y-12 animate-fade-in pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Current Status</h1>
            <p className="text-ll-text-muted text-sm font-medium mt-1">
              {new Date(latest.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          {onReset && (
            <button 
              onClick={onReset}
              className="text-[10px] font-bold text-ll-danger uppercase tracking-widest hover:opacity-70 transition"
            >
              Reset History
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl border border-white/5 bg-ll-surface/30 flex flex-col items-center text-center">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest mb-4">Health Score</p>
            <p className="text-6xl font-extrabold font-syne text-ll-accent mb-2">{latest.healthScore}</p>
            <div className="w-full h-2 bg-ll-text/5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-ll-accent" style={{ width: `${latest.healthScore}%` }}></div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 bg-ll-surface/30 flex flex-col items-center text-center">
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest mb-4">Biological Age</p>
            <p className="text-6xl font-extrabold font-syne text-ll-accent2 mb-2">{latest.bioAge}</p>
            <p className="text-xs font-bold text-ll-text-muted opacity-40 mt-4">Estimated from latest analysis</p>
          </div>
        </div>

        <div className="glass p-12 rounded-3xl border border-white/5 bg-ll-surface/30 text-center">
          <h3 className="text-xl font-bold text-ll-text mb-4 font-syne">Trend Tracking Started</h3>
          <p className="text-ll-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            You've successfully logged your first data point! Continue logging daily to see your health trends visualized in interactive graphs.
          </p>
        </div>
      </div>
    );
  }

  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    healthScore: log.healthScore,
    bioAge: log.bioAge
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-xl border border-white/10 bg-ll-surface/90 shadow-2xl">
          <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-2">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
              <p className="text-sm font-bold text-ll-text">
                {p.name}: <span style={{ color: p.color }}>{p.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Health History</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ll-accent"></div>
              <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Health Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-ll-accent2"></div>
              <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Bio Age</span>
            </div>
          </div>
        </div>
        {onReset && (
          <button 
            onClick={onReset}
            className="px-4 py-2 rounded-lg glass text-[10px] font-bold text-ll-danger uppercase tracking-widest hover:bg-ll-danger/10 transition active:scale-95"
          >
            Reset History
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Health Score Trend */}
        <div className="glass p-8 rounded-3xl border border-white/5 bg-ll-surface/30">
          <h3 className="text-[10px] font-bold text-ll-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-1 h-4 bg-ll-accent rounded-full"></span>
            Health Score Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ll-text" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} 
                  className="text-ll-text-muted"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} 
                  className="text-ll-text-muted"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="healthScore" 
                  name="Health Score"
                  stroke="var(--ll-accent)" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'var(--ll-accent)', strokeWidth: 2, stroke: 'var(--ll-bg)' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bio Age Trend */}
        <div className="glass p-8 rounded-3xl border border-white/5 bg-ll-surface/30">
          <h3 className="text-[10px] font-bold text-ll-accent2 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <span className="w-1 h-4 bg-ll-accent2 rounded-full"></span>
            Biological Age Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ll-text" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} 
                  className="text-ll-text-muted"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} 
                  className="text-ll-text-muted"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="bioAge" 
                  name="Bio Age"
                  stroke="var(--ll-accent2)" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'var(--ll-accent2)', strokeWidth: 2, stroke: 'var(--ll-bg)' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
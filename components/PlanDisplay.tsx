import React from 'react';
import { GeneratedPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlanDisplayProps {
  plan: GeneratedPlan;
  user: UserProfile;
  onReset: () => void;
}

const COLORS = ['#22d3ee', '#818cf8', '#f472b6'];

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, user, onReset }) => {
  const macroData = [
    { name: 'Protein', value: plan.dietPlan.dailyMacros.protein },
    { name: 'Carbs', value: plan.dietPlan.dailyMacros.carbs },
    { name: 'Fats', value: plan.dietPlan.dailyMacros.fats },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center bg-ll-surface/30">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Hello, {user.name}!</h1>
          <p className="text-ll-text-muted mt-2 font-medium">Here is your personalized roadmap to {user.fitnessGoal.toLowerCase()}.</p>
        </div>
        <div className="mt-6 md:mt-0 text-right">
          <div className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mb-1">Target Calories</div>
          <div className="text-5xl font-black text-ll-accent font-syne tracking-tighter">{plan.dietPlan.dailyMacros.totalCalories} <span className="text-lg font-bold opacity-40">kcal</span></div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-ll-accent/10 rounded-2xl p-6 border border-ll-accent/20">
        <h3 className="text-ll-accent font-bold mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">
          <span>💡</span> Coach's Summary
        </h3>
        <p className="text-ll-text leading-relaxed font-medium">{plan.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Diet Section */}
        <div className="glass rounded-3xl overflow-hidden flex flex-col h-full border border-white/5 bg-ll-surface/30">
          <div className="bg-ll-accent/20 px-6 py-5 flex justify-between items-center border-b border-white/5">
            <h3 className="text-xl font-extrabold text-ll-text flex items-center gap-3 font-syne tracking-tight">
              <svg className="w-6 h-6 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Nutrition Plan
            </h3>
          </div>
          
          <div className="p-8 flex-1 flex flex-col gap-8">
             {/* Macros Chart */}
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Total</div>
                <div className="text-xl font-black text-ll-text font-syne">{plan.dietPlan.dailyMacros.totalCalories}</div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest border-b border-white/10 pb-2">Sample Day</h4>
              
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                <div key={mealType} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                   <h5 className="capitalize font-extrabold text-ll-accent text-xs mb-3 tracking-widest">{mealType}</h5>
                   <ul className="space-y-4">
                    {/* @ts-ignore */}
                     {plan.dietPlan.sampleDay[mealType].map((item: any, idx: number) => (
                       <li key={idx} className="text-sm text-ll-text flex justify-between items-start gap-4">
                         <span className="font-medium">{item.name} <span className="text-xs text-ll-text-muted block mt-1 font-normal">{item.description}</span></span>
                         <span className="font-mono text-[10px] font-bold bg-ll-accent/10 text-ll-accent px-2 py-1 rounded-lg border border-ll-accent/20 whitespace-nowrap">{item.calories} kcal</span>
                       </li>
                     ))}
                   </ul>
                </div>
              ))}
            </div>
            
             <div className="bg-ll-accent/5 p-5 rounded-2xl border border-ll-accent/10 mt-auto">
              <span className="font-bold text-ll-accent text-xs uppercase tracking-widest">💧 Hydration:</span>
              <p className="text-sm text-ll-text mt-2 font-medium leading-relaxed">{plan.dietPlan.hydrationTips}</p>
            </div>
          </div>
        </div>

        {/* Workout Section */}
        <div className="glass rounded-3xl overflow-hidden flex flex-col h-full border border-white/5 bg-ll-surface/30">
          <div className="bg-ll-accent2/20 px-6 py-5 flex justify-between items-center border-b border-white/5">
            <h3 className="text-xl font-extrabold text-ll-text flex items-center gap-3 font-syne tracking-tight">
              <svg className="w-6 h-6 text-ll-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Workout Plan
            </h3>
            <span className="bg-ll-accent2/20 text-ll-accent2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-ll-accent2/20">{plan.workoutPlan.frequency}</span>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {plan.workoutPlan.routine.map((day, idx) => (
                <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-white/5">
                  <div className="bg-white/5 px-5 py-3 font-bold text-ll-text-muted text-[10px] uppercase tracking-widest border-b border-white/5">
                    {day.dayName}
                  </div>
                  <div className="divide-y divide-white/5">
                    {day.exercises.map((exercise, eIdx) => (
                      <div key={eIdx} className="p-5 hover:bg-white/5 transition group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-ll-text group-hover:text-ll-accent2 transition-colors">{exercise.name}</span>
                          <span className="text-[10px] font-mono bg-ll-accent2/10 text-ll-accent2 px-2 py-1 rounded-lg border border-ll-accent2/20 font-bold">
                            {exercise.sets} x {exercise.reps}
                          </span>
                        </div>
                        {exercise.notes && <p className="text-xs text-ll-text-muted italic font-medium">{exercise.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={onReset}
          className="text-ll-text-muted hover:text-ll-accent font-bold text-xs uppercase tracking-widest underline transition underline-offset-8"
        >
          Start Over with New Profile
        </button>
      </div>
    </div>
  );
};

export default PlanDisplay;
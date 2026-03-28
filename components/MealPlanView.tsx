import React from 'react';
import { GeneratedPlan } from '../types';

interface MealPlanViewProps {
  plan: GeneratedPlan | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const MealPlanView: React.FC<MealPlanViewProps> = ({ plan, onGenerate, isLoading }) => {
  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12 animate-fade-in">
        <div className="glass p-8 rounded-full mb-8 bg-ll-accent/10 border border-ll-accent/20 shadow-2xl shadow-ll-accent/10">
          <svg className="w-16 h-16 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold font-syne text-ll-text mb-4 tracking-tight">No Nutrition Strategy</h2>
        <p className="text-ll-text-muted max-w-md mb-10 text-lg font-medium leading-relaxed">
          Unlock your biological potential with a precision-engineered nutrition plan based on your metabolic markers.
        </p>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="group relative px-10 py-5 bg-ll-accent hover:bg-ll-accent/90 text-ll-bg rounded-2xl font-bold text-lg shadow-2xl shadow-ll-accent/20 transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative flex items-center gap-3">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-ll-bg/30 border-t-ll-bg rounded-full animate-spin"></div>
                Analyzing Metabolism...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Generate Nutrition Plan
              </>
            )}
          </span>
        </button>
      </div>
    );
  }

  const { dailyMacros, sampleDay } = plan.dietPlan;

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Nutrition Strategy</h1>
          <p className="text-ll-text-muted mt-2 text-lg font-medium">Fueling longevity and performance</p>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="glass px-6 py-4 bg-ll-surface/30 hover:bg-ll-surface/50 text-ll-text rounded-2xl font-black border border-white/5 transition-all active:scale-95 flex items-center gap-3 text-sm uppercase tracking-widest shadow-xl"
        >
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? 'Recalculating...' : 'GENERATE NEW PLAN'}
        </button>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5 bg-ll-surface/30">
        <h3 className="text-[10px] font-bold text-ll-text-muted uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <span className="w-1 h-4 bg-ll-accent rounded-full"></span>
          Daily Macro Targets
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-2xl bg-ll-accent/5 border border-ll-accent/10">
             <p className="text-[10px] font-bold text-ll-accent/60 uppercase tracking-widest mb-2">Calories</p>
             <p className="text-4xl font-black text-ll-accent font-syne">{dailyMacros.totalCalories}</p>
             <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mt-1">kcal / day</p>
          </div>
          <div className="glass p-6 rounded-2xl bg-ll-accent2/5 border border-ll-accent2/10">
             <p className="text-[10px] font-bold text-ll-accent2/60 uppercase tracking-widest mb-2">Protein</p>
             <p className="text-4xl font-black text-ll-accent2 font-syne">{dailyMacros.protein}g</p>
             <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mt-1">Building Blocks</p>
          </div>
          <div className="glass p-6 rounded-2xl bg-ll-accent/5 border border-ll-accent/10">
             <p className="text-[10px] font-bold text-ll-accent/60 uppercase tracking-widest mb-2">Carbs</p>
             <p className="text-4xl font-black text-ll-accent font-syne">{dailyMacros.carbs}g</p>
             <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mt-1">Energy Source</p>
          </div>
          <div className="glass p-6 rounded-2xl bg-ll-accent2/5 border border-ll-accent2/10">
             <p className="text-[10px] font-bold text-ll-accent2/60 uppercase tracking-widest mb-2">Fats</p>
             <p className="text-4xl font-black text-ll-accent2 font-syne">{dailyMacros.fats}g</p>
             <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest mt-1">Hormonal Health</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
          // @ts-ignore
          const items = sampleDay[mealType] || [];
          if (items.length === 0) return null;
          
          const totalCals = items.reduce((acc: number, item: any) => acc + item.calories, 0);
          
          return (
            <div key={mealType} className="group glass rounded-[2.5rem] border border-white/5 bg-ll-surface/30 hover:bg-ll-surface/50 transition-all duration-500 overflow-hidden">
               <div className="p-8">
                 <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                   <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-transform duration-500 group-hover:scale-110
                        ${mealType === 'breakfast' ? 'bg-ll-accent/20 text-ll-accent border border-ll-accent/30' :
                          mealType === 'lunch' ? 'bg-ll-accent2/20 text-ll-accent2 border border-ll-accent2/30' :
                          mealType === 'dinner' ? 'bg-ll-accent/20 text-ll-accent border border-ll-accent/30' :
                          'bg-ll-accent2/20 text-ll-accent2 border border-ll-accent2/30'
                        }`}>
                        {mealType === 'breakfast' ? '🍳' : mealType === 'lunch' ? '🥗' : mealType === 'dinner' ? '🍽️' : '🍎'}
                      </div>
                      <div>
                        <h4 className="capitalize font-extrabold text-2xl text-ll-text tracking-tight font-syne">{mealType}</h4>
                        <p className="text-ll-text-muted font-medium text-sm mt-1">Precision Fueling</p>
                      </div>
                   </div>
                   <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                     <span className="text-xl font-black text-ll-text font-syne">{totalCals}</span>
                     <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest ml-2">kcal</span>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-ll-text-muted uppercase tracking-[0.2em]">Ingredients & Preparation</h5>
                      <div className="glass rounded-2xl p-6 bg-ll-text/5 border border-ll-text/5 space-y-4">
                        {items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-ll-accent mt-2 shrink-0"></div>
                            <p className="text-ll-text/70 text-sm leading-relaxed font-medium">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-ll-text-muted uppercase tracking-[0.2em]">Nutritional Profile</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="glass p-4 rounded-2xl bg-ll-accent/5 border border-ll-accent/10 text-center">
                           <p className="text-[8px] font-bold text-ll-accent/60 uppercase tracking-widest mb-1">Protein</p>
                           <p className="text-lg font-black text-ll-accent font-syne">High</p>
                        </div>
                        <div className="glass p-4 rounded-2xl bg-ll-accent2/5 border border-ll-accent2/10 text-center">
                           <p className="text-[8px] font-bold text-ll-accent2/60 uppercase tracking-widest mb-1">Carbs</p>
                           <p className="text-lg font-black text-ll-accent2 font-syne">Med</p>
                        </div>
                        <div className="glass p-4 rounded-2xl bg-ll-accent/5 border border-ll-accent/10 text-center">
                           <p className="text-[8px] font-bold text-ll-accent/60 uppercase tracking-widest mb-1">Fats</p>
                           <p className="text-lg font-black text-ll-accent font-syne">Low</p>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-2xl bg-ll-text/5 border border-ll-text/5">
                        <p className="text-xs text-ll-text-muted leading-relaxed italic font-medium">
                          "This meal is optimized for glycemic stability and sustained cognitive performance."
                        </p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanView;

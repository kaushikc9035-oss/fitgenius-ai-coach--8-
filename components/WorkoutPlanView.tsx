import React, { useEffect, useMemo, useState } from 'react';
import { GeneratedPlan } from '../types';

interface WorkoutPlanViewProps {
  plan: GeneratedPlan | null;
  onGenerate: () => void;
  isLoading: boolean;
}

const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({ plan, onGenerate, isLoading }) => {
  const planStorageKey = useMemo(() => {
    if (!plan) return null;
    return `fitgenius_workout_progress_${JSON.stringify(plan.workoutPlan.routine)}`;
  }, [plan]);

  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  useEffect(() => {
    if (!planStorageKey) {
      setCompletedExercises([]);
      return;
    }

    try {
      const savedProgress = localStorage.getItem(planStorageKey);
      const parsedProgress = savedProgress ? JSON.parse(savedProgress) : [];
      setCompletedExercises(Array.isArray(parsedProgress) ? parsedProgress : []);
    } catch {
      setCompletedExercises([]);
    }
  }, [planStorageKey]);

  const toggleExerciseCompletion = (exerciseIndex: number) => {
    setCompletedExercises((prev) => {
      const updatedProgress = prev.includes(exerciseIndex)
        ? prev.filter((index) => index !== exerciseIndex)
        : [...prev, exerciseIndex];

      if (planStorageKey) {
        localStorage.setItem(planStorageKey, JSON.stringify(updatedProgress));
      }

      return updatedProgress;
    });
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-12 animate-fade-in">
        <div className="glass p-8 rounded-full mb-8 bg-ll-accent/10 border border-ll-accent/20 shadow-2xl shadow-ll-accent/10">
          <svg className="w-16 h-16 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold font-syne text-ll-text mb-4 tracking-tight">No Active Routine</h2>
        <p className="text-ll-text-muted max-w-md mb-10 text-lg font-medium leading-relaxed">
          Your AI coach is ready to build a high-performance routine tailored to your biological age and health goals.
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
                Analyzing Metrics...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Performance Plan
              </>
            )}
          </span>
        </button>
      </div>
    );
  }

  const exercises = plan.workoutPlan.routine.flatMap(day => day.exercises);

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">Workout Routine</h1>
          <p className="text-ll-text-muted mt-2 text-lg font-medium">Precision training for longevity</p>
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
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-ll-accent/10 border border-ll-accent/20">
              <svg className="w-8 h-8 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-ll-text tracking-tight font-syne">Daily Performance</h3>
              <p className="text-ll-text-muted font-bold uppercase text-[10px] tracking-widest mt-1">
                {completedExercises.length}/{exercises.length} Complete - ~450 Calories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-ll-text/5 border border-ll-text/10">
            <div className="w-2 h-2 rounded-full bg-ll-accent animate-pulse"></div>
            <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">
              Active Routine
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exercises.map((exercise, idx) => {
          const isCompleted = completedExercises.includes(idx);

          return (
            <div
              key={idx}
              className={`group glass rounded-[2rem] border overflow-hidden transition-all duration-500 ${
                isCompleted
                  ? 'border-ll-accent/30 bg-ll-accent/5'
                  : 'border-white/5 bg-ll-surface/30 hover:bg-ll-surface/50'
              }`}
            >
              <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 rounded-2xl text-ll-bg flex items-center justify-center font-black text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-500 font-syne ${
                    isCompleted
                      ? 'bg-gradient-to-br from-ll-accent3 to-ll-accent shadow-2xl shadow-ll-accent3/20'
                      : 'bg-gradient-to-br from-ll-accent to-ll-accent2 shadow-2xl shadow-ll-accent/20'
                  }`}>
                    {idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExerciseCompletion(idx)}
                    aria-pressed={isCompleted}
                    aria-label={`Mark ${exercise.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                    className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-ll-accent3 text-ll-bg border-ll-accent3 shadow-lg shadow-ll-accent3/20'
                        : 'bg-ll-bg border-ll-text/10 text-ll-text/60 hover:border-ll-accent/30 hover:text-ll-accent'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className={`text-2xl font-bold tracking-tight font-syne ${isCompleted ? 'text-ll-text/70 line-through' : 'text-ll-text'}`}>
                        {exercise.name}
                      </h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isCompleted ? 'text-ll-accent3' : 'text-ll-text-muted'}`}>
                        {isCompleted ? 'Completed' : 'Tap the tick when done'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-lg bg-ll-accent/10 border border-ll-accent/20 text-ll-accent text-[10px] font-black uppercase tracking-widest">
                        Strength
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-ll-text/5 border border-ll-text/10 text-ll-text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {exercise.sets} Sets
                      </span>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 bg-ll-text/5 border border-ll-text/5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-ll-text/5 mt-1">
                        <svg className="w-4 h-4 text-ll-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-ll-text/80 leading-relaxed font-medium">
                          {exercise.notes || "Focus on explosive power during the concentric phase and controlled resistance during the eccentric phase."}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Target Reps</span>
                            <span className="text-sm font-bold text-ll-accent font-syne">{exercise.reps}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-ll-text/10"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest">Rest</span>
                            <span className="text-sm font-bold text-ll-text/80 font-syne">60s</span>
                          </div>
                        </div>
                      </div>
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

export default WorkoutPlanView;

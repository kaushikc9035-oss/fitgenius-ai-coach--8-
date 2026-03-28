export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  ModeratelyActive = 'Moderately Active',
  VeryActive = 'Very Active',
  SuperActive = 'Super Active'
}

export enum FitnessGoal {
  LoseWeight = 'Lose Weight',
  Maintain = 'Maintain Weight',
  GainMuscle = 'Build Muscle'
}

export enum FoodPreference {
  Vegetarian = 'Vegetarian',
  NonVeg = 'Non-Vegetarian',
  Vegan = 'Vegan',
  Keto = 'Keto',
  Paleo = 'Paleo'
}

export enum UserRole {
  Patient = 'Patient',
  Doctor = 'Doctor'
}

export enum SmokingStatus {
  NonSmoker = 'Non-smoker',
  FormerSmoker = 'Former smoker',
  CurrentSmoker = 'Current smoker'
}

export enum DietQuality {
  Poor = 'Poor',
  Average = 'Average',
  Excellent = 'Excellent'
}

export enum StressLevel {
  Low = 'Low',
  Moderate = 'Moderate',
  High = 'High',
  VeryHigh = 'Very High'
}

export interface HealthLog {
  date: string;
  weight: number;
  healthScore: number;
  bioAge: number;
  steps: number;
  dailyFeedback?: string; // Detailed feedback for the doctor
  symptoms?: string[];
  medicationTaken?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  password?: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  foodPreference: FoodPreference;
  healthIssues?: string;
  prescribedPills?: string[]; // New field for doctor's view
  createdAt: string;
  healthLogs?: HealthLog[];
  weightLogs?: { date: string; weight: number }[];
  // New metrics from photo
  restingHeartRate?: number;
  dailySleep?: number;
  dailySteps?: number;
  systolicBP?: number;
  smokingStatus?: SmokingStatus;
  dietQuality?: DietQuality;
  stressLevel?: StressLevel;
  familyId?: string;
  familyRelationship?: string; // e.g., "Father", "Mother", "Self", "Child", "Sibling", "Grandparent"
}

export type ViewState = 'LOGIN' | 'DASHBOARD' | 'PROFILE' | 'MEAL_PLAN' | 'WORKOUT_PLAN' | 'PROGRESS' | 'COACH' | 'DOCTOR_DASHBOARD' | 'MEDICATIONS' | 'FAMILY_TREE';

export interface MealItem {
  name: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyMealPlan {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  totalCalories: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string; // e.g., "Day 1 - Push"
  exercises: Exercise[];
}

export interface LongevityInsight {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface GeneratedPlan {
  dietPlan: {
    dailyMacros: MacroNutrients;
    sampleDay: DailyMealPlan;
    hydrationTips: string;
  };
  workoutPlan: {
    frequency: string;
    routine: WorkoutDay[];
  };
  summary: string;
  longevityAnalysis?: {
    estimatedBiologicalAge: number;
    longevityScore: number;
    impactFactors: {
      positive: { factor: string; impact: string }[];
      negative: { factor: string; impact: string }[];
    };
    keyInsights: LongevityInsight[];
    optimizationTips: string[];
  };
}
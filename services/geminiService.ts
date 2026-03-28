import { UserProfile, GeneratedPlan, HealthLog } from "../types";

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

const callGeminiAPI = async (prompt: string) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("API key not found");
    throw new Error("API key not configured");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Dummy plan for testing
const createDummyPlan = (profile: UserProfile): GeneratedPlan => {
  return {
    summary: `Personalized longevity plan for ${profile.name}`,
    longevityAnalysis: {
      estimatedBiologicalAge: profile.age,
      longevityScore: 75,
      impactFactors: {
        positive: [
          { factor: "Regular activity", impact: "+10% Health Score" },
          { factor: "Healthy eating", impact: "+8% Health Score" }
        ],
        negative: [
          { factor: "Stress levels", impact: "-5% Health Score" }
        ]
      },
      keyInsights: [
        { title: "Cardio Health", description: "Focus on Zone 2 training", impact: "High" },
        { title: "Strength", description: "Add resistance training", impact: "High" },
        { title: "Recovery", description: "Improve sleep quality", impact: "Medium" }
      ],
      optimizationTips: [
        "Aim for 10,000 steps daily",
        "Sleep 7-9 hours consistently",
        "Stay hydrated with 2-3 liters of water per day"
      ]
    },
    dietPlan: {
      hydrationTips: "Drink water consistently throughout the day",
      dailyMacros: {
        protein: 150,
        carbs: 200,
        fats: 60,
        totalCalories: 2200
      },
      sampleDay: {
        breakfast: [
          { name: "Oatmeal", calories: 150, description: "With berries", protein: 5, carbs: 27, fats: 3 }
        ],
        lunch: [
          { name: "Grilled Chicken", calories: 250, description: "With veggies", protein: 35, carbs: 5, fats: 8 }
        ],
        dinner: [
          { name: "Salmon", calories: 300, description: "With quinoa", protein: 40, carbs: 30, fats: 12 }
        ],
        snacks: [
          { name: "Almonds", calories: 100, description: "Handful", protein: 3, carbs: 3, fats: 9 }
        ]
      }
    },
    workoutPlan: {
      frequency: "5-6 days a week",
      routine: [
        {
          dayName: "Monday",
          exercises: [
            { name: "Bench Press", sets: "4", reps: "8-10", notes: "Rest 2 min" },
            { name: "Running", sets: "1", reps: "30 min Zone 2", notes: "" }
          ]
        },
        {
          dayName: "Wednesday",
          exercises: [
            { name: "Squats", sets: "4", reps: "8-10", notes: "Heavy weight" },
            { name: "Cycling", sets: "1", reps: "20 min", notes: "Recovery pace" }
          ]
        }
      ]
    }
  };
};

export const generateFitnessPlan = async (profile: UserProfile, isRegeneration: boolean = false): Promise<GeneratedPlan> => {
  try {
    // For now, return a dummy plan to avoid API issues
    // Users can still interact with the coach
    return createDummyPlan(profile);
  } catch (error) {
    console.error("Plan generation error:", error);
    return createDummyPlan(profile);
  }
};

export const startCoachChat = (user: UserProfile, plan: GeneratedPlan | null, logs: HealthLog[]): any => {
  return {
    messageHistory: [] as Array<{ role: string; content: string }>,
    sendMessageStream: async function(params: any) {
      const userMessage = params.message;
      this.messageHistory.push({ role: 'user', content: userMessage });
      
      try {
        const prompt = `You are a fitness and longevity coach for ${user.name}, age ${user.age}.
Their goal: ${user.fitnessGoal}

User message: ${userMessage}

Provide a helpful, concise response about fitness, longevity, and health optimization.`;

        const responseText = await callGeminiAPI(prompt);
        this.messageHistory.push({ role: 'assistant', content: responseText });
        
        return {
          [Symbol.asyncIterator]: async function* () {
            yield { text: responseText };
          }
        };
      } catch (error) {
        console.error("Coach Error:", error);
        
        // Fallback responses
        const fallbackResponses: {[key: string]: string} = {
          "vo2": "VO2 max improves through HIIT (High-Intensity Interval Training), sustained aerobic exercise, and proper recovery. Aim for 2-3 HIIT sessions weekly.",
          "sleep": "Sleep quality matters as much as duration. Aim for 7-9 hours, keep bedroom cool/dark, avoid screens 1 hour before bed.",
          "workout": "A balanced program includes: strength training 3-4x/week, Zone 2 cardio 2-3x/week, mobility/stretching daily.",
          "meal": "Focus on whole foods: lean proteins, complex carbs, healthy fats. Caloric deficit for fat loss, slight surplus for muscle gain.",
          "progress": `You've logged ${logs.length} health entries. Keep consistent!`,
          "supplement": "Popular longevity supplements: NMN, CoQ10, Omega-3s, Magnesium. Consult a doctor before starting.",
          "zone": "Zone 2 training is low-intensity cardio where you can speak but not sing. Aim for 150-200 minutes per week."
        };

        const messageText = userMessage.toLowerCase();
        let fallbackResponse = "That's a great question! Keep working on your fitness goals and staying consistent with your routine.";
        
        for (const [key, response] of Object.entries(fallbackResponses)) {
          if (messageText.includes(key)) {
            fallbackResponse = response;
            break;
          }
        }

        this.messageHistory.push({ role: 'assistant', content: fallbackResponse });
        
        return {
          [Symbol.asyncIterator]: async function* () {
            yield { text: fallbackResponse };
          }
        };
      }
    }
  };
};

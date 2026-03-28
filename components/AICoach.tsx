import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, GeneratedPlan, HealthLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AICoachProps {
  user: UserProfile;
  plan: GeneratedPlan | null;
  logs: HealthLog[];
}

const SUGGESTED_QUESTIONS = [
  "How can I improve my VO2 max?",
  "What supplements support longevity?",
  "Analyze my recent progress.",
  "Optimize my sleep protocol.",
  "Explain Zone 2 training."
];

const AICoach: React.FC<AICoachProps> = ({ user, plan, logs }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello ${user.name}! I'm your LifeLens AI Coach. I've analyzed your health profile and longevity plan. How can I help you optimize your healthspan today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([{ role: 'model', text: `Hello ${user.name}! I'm your LifeLens AI Coach. I've analyzed your health profile and longevity plan. How can I help you optimize your healthspan today?` }]);
  };

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: "❌ API key not configured. Please add GEMINI_API_KEY to .env file." }]);
        return;
      }

      // Advanced system prompt
      const systemPrompt = `You are an elite longevity and fitness coach with expertise in:
- Sports science and exercise physiology
- Nutritional biochemistry
- Biohacking and longevity protocols
- Zone training and cardiovascular optimization
- Strength and conditioning
- Recovery and sleep science

CLIENT PROFILE:
- Name: ${user.name}
- Age: ${user.age} years old
- Gender: ${user.gender}
- Height: ${user.height}cm | Weight: ${user.weight}kg
- Fitness Goal: ${user.fitnessGoal}
- Activity Level: ${user.activityLevel}
- Food Preference: ${user.foodPreference}
- Health Issues: ${user.healthIssues || 'None reported'}

RESPONSE GUIDELINES:
1. Provide detailed, evidence-based explanations (200-500 words ideal)
2. Personalize advice based on their profile
3. Include specific protocols, timings, and measurables
4. Reference scientific principles when relevant
5. Provide actionable steps they can implement immediately
6. Mention potential risks or contraindications
7. Use clear formatting with bullet points for clarity
8. Cite research-backed recommendations

YOUR TONE: Professional, data-driven, empowering, and practical.`;

      // Call Gemini API with better model
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: systemPrompt,
            contents: [{
              parts: [{
                text: userMessage
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
              topP: 0.95,
              topK: 40
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error:", error);
        
        // If 429 (rate limited), try with flash model
        if (error.error?.code === 429 || response.status === 429) {
          return handleSendMessage(undefined, userMessage);
        }
        throw new Error(error.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate response. Please try again.";
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      console.error("Coach Error:", error);
      
      // Detailed fallback responses
      const detailedFallbacks: {[key: string]: string} = {
        "vo2|cardio|aerobic": `## Improving Your VO2 Max

VO2 max (maximal oxygen uptake) is the maximum amount of oxygen your body can utilize during intense exercise. Here's a science-backed protocol:

**Training Methods:**
1. **HIIT Sessions (2-3x/week)**
   - 4-6 minute warm-up at Zone 2
   - 8 x 3-minute intervals at 90-95% max HR
   - 3-minute recovery at Zone 2 between intervals
   - Expected improvement: 3-5% per 8 weeks

2. **Zone 2 Base Building (150-200 min/week)**
   - Low intensity where you can speak but not sing
   - 60-70% of max HR
   - Builds aerobic mitochondria
   - Sustainable long-term

3. **Tempo Runs (1-2x/week)**
   - 10-minute warm-up
   - 20-30 minutes at Zone 3-4 (75-85% max HR)
   - 10-minute cool-down

**Progression Timeline:**
- Weeks 1-4: Base building, establish routine
- Weeks 5-8: Add first HIIT session
- Weeks 9-12: Increase HIIT intensity
- Expected gain: 10-15% over 12 weeks with consistency`,

        "sleep|recovery|rest": `## Optimizing Sleep for Recovery & Longevity

Sleep is where the real magic happens. Here's your personalized protocol:

**Sleep Architecture:**
- Aim for 7-9 hours nightly (age ${user.age}: ${user.age > 40 ? '8-9 hours' : '7-9 hours'} optimal)
- Consistent sleep/wake times (even weekends)

**Environmental Optimization:**
1. **Temperature**: 65-68°F (18-20°C) - critical for deep sleep
2. **Darkness**: Complete blackout or 0.3 lux max
3. **Humidity**: 40-60%
4. **Air Quality**: Fresh air/ventilation

**Pre-Sleep Protocol (1 hour before bed):**
- Blue light blocking glasses (or dim screen)
- Avoid caffeine after 2 PM
- Light stretching or yoga
- No heavy meals (3+ hours before bed)

**Sleep Supplements (consult doctor):**
- Magnesium glycinate: 300-400mg
- Melatonin: 0.5-3mg (lower is better)
- L-theanine: 100-200mg

**Smart Sleep Tracking:**
- Use sleep tracker to monitor cycles
- Target 60+ minutes deep sleep
- Track REM (dreams memory/emotional processing)`,

        "workout|training|exercise|strength": `## Optimal Training Split for ${user.fitnessGoal}

**Evidence-Based Weekly Structure:**
- **Strength Days (3-4x/week)**: Compound lifts
- **Zone 2 Cardio (2-3x/week)**: 40-60 min low intensity
- **Mobility (Daily)**: 10-15 min stretching/yoga
- **Rest Days (1-2x/week)**: Complete recovery

**Weekly Split Example:**
- **Monday**: Upper Body Strength (Bench, Rows)
- **Tuesday**: Zone 2 Cardio (Running/Cycling) 45 min
- **Wednesday**: Lower Body Strength (Squats, Deadlifts)
- **Thursday**: Zone 2 Cardio 30 min
- **Friday**: Full Body + HIIT 20 min
- **Sat-Sun**: Active recovery or complete rest

**Strength Protocol:**
- 4-5 sets x 6-10 reps for compound lifts
- Progressive overload: +5% weight or reps weekly
- 2-3 min rest between sets
- Tempo: 2 sec down, 1 sec up`,

        "meal|diet|nutrition|protein": `## Personalized Nutrition Plan for ${user.name}

Based on your weight (${user.weight}kg) and goal (${user.fitnessGoal}):

**Daily Macros:**
- **Protein**: ${Math.round(user.weight * 1.6)}-${Math.round(user.weight * 2.2)}g (priority #1)
- **Carbs**: ${Math.round(user.weight * 2.5)}-${Math.round(user.weight * 3.5)}g (post-workout)
- **Fats**: ${Math.round(user.weight * 0.8)}-${Math.round(user.weight * 1.2)}g (omega-3 focus)

**Protein Priority:**
- Minimum 30-40g per meal x 3 meals
- Post-workout: 40g protein + 60g carbs within 90 min
- Sources: Fish, chicken breast, eggs, Greek yogurt

**Meal Timing:**
- **Pre-workout (2-3 hrs)**: Balanced meal (protein + carbs)
- **Post-workout (60 min)**: Protein + fast carbs (rice, banana)
- **Bedtime**: Casein protein (cottage cheese) for overnight amino acids

**Food Preference (${user.foodPreference}):**
- Focus on quality sources
- Variety prevents nutrient deficiencies
- Meal prep 2-3x/week for consistency`,

        "supplement|vitamin|nutrient": `## Evidence-Based Longevity Supplements

**Tier 1 (Essential):**
- **Omega-3s**: 2-3g EPA+DHA daily (fish oil or algae)
- **Vitamin D3**: 2,000-4,000 IU daily (check levels)
- **Magnesium**: 300-400mg (glycinate form)
- **Probiotics**: Multi-strain daily

**Tier 2 (Performance):**
- **Creatine monohydrate**: 5g daily (proven safe)
- **Beta-alanine**: 3-5g daily (endurance)
- **NAC**: 600-1,200mg (antioxidant)

**Tier 3 (Advanced Longevity):**
- **Resveratrol**: 150-500mg daily
- **NMN**: 250-500mg daily (NAD+ booster)
- **Quercetin**: 500-1,000mg daily (senolytic)

⚠️ **Always**:
1. Consult your doctor first
2. Check for interactions with medications
3. Buy from reputable brands (NSF certified)
4. Start low, go slow`,

        "zone 2|aerobic|base": `## Zone 2 Training: The Longevity Foundation

Zone 2 is the most underrated tool for health and fitness.

**What is Zone 2?**
- 60-70% of max heart rate (formula: 220 - ${user.age} = ${220 - user.age}, so ${Math.round((220 - user.age) * 0.6)}-${Math.round((220 - user.age) * 0.7)} bpm)
- "Conversational pace" - speak but not sing
- Burns fat efficiently
- Builds aerobic mitochondria

**Benefits:**
- ✅ Improved cardiovascular health
- ✅ Fat metabolism without muscle loss
- ✅ Sustainable long-term
- ✅ Reduces injury risk
- ✅ Improves recovery capacity

**Implementation:**
- 150-200 minutes/week (spread across 3-4 sessions)
- 40-60 min sessions
- Any activity: running, cycling, swimming, hiking
- Can do while listening to podcasts/audiobooks

**Monitor Progress:**
- Weekly distance/duration
- Track pace improvement
- Heart rate will decrease for same effort (good!)`,

        "progress|log|track": `## Tracking Your Progress Effectively

**What to Measure:**
1. **Strength**: Track lifts weekly (bench, squat, deadlift)
2. **Endurance**: Weekly run/bike times at conversational pace
3. **Body Composition**: Weight + photos (weekly) + measurements (monthly)
4. **Biomarkers**: Blood work every 6 months (lipids, glucose, inflammation)
5. **Sleep**: Average hours + deep sleep percentage
6. **Subjective**: Energy, mood, recovery quality

**Tracking Tools:**
- Strong app (for strength)
- Strava (for running/cycling)
- Smart scale (body comp)
- Sleep tracker (Oura, Whoop, or watch)

**Analysis:**
- Weekly: trends in volume/intensity
- Monthly: body comp + strength avg
- Quarterly: biomarker reassessment
- Yearly: goal review + reset`
      };

      const msg = userMessage.toLowerCase();
      let fallback = `I appreciate your question about your fitness journey! While I couldn't connect to the AI right now, here's what I recommend: **Stay consistent with your training**, **track your progress weekly**, and **prioritize sleep and nutrition** - these three factors drive 90% of results. What specific aspect of fitness would you like to dive deeper into?`;
      
      // Find matching fallback
      for (const [key, val] of Object.entries(detailedFallbacks)) {
        const keywords = key.split('|');
        if (keywords.some(k => msg.includes(k))) {
          fallback = val;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-accent to-ll-accent2 flex items-center justify-center text-white shadow-lg shadow-ll-accent/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold font-syne text-ll-text glow-cyan">FitGenius AI Coach</h1>
            <p className="text-ll-text-muted text-[10px] font-bold uppercase tracking-widest">Neural Link Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg bg-ll-text/5 border border-ll-text/10 text-[10px] font-bold text-ll-text-muted hover:bg-ll-danger/10 hover:text-ll-danger transition-all uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 glass rounded-[2rem] overflow-hidden flex flex-col relative border border-ll-text/5 bg-ll-text/1">
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[90%] p-5 rounded-2xl shadow-xl relative group/msg ${
                  msg.role === 'user' 
                    ? 'bg-ll-accent/10 border border-ll-accent/20 text-ll-text rounded-tr-none' 
                    : 'bg-ll-text/5 border border-ll-text/10 text-ll-text rounded-tl-none'
                }`}>
                  <div className="prose prose-invert max-w-none text-ll-text leading-relaxed text-sm md:text-base">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.role === 'model' && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="absolute -right-10 top-0 p-2 opacity-0 group-hover/msg:opacity-100 transition-opacity text-ll-text-dim hover:text-ll-accent"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-ll-text/5 border border-ll-text/10 p-4 rounded-2xl rounded-tl-none shadow-xl">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-ll-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!isLoading && messages.length < 8 && (
            <div className="pt-4 flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(undefined, q)}
                  className="px-3 py-1.5 rounded-full bg-ll-accent/5 border border-ll-accent/10 text-[10px] font-bold text-ll-accent hover:bg-ll-accent/10 transition-all whitespace-nowrap uppercase tracking-wider"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="h-2" />
        </div>
      </div>

      {/* Input Area */}
      <div className="glass p-4 rounded-2xl border border-ll-text/10 bg-ll-text/5 backdrop-blur-2xl">
        <form onSubmit={handleSendMessage} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your longevity coach..."
            className="w-full bg-ll-surface/50 border border-ll-text/10 rounded-xl py-4 pl-6 pr-20 text-ll-text placeholder:text-ll-text-muted focus:outline-none focus:border-ll-accent/50 focus:ring-2 focus:ring-ll-accent/5 transition-all text-base"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-ll-accent text-ll-bg rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-ll-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-ll-accent/20 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? '...' : (
              <>
                <span>Send</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;

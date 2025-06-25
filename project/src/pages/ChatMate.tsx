import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Activity, Heart, AlertTriangle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'warning' | 'suggestion';
}

interface HealthContext {
  recentVitals?: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    bloodOxygen?: number;
  };
  symptoms?: string[];
  medications?: string[];
  lastActivity?: string;
}

const ChatMate: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm ChatMate, your calm and caring health companion. I'm here to support you with any wellness concerns, symptoms, or health questions you have.\n\n💙 I understand that health concerns can be stressful, and I'm here to provide gentle guidance and support. Just tell me what's on your mind, and I'll do my best to help.\n\nType 'help' or 'menu' if you'd like to see what I can assist with.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'suggestion',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate getting health context from Health Tracker
  const getHealthContext = (): HealthContext => {
    // In a real app, this would fetch from your health tracker state/API
    return {
      recentVitals: {
        heartRate: 72,
        bloodPressure: "120/80",
        temperature: 98.6,
        bloodOxygen: 98
      },
      symptoms: ["headache", "fatigue"],
      medications: ["Lisinopril", "Atorvastatin"],
      lastActivity: "Walking for 30 minutes"
    };
  };

  // Function to check for emergency keywords with typo tolerance
  const checkForEmergencyKeywords = (message: string): boolean => {
    const normalizedMessage = message.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Emergency patterns with common typos and variations
    const emergencyPatterns = [
      // Vomiting blood variations
      /vom[it]*[te]*d?\s*blood|blood\s*in\s*vom[it]*|cough[ing]*\s*up\s*blood|spitt[ing]*\s*blood/,
      
      // Breathing difficulties
      /can[\'t]*\s*breath[e]*|cannot\s*breath[e]*|difficul[ty]*\s*breath[ing]*|trouble\s*breath[ing]*|hard\s*to\s*breath[e]*|short\s*of\s*breath/,
      
      // Chest pain
      /sever[e]*\s*chest\s*pain|chest\s*pain\s*sever[e]*|heart\s*attack|chest\s*hurt[s]*\s*bad[ly]*/,
      
      // Loss of consciousness
      /pass[ed]*\s*out|faint[ed]*|lost\s*consciou[s]*ness|unconsciou[s]*|black[ed]*\s*out/,
      
      // Suicidal thoughts
      /suicid[al]*\s*thought[s]*|want\s*to\s*die|kill\s*my\s*self|end\s*my\s*life|hurt\s*my\s*self|harm\s*my\s*self/,
      
      // Stroke symptoms
      /stroke|can[\'t]*\s*mov[e]*|paralyz[ed]*|face\s*droop[ing]*|slur[red]*\s*speech/,
      
      // Severe allergic reactions
      /aller[gic]*\s*reaction\s*sever[e]*|anaphyla[xis]*|throat\s*clos[ing]*|can[\'t]*\s*swal[low]*/,
      
      // Overdose/poisoning
      /overdos[e]*|took\s*too\s*man[y]*\s*pill[s]*|poison[ing]*|acciden[tal]*\s*ingest[ion]*/,
      
      // Severe headache
      /sever[e]*\s*headach[e]*\s*sudden|worst\s*headach[e]*\s*ever|sudden\s*sever[e]*\s*head\s*pain/
    ];
    
    return emergencyPatterns.some(pattern => pattern.test(normalizedMessage));
  };

  // Advanced health response system with new personality guidelines
  const generateHealthResponse = (userMessage: string, context: HealthContext): { text: string; type: 'normal' | 'warning' | 'suggestion' } => {
    const message = userMessage.toLowerCase();
    
    // Check for emergency keywords first (with typo tolerance)
    if (checkForEmergencyKeywords(message)) {
      return {
        text: "⚠️ I'm really sorry you're going through this. This could be a medical emergency. Please seek immediate help from a doctor or emergency services near you.\n\n🚨 **Please call emergency services right away** or go to the nearest emergency room. Your safety is the most important thing right now.\n\nI'm here for you, but please get professional medical help immediately.",
        type: 'warning'
      };
    }
    
    // Thank you responses
    const thankYouKeywords = ['thank you', 'thanks', 'thnx', 'ty'];
    if (thankYouKeywords.some(keyword => message.includes(keyword))) {
      return {
        text: "You're welcome! I'm always here if you need me. Hope you feel better soon 💙",
        type: 'normal'
      };
    }

    // Help/Menu requests - show available topics
    if (message.includes('help') || message.includes('menu') || message === 'what can you do' || message === 'options') {
      return {
        text: "I'm here to support you with your health and wellness concerns. Here's how I can help:\n\n🩺 **Symptom guidance** - Support for headaches, nausea, fatigue, and more\n💊 **Medication questions** - General information about medications\n🏃 **Fitness & nutrition** - Exercise and diet guidance\n😌 **Mental wellness** - Stress, anxiety, and sleep support\n📊 **Health tracking** - Understanding your vital signs\n🚨 **Emergency guidance** - When to seek immediate care\n\nJust tell me what's concerning you, like 'I have a headache' or 'feeling anxious'. I'm here to listen and help.\n\n💙 Remember, I'm not a doctor, but I care about your wellbeing and want to support you.",
        type: 'suggestion'
      };
    }

    // Specific symptom responses with empathy and care

    // Cramps - specific request from user
    if (message.includes('cramp') || message.includes('cramps')) {
      return {
        text: "I'm sorry you're dealing with cramps - they can be really uncomfortable. Let me help you understand what might help:\n\n**For muscle cramps:**\n• Gentle stretching and massage of the affected area\n• Stay hydrated and consider electrolyte balance\n• Apply heat or cold - whatever feels better to you\n• Rest the affected muscle\n\n**For menstrual cramps:**\n• Heat therapy (heating pad, warm bath) often provides relief\n• Gentle movement like walking can help\n• Over-the-counter pain relievers as directed\n• Try our breathing exercises in the Wellness section\n\n**For stomach cramps:**\n• Sip clear fluids slowly\n• Try gentle abdominal massage\n• Consider what you've eaten recently\n• Rest in a comfortable position\n\n**Please seek medical attention if:**\n• Cramps are severe or getting worse\n• You have fever, nausea, or other concerning symptoms\n• The pain is interfering with your daily activities\n\nYou can track your symptoms in the Health Tracker. How are you feeling right now?",
        type: 'normal'
      };
    }

    // Dizziness symptoms
    if (message.includes('dizzy') || message.includes('dizziness') || message.includes('lightheaded')) {
      return {
        text: "I'm sorry you're feeling dizzy - that can be really unsettling. Let me help you with some gentle guidance:\n\n**Immediate steps:**\n• Sit or lie down safely right now\n• Take slow, deep breaths\n• Sip water slowly if you can\n• Avoid sudden movements\n\n**Common causes and gentle remedies:**\n• Dehydration - sip water throughout the day\n• Low blood sugar - try a small snack\n• Standing up too quickly - move slowly when changing positions\n• Stress or anxiety - try our breathing exercises\n\n**When to seek medical care:**\n• Dizziness with chest pain or trouble breathing\n• Severe headache with dizziness\n• Dizziness that doesn't improve with rest\n• If you're concerned about the severity\n\nYou can track this in the Health Tracker. Are you feeling a bit better now that you're resting?",
        type: 'normal'
      };
    }

    // Headache symptoms
    if (message.includes('headache') || message.includes('head pain') || message.includes('migraine')) {
      const hasHeadacheHistory = context.symptoms?.includes('headache');
      return {
        text: `I'm really sorry you're dealing with a headache${hasHeadacheHistory ? ' - I see this has been bothering you' : ''}. Headaches can be so draining. Let me share some gentle approaches that might help:\n\n**Immediate comfort measures:**\n• Find a quiet, dark space to rest\n• Apply a cold or warm compress to your head or neck\n• Try gentle neck and shoulder stretches\n• Stay hydrated with small sips of water\n• Consider our breathing exercises in the Wellness section\n\n**Gentle prevention strategies:**\n• Regular sleep schedule (7-9 hours)\n• Stay hydrated throughout the day\n• Manage stress with relaxation techniques\n• Notice any food or environmental triggers\n\n**Please seek medical attention if:**\n• Sudden, severe headache unlike any you've had\n• Headache with fever, stiff neck, or vision changes\n• Headaches that are getting worse or more frequent\n• Any headache that worries you\n\nYou can track this in the Health Tracker to help identify patterns. How severe is your pain right now on a scale of 1-10?`,
        type: 'normal'
      };
    }

    // Fatigue symptoms
    if (message.includes('fatigue') || message.includes('tired') || message.includes('exhausted') || message.includes('energy')) {
      return {
        text: "I hear that you're feeling really tired, and I understand how exhausting that can be. Fatigue can affect everything in your day. Let me offer some gentle support:\n\n**Immediate self-care:**\n• Allow yourself to rest - your body is telling you something\n• Stay hydrated with water throughout the day\n• Try light, nourishing foods\n• Step outside for fresh air if possible\n\n**Gentle energy-supporting strategies:**\n• Consistent sleep schedule, even if sleep is difficult\n• Light movement like a short walk when you feel able\n• Stress management - try our meditation features\n• Consider if anything has changed in your routine lately\n\n**When to reach out for medical support:**\n• Fatigue lasting more than 2 weeks\n• Fatigue with other symptoms like fever or pain\n• If it's significantly impacting your daily life\n• Any concerns about underlying causes\n\nYou can track your energy levels in the Health Tracker. Have you been able to get adequate rest lately?",
        type: 'normal'
      };
    }

    // Nausea
    if (message.includes('nausea') || message.includes('nauseous') || message.includes('sick to stomach') || message.includes('queasy')) {
      return {
        text: "I'm sorry you're feeling nauseous - that's such an uncomfortable feeling. Let me help you with some gentle remedies:\n\n**Immediate comfort measures:**\n• Sit quietly and breathe slowly through your nose\n• Sip small amounts of clear fluids (water, ginger tea)\n• Try ginger - ginger tea, ginger ale, or ginger candies\n• Get some fresh air if possible\n• Avoid strong smells\n\n**Gentle foods when you feel ready:**\n• Plain crackers or toast\n• Rice or bananas\n• Clear broths\n• Small, frequent sips rather than large amounts\n\n**Please seek medical attention if:**\n• Persistent vomiting for more than 24 hours\n• Signs of dehydration (dizziness, dry mouth, little urination)\n• Severe abdominal pain with nausea\n• Blood in vomit\n• High fever with nausea\n\nYou can track this symptom in the Health Tracker. Are you able to keep small sips of water down?",
        type: 'normal'
      };
    }

    // Fever
    if (message.includes('fever') || message.includes('temperature') || message.includes('hot') || message.includes('chills')) {
      return {
        text: "I'm sorry you're not feeling well with a fever. Fevers can make you feel really miserable. Let me help you understand what's happening and how to care for yourself:\n\n**Understanding fever:**\n• Normal: 97.8-99.1°F (36.5-37.3°C)\n• Low-grade fever: 99.1-100.4°F (37.3-38°C)\n• Fever: Above 100.4°F (38°C)\n\n**Gentle self-care:**\n• Rest as much as possible\n• Stay hydrated with water, clear broths, or electrolyte solutions\n• Dress lightly and keep your room cool\n• Take your temperature regularly\n• Use a cool, damp cloth on your forehead if it feels good\n\n**Seek immediate medical attention if:**\n• Temperature above 103°F (39.4°C)\n• Fever with severe headache, stiff neck, or rash\n• Difficulty breathing or chest pain\n• Persistent vomiting or signs of dehydration\n• Fever lasting more than 3 days\n\nHow high is your temperature, and how long have you been feeling this way?",
        type: 'normal'
      };
    }

    // Cough
    if (message.includes('cough') || message.includes('coughing')) {
      return {
        text: "I'm sorry you're dealing with a cough - they can be so persistent and tiring. Let me share some gentle ways to help soothe your throat and manage the cough:\n\n**Soothing remedies:**\n• Warm liquids like tea with honey (honey is naturally soothing)\n• Use a humidifier or breathe steam from a hot shower\n• Throat lozenges or hard candies to keep your throat moist\n• Elevate your head while sleeping\n• Stay hydrated throughout the day\n\n**Types of coughs:**\n• Dry cough: Often from irritation, try moisture and soothing remedies\n• Productive cough: Brings up mucus, stay hydrated to help thin secretions\n\n**Please see a healthcare provider if:**\n• Cough persists more than 3 weeks\n• Coughing up blood\n• High fever with cough\n• Difficulty breathing or chest pain\n• Thick, colored mucus that concerns you\n\nAvoid smoke and other irritants if possible. How long have you had this cough, and is it keeping you awake at night?",
        type: 'normal'
      };
    }

    // Anxiety and stress
    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried') || message.includes('anxious') || message.includes('panic')) {
      return {
        text: "I hear that you're feeling stressed or anxious, and I want you to know that these feelings are completely valid. It takes courage to reach out, and I'm here to support you:\n\n**Immediate calming techniques:**\n• Take slow, deep breaths - in for 4, hold for 4, out for 6\n• Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n• Place your hand on your heart and feel it beating\n• Try our breathing exercises in the Wellness section\n\n**Gentle ongoing support:**\n• Regular gentle movement like walking\n• Adequate sleep (even if it's difficult right now)\n• Connect with people who care about you\n• Limit caffeine if it makes you feel more anxious\n• Practice self-compassion - be kind to yourself\n\n**Please reach out for professional support if:**\n• Anxiety is significantly impacting your daily life\n• You're having panic attacks\n• You feel overwhelmed and can't cope\n• You're having thoughts of self-harm\n\nYou deserve support and care. What's been weighing on your mind lately?",
        type: 'suggestion'
      };
    }

    // Sleep issues
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('can\'t sleep')) {
      return {
        text: "I understand how frustrating sleep problems can be - when you can't sleep well, everything else feels harder. Let me share some gentle approaches that might help:\n\n**Creating a peaceful sleep environment:**\n• Keep your bedroom cool, dark, and quiet\n• Use your bed only for sleep\n• Try a consistent bedtime routine that relaxes you\n• Avoid screens 1 hour before bed if possible\n\n**Gentle sleep preparation:**\n• No caffeine after 2 PM\n• Light exercise during the day, but not close to bedtime\n• Try our meditation and breathing exercises\n• Consider chamomile tea or other calming rituals\n• Write down worries in a journal to clear your mind\n\n**If sleep continues to be difficult:**\n• Keep a sleep diary to identify patterns\n• Consider if stress, medications, or health issues might be involved\n• Talk to a healthcare provider if problems persist more than 2 weeks\n\nSleep is so important for your overall wellbeing. What's been making it hard for you to sleep lately?",
        type: 'suggestion'
      };
    }

    // Blood pressure inquiries
    if (message.includes('blood pressure') || message.includes('bp') || message.includes('hypertension')) {
      const currentBP = context.recentVitals?.bloodPressure;
      return {
        text: `${currentBP ? `I see your recent blood pressure reading was ${currentBP}, which is in the normal range. That's good news!` : ''} Let me share some helpful information about blood pressure:\n\n**Understanding blood pressure:**\n• Normal: Less than 120/80 mmHg\n• Elevated: 120-129 systolic, less than 80 diastolic\n• High: 130/80 mmHg or higher\n\n**Heart-healthy lifestyle approaches:**\n• Reduce sodium in your diet when possible\n• Regular gentle physical activity\n• Maintain a healthy weight\n• Limit alcohol\n• Manage stress with relaxation techniques\n• Get adequate, quality sleep\n\nAlways follow your doctor's recommendations for monitoring and any medications. Regular check-ups are important for heart health.\n\nAre you concerned about a recent reading, or would you like tips for maintaining healthy blood pressure?`,
        type: 'normal'
      };
    }

    // Heart rate inquiries
    if (message.includes('heart rate') || message.includes('pulse') || message.includes('heartbeat')) {
      const currentHR = context.recentVitals?.heartRate;
      return {
        text: `${currentHR ? `Your recent heart rate reading of ${currentHR} bpm is within normal range, which is reassuring.` : ''} Here's what you should know about heart rate:\n\n**Normal heart rate ranges:**\n• Normal adult range: 60-100 bpm at rest\n• Athletes often have: 40-60 bpm\n• Factors that affect heart rate: fitness level, age, medications, stress, caffeine, emotions\n\n**When to be gently concerned:**\n• Consistently above 100 bpm at rest\n• Below 60 bpm with symptoms (dizziness, fatigue)\n• Irregular rhythm that feels concerning\n• Sudden changes that worry you\n\n**Supporting heart health:**\n• Regular gentle exercise\n• Stress management\n• Adequate sleep\n• Staying hydrated\n• Limiting caffeine if it affects you\n\nRegular monitoring helps you understand your personal patterns. Are you noticing any changes that concern you?`,
        type: 'normal'
      };
    }

    // Pain symptoms
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache') || message.includes('sore')) {
      return {
        text: "I'm really sorry you're experiencing pain. Pain can be so draining and affect everything you do. Let me offer some gentle approaches that might help:\n\n**Gentle pain management strategies:**\n• Heat or cold therapy - use whatever feels better to you\n• Gentle stretching or movement if it doesn't worsen pain\n• Relaxation techniques and deep breathing\n• Proper rest and positioning\n• Distraction with activities you enjoy\n• Stay hydrated and nourished\n\n**When to seek medical attention:**\n• Severe or rapidly worsening pain\n• Pain after an injury\n• Pain with fever or other concerning symptoms\n• Pain that's significantly affecting your daily life\n• New or unusual pain patterns\n• Any pain that worries you\n\nChronic pain can be especially challenging, and you deserve support and effective treatment. Don't suffer in silence - there are many approaches that can help.\n\nCan you tell me more about where the pain is and how long you've been experiencing it?",
        type: 'normal'
      };
    }

    // Medication questions
    if (message.includes('medication') || message.includes('medicine') || message.includes('pill') || message.includes('drug')) {
      const meds = context.medications;
      return {
        text: `${meds?.length ? `I see you're currently taking ${meds.join(', ')}.` : ''} Medication management is really important for your health and safety:\n\n**Safe medication practices:**\n• Take medications exactly as prescribed\n• Set reminders to help with consistent timing\n• Don't skip doses without talking to your doctor\n• Store medications properly (cool, dry place)\n• Keep an updated list for emergencies\n• Ask questions if you're unsure about anything\n\n**Important reminders:**\n• Never stop medications suddenly without consulting your healthcare provider\n• Report any side effects or concerns to your doctor or pharmacist\n• Be honest about all medications and supplements you take\n• Keep medications in original containers with labels\n\n**If you're experiencing side effects or have concerns,** please reach out to your healthcare provider or pharmacist. They're there to help you.\n\nIs there something specific about your medications that's concerning you?`,
        type: 'suggestion'
      };
    }

    // Greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return {
        text: "Hello! I'm so glad you reached out. I'm here to support you with any health concerns or questions you might have. Whether you're dealing with symptoms, feeling stressed, or just want to learn about wellness, I'm here to listen and help.\n\nWhat's on your mind today? I'm here for you. 💙",
        type: 'normal'
      };
    }

    // Vague or unclear input - encourage more specific questions with empathy
    if (message.length < 10 || !message.includes(' ')) {
      return {
        text: "I want to help and support you. Could you tell me a bit more about what you're feeling or what's concerning you?\n\nFor example:\n• \"I have a headache\" - I can suggest gentle relief strategies\n• \"Feeling anxious\" - I can share calming techniques\n• \"About my medication\" - I can provide general guidance\n\nI'm here to listen and provide caring support. What would you like to talk about? 💙",
        type: 'suggestion'
      };
    }

    // Fallback response for unclear intent - more empathetic and supportive
    return {
      text: "I want to provide you with the most helpful and caring support. Based on what you've shared, I'd love to help you more specifically.\n\nCould you tell me a bit more about what's concerning you? For example:\n• Describe any symptoms you're experiencing\n• Share what's been worrying you about your health\n• Ask about specific health topics\n\nI'm here to listen without judgment and provide gentle guidance. Your wellbeing matters, and I want to support you in the best way I can. 💙\n\nRemember, while I care deeply about helping you, I'm not a doctor. For serious concerns, please don't hesitate to reach out to a healthcare provider.",
      type: 'suggestion'
    };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate typing delay and generate response
    setTimeout(() => {
      const healthContext = getHealthContext();
      const response = generateHealthResponse(input, healthContext);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Variable delay for realism
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={16} className="text-emergency-500" />;
      case 'suggestion':
        return <Heart size={16} className="text-primary-500" />;
      default:
        return <Bot size={16} className="text-primary-500" />;
    }
  };

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'warning':
        return 'bg-emergency-50 border-l-4 border-emergency-500';
      case 'suggestion':
        return 'bg-primary-50 border-l-4 border-primary-500';
      default:
        return 'bg-neutral-100';
    }
  };
  
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">ChatMate</h1>
        <div className="flex items-center text-sm text-neutral-500">
          <Heart size={16} className="mr-1 text-primary-500" />
          <span>Your caring health companion</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-xl shadow-soft">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-xl p-4 ${
                  message.sender === 'user' 
                    ? 'bg-primary-500 text-white rounded-tr-none' 
                    : `${getMessageStyle(message.type)} text-neutral-800 rounded-tl-none`
                }`}
              >
                <div className="flex items-center mb-2">
                  {message.sender === 'bot' ? (
                    getMessageIcon(message.type)
                  ) : (
                    <User size={16} className="mr-1" />
                  )}
                  <span className={`text-xs ml-1 ${message.sender === 'user' ? 'text-white/80' : 'text-neutral-500'}`}>
                    {message.sender === 'user' ? 'You' : 'ChatMate'} • {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="whitespace-pre-line leading-relaxed">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-xl p-4 rounded-tl-none max-w-[85%]">
                <div className="flex items-center mb-2">
                  <Bot size={16} className="text-primary-500 mr-1" />
                  <span className="text-xs text-neutral-500">ChatMate is typing...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's concerning you... I'm here to help 💙"
            className="input flex-1"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className={`flex-shrink-0 bg-primary-500 text-white p-2 rounded-full transition-all ${
              !input.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'
            }`}
            disabled={!input.trim() || isTyping}
          >
            <Send size={20} />
          </button>
        </form>
        <div className="text-xs text-neutral-500 mt-2 px-2">
          <p>💙 ChatMate provides caring support and general health information. I'm not a doctor, but I'm here to help. In emergencies, please call emergency services.</p>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity size={16} className="text-blue-600 mr-2" />
            <h3 className="text-sm font-semibold text-blue-800">About ChatMate</h3>
          </div>
          <p className="text-xs text-blue-700 mb-3">
            ChatMate offers thoughtful, pre-set guidance to help you manage stress, symptoms, or health concerns, even when you're offline. While it doesn't provide real-time AI answers yet, it's designed to comfort and support you like a caring friend.
          </p>
          <div className="bg-white/60 rounded-lg p-2 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">
              🚀 Coming soon: live AI chat powered by trusted sources like ChatGPT for real-time, personalized help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMate;
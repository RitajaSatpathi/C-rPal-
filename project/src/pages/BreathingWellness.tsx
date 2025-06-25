import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, Play, Pause, RotateCcw, Clock, Heart, 
  Zap, Smile, Activity, Volume2, VolumeX, ExternalLink, Info 
} from 'lucide-react';

const BreathingWellness: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary-500 p-3 rounded-full mb-4">
          <Wind className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">🧘‍♀️ Breathing & Wellness 🌸</h1>
        <p className="text-neutral-600">Find peace and balance through mindful breathing and gentle exercises 🌿✨</p>
      </div>

      <div className="space-y-6">
        <WellnessSection
          id="deep-breathing"
          title="Deep Breathing 🫁"
          icon={<Wind className="text-primary-500" size={24} />}
          benefit="Reduces stress, lowers blood pressure, improves oxygen flow. 💙"
          isActive={activeSection === 'deep-breathing'}
          onToggle={() => setActiveSection(activeSection === 'deep-breathing' ? null : 'deep-breathing')}
        >
          <DeepBreathingTimer />
        </WellnessSection>

        <WellnessSection
          id="anulom-vilom"
          title="Anulom Vilom 🧘‍♂️"
          icon={<Heart className="text-emergency-500" size={24} />}
          benefit="Balances mind, purifies lungs, improves focus. 🧠✨"
          isActive={activeSection === 'anulom-vilom'}
          onToggle={() => setActiveSection(activeSection === 'anulom-vilom' ? null : 'anulom-vilom')}
        >
          <AnulomVilomSection />
        </WellnessSection>

        <WellnessSection
          id="bhramari"
          title="Bhramari Pranayama 🐝"
          icon={<Zap className="text-warning-500" size={24} />}
          benefit="Relieves anxiety, improves sleep, calms nerves. 😴💤"
          isActive={activeSection === 'bhramari'}
          onToggle={() => setActiveSection(activeSection === 'bhramari' ? null : 'bhramari')}
        >
          <BhramariSection />
        </WellnessSection>

        <WellnessSection
          id="gut-exercises"
          title="Gut-Friendly Exercises 🤸‍♀️"
          icon={<Activity className="text-success-500" size={24} />}
          benefit="Improves digestion, reduces bloating, strengthens core. 🌟"
          isActive={activeSection === 'gut-exercises'}
          onToggle={() => setActiveSection(activeSection === 'gut-exercises' ? null : 'gut-exercises')}
        >
          <GutExercisesSection />
        </WellnessSection>

        <WellnessSection
          id="meditation"
          title="Soothing Meditation 🌅"
          icon={<Smile className="text-info-500" size={24} />}
          benefit="Promotes deep relaxation, reduces anxiety, improves mental clarity. 🌈"
          isActive={activeSection === 'meditation'}
          onToggle={() => setActiveSection(activeSection === 'meditation' ? null : 'meditation')}
        >
          <MeditationSection />
        </WellnessSection>
      </div>
    </div>
  );
};

interface WellnessSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  benefit: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const WellnessSection: React.FC<WellnessSectionProps> = ({
  title,
  icon,
  benefit,
  isActive,
  onToggle,
  children
}) => {
  return (
    <div className="card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors"
      >
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <div className="text-left">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{benefit}</p>
          </div>
        </div>
        <div className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      {isActive && (
        <div className="mt-4 pt-4 border-t border-neutral-200 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

const DeepBreathingTimer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Default to 5 minutes
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for alarm sound
    alarmAudioRef.current = new Audio('/digital-alarm-beeping-slava-pogorelsky-1-00-06.mp3');
    alarmAudioRef.current.volume = 0.7;
  }, []);

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Could not play alarm sound due to browser restrictions');
      });
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setPhaseTime(prev => prev + 1);
        
        // Cycle through phases: 4s inhale, 4s hold, 6s exhale
        if (phaseTime >= 4 && phase === 'inhale') {
          setPhase('hold');
          setPhaseTime(0);
        } else if (phaseTime >= 4 && phase === 'hold') {
          setPhase('exhale');
          setPhaseTime(0);
        } else if (phaseTime >= 6 && phase === 'exhale') {
          setPhase('inhale');
          setPhaseTime(0);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeLeft === 0 && isActive) {
        playAlarm();
        setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, phase, phaseTime]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setPhase('inhale');
    setPhaseTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case 'inhale': return '🌬️';
      case 'hold': return '⏸️';
      case 'exhale': return '💨';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return '🌬️ Breathe in slowly through your nose';
      case 'hold': return '⏸️ Hold your breath gently';
      case 'exhale': return '💨 Breathe out slowly through your mouth';
    }
  };

  const durations = [
    { label: '5 min ⏰', value: 300 },
    { label: '10 min ⏰', value: 600 }
  ];

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
          phase === 'inhale' ? 'border-primary-500 bg-primary-50 scale-110' :
          phase === 'hold' ? 'border-warning-500 bg-warning-50 scale-105' :
          'border-info-500 bg-info-50 scale-95'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-1">{getPhaseEmoji()}</div>
            <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
            <div className="text-sm capitalize font-medium">{phase}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium capitalize mb-2">{phase} {getPhaseEmoji()}</p>
        <div className="text-sm text-neutral-600">
          {getPhaseInstruction()}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="flex justify-center gap-2 mb-4">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => {
              setSelectedDuration(duration.value);
              setTimeLeft(duration.value);
              setIsActive(false);
              setPhase('inhale');
              setPhaseTime(0);
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedDuration === duration.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {duration.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`btn ${isActive ? 'btn-outline' : 'btn-primary'} flex items-center`}
          disabled={timeLeft === 0}
        >
          {isActive ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
          {isActive ? '⏸️ Pause' : '▶️ Start'}
        </button>
        <button onClick={resetTimer} className="btn-outline flex items-center">
          <RotateCcw size={16} className="mr-1" />
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

const AnulomVilomSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Default to 5 minutes
  const [selectedDuration, setSelectedDuration] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for alarm sound
    alarmAudioRef.current = new Audio('/digital-alarm-beeping-slava-pogorelsky-1-00-06.mp3');
    alarmAudioRef.current.volume = 0.7;
  }, []);

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Could not play alarm sound due to browser restrictions');
      });
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeLeft === 0 && isActive) {
        playAlarm();
        setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const durations = [
    { label: '5 min ⏰', value: 300 },
    { label: '10 min ⏰', value: 600 }
  ];

  return (
    <div>
      <div className="mb-6">
        <h4 className="font-medium mb-3">🌟 Steps:</h4>
        <ol className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
            🧘‍♂️ Sit comfortably with your spine straight
          </li>
          <li className="flex items-start">
            <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
            👃 Close right nostril with thumb and inhale through left nostril
          </li>
          <li className="flex items-start">
            <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
            🔄 Close left nostril with ring finger and exhale through right nostril
          </li>
          <li className="flex items-start">
            <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
            🔁 Repeat the cycle alternating nostrils
          </li>
        </ol>
      </div>

      <div className="mb-6 bg-neutral-100 rounded-lg p-4">
        <div className="mb-3 flex justify-center">
          <img 
            src="/ANULOM VILOM.jpg" 
            alt="Anulom Vilom Breathing Technique - Step by step circular diagram showing alternate nostril breathing pattern"
            className="w-full max-w-sm h-auto rounded-lg shadow-sm"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'w-full h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center';
              fallbackDiv.innerHTML = '<p class="text-primary-700 font-medium">🌬️ Anulom Vilom Breathing Guide 🧘‍♂️</p>';
              e.currentTarget.parentNode?.insertBefore(fallbackDiv, e.currentTarget);
            }}
          />
        </div>
        <p className="text-xs text-neutral-600 text-center">
          🎯 Follow the circular pattern: Alternate nostril breathing technique for mental balance
        </p>
      </div>

      <div className="text-center">
        <div className="mb-4">
          <div className="text-3xl font-bold mb-4">⏰ {formatTime(timeLeft)}</div>
          
          {/* Duration Selection */}
          <div className="flex justify-center gap-2 mb-4">
            {durations.map((duration) => (
              <button
                key={duration.value}
                onClick={() => {
                  setSelectedDuration(duration.value);
                  setTimeLeft(duration.value);
                  setIsActive(false);
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedDuration === duration.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`btn ${isActive ? 'btn-outline' : 'btn-primary'} flex items-center`}
              disabled={timeLeft === 0}
            >
              {isActive ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
              {isActive ? '⏸️ Pause' : '▶️ Start Timer'}
            </button>
            <button onClick={resetTimer} className="btn-outline flex items-center">
              <RotateCcw size={16} className="mr-1" />
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BhramariSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Default to 5 minutes
  const [selectedDuration, setSelectedDuration] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for alarm sound
    alarmAudioRef.current = new Audio('/digital-alarm-beeping-slava-pogorelsky-1-00-06.mp3');
    alarmAudioRef.current.volume = 0.7;
  }, []);

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Could not play alarm sound due to browser restrictions');
      });
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeLeft === 0 && isActive) {
        playAlarm();
        setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const durations = [
    { label: '5 min ⏰', value: 300 },
    { label: '10 min ⏰', value: 600 }
  ];

  return (
    <div>
      <div className="mb-6">
        <h4 className="font-medium mb-3">🌟 Steps:</h4>
        <ol className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="bg-warning-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
            🧘‍♀️ Sit straight with eyes closed in a comfortable position
          </li>
          <li className="flex items-start">
            <span className="bg-warning-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
            👂 Close your ears with thumbs and inhale deeply
          </li>
          <li className="flex items-start">
            <span className="bg-warning-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
            🐝 Exhale slowly while making a humming sound like a bee
          </li>
        </ol>
      </div>

      <div className="mb-6 bg-neutral-100 rounded-lg p-4">
        <div className="mb-3 flex justify-center">
          <img 
            src="/BHRAMRI.jpg" 
            alt="Bhramari Pranayama - Bee breathing technique showing proper hand position and posture"
            className="w-full max-w-sm h-auto rounded-lg shadow-sm"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'w-full h-64 bg-gradient-to-br from-warning-100 to-warning-200 rounded-lg flex items-center justify-center';
              fallbackDiv.innerHTML = '<p class="text-warning-700 font-medium">🐝 Bhramari Pranayama Guide 🎵</p>';
              e.currentTarget.parentNode?.insertBefore(fallbackDiv, e.currentTarget);
            }}
          />
        </div>
        <p className="text-xs text-neutral-600 text-center">
          🐝 Bhramari Pranayama (Bee Breathing) - Close ears with thumbs and make humming sound
        </p>
      </div>

      <div className="text-center">
        <div className="mb-4">
          <div className="text-3xl font-bold mb-4">⏰ {formatTime(timeLeft)}</div>
          
          {/* Duration Selection */}
          <div className="flex justify-center gap-2 mb-4">
            {durations.map((duration) => (
              <button
                key={duration.value}
                onClick={() => {
                  setSelectedDuration(duration.value);
                  setTimeLeft(duration.value);
                  setIsActive(false);
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedDuration === duration.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {duration.label}
              </button>
            ))}
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`btn ${isActive ? 'btn-outline' : 'btn-primary'} flex items-center`}
              disabled={timeLeft === 0}
            >
              {isActive ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
              {isActive ? '⏸️ Pause' : '▶️ Start Timer'}
            </button>
            <button onClick={resetTimer} className="btn-outline flex items-center">
              <RotateCcw size={16} className="mr-1" />
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GutExercisesSection: React.FC = () => {
  const exercises = [
    {
      name: "🦵 Leg Raises",
      description: "Progressive leg raise exercise for core strength and digestion",
      duration: "6 steps",
      image: "/LEG RAISE.webp",
      isSpecial: true
    },
    {
      name: "🧘‍♂️ Bajrasana (Thunderbolt Pose)",
      description: "Traditional sitting pose for improved digestion and mental calm",
      duration: "5-10 minutes",
      image: "/Screenshot 2025-06-17 064459.png",
      isSpecial: true
    },
    {
      name: "🤗 Knee to Chest",
      description: "Progressive knee-to-chest exercise for digestive health",
      duration: "3 steps",
      image: "/KNEE TO CHEST.jpg",
      isSpecial: true
    },
    {
      name: "🌪️ Gentle Twists",
      description: "Seated spinal twists to aid digestion",
      duration: "5 each side",
      image: "/image copy.png",
      isSpecial: true
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="bg-neutral-50 rounded-lg p-4">
            <div className="mb-3">
              <img 
                src={exercise.image} 
                alt={exercise.name}
                className="w-full h-48 object-contain rounded-lg bg-white"
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4ZXJjaXNlIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{exercise.name}</h4>
              <span className="text-xs text-neutral-500 bg-white px-2 py-1 rounded-full">⏱️ {exercise.duration}</span>
            </div>
            <p className="text-sm text-neutral-600 mb-3">{exercise.description}</p>
            
            {/* Special steps for exercises */}
            {exercise.isSpecial && exercise.name.includes("Leg Raises") && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
                <h5 className="font-medium text-sm mb-2 text-primary-600">🎯 Six-Step Progression:</h5>
                <ol className="space-y-1 text-xs text-neutral-600">
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">1</span>
                    📐 Raise legs to 45° (hold 5 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">2</span>
                    📐 Raise legs to 60° (hold 5 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">3</span>
                    📐 Raise legs to 90° (hold 5 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">4</span>
                    📐 Lower legs to 60° (hold 5 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">5</span>
                    📐 Lower legs to 45° (hold 5 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">6</span>
                    🔄 Lower legs to starting position
                  </li>
                </ol>
              </div>
            )}

            {/* Special steps for Bajrasana exercise */}
            {exercise.isSpecial && exercise.name.includes("Bajrasana") && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
                <h5 className="font-medium text-sm mb-2 text-primary-600">🎯 Four Steps for Bajrasana:</h5>
                <ol className="space-y-1 text-xs text-neutral-600">
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">1</span>
                    🧘‍♂️ Sit on your heels with knees together and spine straight
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">2</span>
                    🙏 Place your hands gently on your thighs, palms down
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">3</span>
                    😌 Keep your shoulders relaxed and breathe deeply
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">4</span>
                    🍽️ This pose aids digestion and calms the mind. Best done after meals for 5–10 minutes
                  </li>
                </ol>
              </div>
            )}

            {/* Special steps for Knee to Chest exercise */}
            {exercise.isSpecial && exercise.name.includes("Knee to Chest") && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
                <h5 className="font-medium text-sm mb-2 text-primary-600">🎯 Three-Step Progression:</h5>
                <ol className="space-y-1 text-xs text-neutral-600">
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">1</span>
                    🦵 Left leg to chest (hold 30 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">2</span>
                    🦵 Right leg to chest (hold 30 seconds)
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">3</span>
                    🤗 Both legs together (hold 30 seconds)
                  </li>
                </ol>
              </div>
            )}

            {/* Special steps for Gentle Twists exercise */}
            {exercise.isSpecial && exercise.name.includes("Gentle Twists") && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
                <h5 className="font-medium text-sm mb-2 text-primary-600">🎯 Three Steps for Gentle Twists:</h5>
                <ol className="space-y-1 text-xs text-neutral-600">
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">1</span>
                    🧘‍♀️ Sit with legs extended, then bend your right knee over the left
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">2</span>
                    🤲 Place your right hand behind and left elbow outside the right knee
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2">3</span>
                    🌪️ Inhale to lengthen, exhale to gently twist right. Hold and repeat on the other side
                  </li>
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-success-50 rounded-lg">
        <p className="text-sm text-success-700">
          💡 <strong>Tip:</strong> Perform these exercises 30 minutes after meals for best results. 🍽️✨
        </p>
      </div>
    </div>
  );
};

const MeditationSection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [selectedMusic, setSelectedMusic] = useState<'ambient-jam' | 'stillness-tranquility'>('ambient-jam');
  const [isMuted, setIsMuted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Music options with updated emojis
  const musicOptions = [
    {
      id: 'ambient-jam' as const,
      name: 'Ambient Jam',
      description: 'Flowing ambient soundscape',
      file: '/ambient-jam-tecnosine-main-version-04-25-13878.mp3',
      artist: 'Tecnosine',
      emoji: '🌊' // Wave emoji for ambient jam
    },
    {
      id: 'stillness-tranquility' as const,
      name: 'In Stillness Tranquility',
      description: 'Peaceful and serene meditation music',
      file: '/in-stillness-tranquilium-main-version-28147-03-41.mp3',
      artist: 'Tranquilium',
      emoji: '🕯️' // Candle emoji for stillness tranquility
    }
  ];

  useEffect(() => {
    // Create alarm audio
    alarmAudioRef.current = new Audio('/digital-alarm-beeping-slava-pogorelsky-1-00-06.mp3');
    alarmAudioRef.current.volume = 0.7;

    // Create meditation audio
    const selectedMusicOption = musicOptions.find(m => m.id === selectedMusic);
    if (selectedMusicOption) {
      audioRef.current = new Audio(selectedMusicOption.file);
      audioRef.current.loop = true; // Enable looping
      audioRef.current.volume = 0.4;
      audioRef.current.preload = 'auto';
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedMusic]);

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.play().catch(() => {
        console.log('Could not play alarm sound due to browser restrictions');
      });
    }
  };

  const toggleAmbientSound = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmuting - start playing if meditation is active
        if (isActive) {
          audioRef.current.play().catch(() => {
            console.log('Could not play audio due to browser restrictions');
          });
        }
      } else {
        // Muting - pause the audio
        audioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  };

  const handleMusicChange = (musicId: 'ambient-jam' | 'stillness-tranquility') => {
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setSelectedMusic(musicId);
    setIsActive(false); // Stop timer when changing music
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      // Start ambient sounds if not muted and audio is available
      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {
          console.log('Could not play audio due to browser restrictions');
        });
      }

    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (timeLeft === 0 && isActive) {
        playAlarm();
        setIsActive(false);
      }
      
      // Pause ambient sounds when timer stops
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, isMuted]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Dropdown duration options from 5 to 60 minutes
  const durations = [
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
    { label: '25 min', value: 1500 },
    { label: '30 min', value: 1800 },
    { label: '35 min', value: 2100 },
    { label: '40 min', value: 2400 },
    { label: '45 min', value: 2700 },
    { label: '50 min', value: 3000 },
    { label: '55 min', value: 3300 },
    { label: '60 min', value: 3600 }
  ];

  const selectedMusicOption = musicOptions.find(m => m.id === selectedMusic);

  return (
    <div>
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-2">🧘‍♀️</div>
          <p className="text-sm text-neutral-600">🌸 Find your inner peace and tranquility 🌿</p>
        </div>
        
        <div className="mb-4">
          <div className="text-3xl font-bold mb-2">⏰ {formatTime(timeLeft)}</div>
          
          {/* Dropdown Duration Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">⏰ Choose Duration:</label>
            <select
              value={selectedDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setSelectedDuration(newDuration);
                setTimeLeft(newDuration);
                setIsActive(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                }
              }}
              className="input max-w-xs mx-auto"
            >
              {durations.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Music Selection */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">🎵 Choose Your Meditation Music:</h4>
          <div className="flex justify-center gap-2 mb-4">
            {musicOptions.map((music) => (
              <button
                key={music.id}
                onClick={() => handleMusicChange(music.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedMusic === music.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{music.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{music.name}</div>
                    <div className="text-xs opacity-75">{music.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500">
            Currently selected: {selectedMusicOption?.emoji} {selectedMusicOption?.name} by {selectedMusicOption?.artist}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`btn ${isActive ? 'btn-outline' : 'btn-primary'} flex items-center`}
            disabled={timeLeft === 0}
          >
            {isActive ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
            {isActive ? '⏸️ Pause' : '▶️ Start'}
          </button>
          <button onClick={resetTimer} className="btn-outline flex items-center">
            <RotateCcw size={16} className="mr-1" />
            🔄 Reset
          </button>
          <button
            onClick={toggleAmbientSound}
            className="btn-outline flex items-center"
            title={isMuted ? 'Enable ambient music' : 'Disable ambient music'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isMuted ? '🔇' : '🎵'}
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-neutral-600 mb-4">
        <p className="mb-2">🎵 {isMuted ? 'Ambient music is muted 🔇' : `Playing: ${selectedMusicOption?.emoji} ${selectedMusicOption?.name} 🎵`}</p>
        <p className="mb-2">🎧 <strong>Pro tip:</strong> Use headphones for the best ambient experience</p>
        <p>✨ Close your eyes, breathe naturally, and let your mind rest. 🧘‍♀️💫</p>
      </div>

      {/* Music Credits Button */}
      <div className="text-center">
        <button
          onClick={() => setShowCredits(true)}
          className="btn-outline py-2 px-4 flex items-center mx-auto text-sm"
        >
          <Info size={16} className="mr-2" />
          🎵 Music Credits
        </button>
      </div>

      {/* Music Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                🎵 Music Credits
              </h2>
              <button 
                onClick={() => setShowCredits(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Ambient Jam Credits */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  🌊 Ambient Jam by Tecnosine
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Beautiful ambient music that enhances your meditation experience
                </p>
                
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-neutral-600 mb-2">
                    <strong>Music from #Uppbeat (free for Creators!):</strong>
                  </p>
                  <a 
                    href="https://uppbeat.io/t/tecnosine/ambient-jam" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    https://uppbeat.io/t/tecnosine/ambient-jam
                  </a>
                  <p className="text-xs text-neutral-500 mt-2">
                    <strong>License code:</strong> QJN7LDKLBWJUQIQB
                  </p>
                </div>
              </div>

              {/* In Stillness Tranquility Credits */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  🕯️ In Stillness Tranquility by Tranquilium
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  Peaceful and serene meditation music for deep relaxation
                </p>
                
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs text-neutral-600 mb-2">
                    <strong>Music from #Uppbeat (free for Creators!):</strong>
                  </p>
                  <a 
                    href="https://uppbeat.io/t/tranquilium/in-stillness" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm underline flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    https://uppbeat.io/t/tranquilium/in-stillness
                  </a>
                  <p className="text-xs text-neutral-500 mt-2">
                    <strong>License code:</strong> NTZBKGFOWLMBCXXO
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-neutral-500">
                  🙏 Thank you to Tecnosine, Tranquilium, and Uppbeat for providing this beautiful music for creators!
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setShowCredits(false)}
                className="btn-primary px-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingWellness;
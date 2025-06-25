import React, { useState } from 'react';
import { 
  Activity, Heart, Thermometer, Droplets, Plus, 
  TrendingUp, Scale, Zap, PlusCircle, ChevronRight, X, Check, Target, AlertTriangle, Trash2 
} from 'lucide-react';

interface VitalReading {
  id: string;
  type: 'heart-rate' | 'blood-pressure' | 'temperature' | 'blood-oxygen';
  value: string;
  timestamp: Date;
}

interface Symptom {
  id: string;
  title: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  duration: string;
  description: string;
  startDate: Date;
  resolved?: boolean;
  resolvedDate?: Date;
}

interface Metric {
  id: string;
  type: 'weight' | 'sleep';
  value: number;
  unit: string;
  timestamp: Date;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  achieved: number;
  unit: string;
}

const HealthTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vitals');
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Health Tracker</h1>
      
      <div className="flex border-b mb-6 overflow-x-auto">
        <TabButton 
          id="vitals" 
          label="Vitals" 
          icon={<Activity size={18} />} 
          isActive={activeTab === 'vitals'} 
          onClick={() => setActiveTab('vitals')} 
        />
        <TabButton 
          id="symptoms" 
          label="Symptoms" 
          icon={<Thermometer size={18} />} 
          isActive={activeTab === 'symptoms'} 
          onClick={() => setActiveTab('symptoms')} 
        />
        <TabButton 
          id="metrics" 
          label="Metrics" 
          icon={<Scale size={18} />} 
          isActive={activeTab === 'metrics'} 
          onClick={() => setActiveTab('metrics')} 
        />
      </div>
      
      <div className="animate-fade-in">
        {activeTab === 'vitals' && <VitalsTab />}
        {activeTab === 'symptoms' && <SymptomsTab />}
        {activeTab === 'metrics' && <MetricsTab />}
      </div>
    </div>
  );
};

interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, isActive, onClick }) => {
  return (
    <button
      id={id}
      className={`flex items-center px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
        isActive ? 'tab-active' : 'text-neutral-500 hover:text-neutral-800'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

const VitalsTab: React.FC = () => {
  const [recentReadings, setRecentReadings] = useState<VitalReading[]>([]);
  const [showAddReading, setShowAddReading] = useState(false);
  const [showVitalWarning, setShowVitalWarning] = useState(false);
  const [vitalWarningMessage, setVitalWarningMessage] = useState('');
  const [newReading, setNewReading] = useState({
    type: 'heart-rate' as VitalReading['type'],
    value: '',
    systolic: '',
    diastolic: ''
  });

  // Function to check if vital reading is within normal range
  const checkVitalRange = (type: VitalReading['type'], value: string): { isNormal: boolean; message: string } => {
    switch (type) {
      case 'heart-rate':
        const hr = parseInt(value);
        if (hr < 60) {
          return {
            isNormal: false,
            message: "Your heart rate seems unusually low. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        } else if (hr > 100) {
          return {
            isNormal: false,
            message: "Your heart rate seems unusually high. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        }
        break;
      
      case 'blood-pressure':
        const [systolic, diastolic] = value.split('/').map(v => parseInt(v));
        if (systolic < 90 || diastolic < 60) {
          return {
            isNormal: false,
            message: "Your blood pressure seems unusually low. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        } else if (systolic > 140 || diastolic > 90) {
          return {
            isNormal: false,
            message: "Your blood pressure seems unusually high. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        }
        break;
      
      case 'temperature':
        const temp = parseFloat(value);
        if (temp < 97.0) {
          return {
            isNormal: false,
            message: "Your temperature seems unusually low. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        } else if (temp > 100.4) {
          return {
            isNormal: false,
            message: "Your temperature seems unusually high. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        }
        break;
      
      case 'blood-oxygen':
        const oxygen = parseInt(value);
        if (oxygen < 95) {
          return {
            isNormal: false,
            message: "Your blood oxygen level seems unusually low. Please stay calm and consider contacting a medical professional or using the emergency feature."
          };
        }
        break;
    }
    
    return { isNormal: true, message: '' };
  };

  const handleAddReading = () => {
    if (!newReading.value && newReading.type !== 'blood-pressure') return;
    if (newReading.type === 'blood-pressure' && (!newReading.systolic || !newReading.diastolic)) return;

    const finalValue = newReading.type === 'blood-pressure' 
      ? `${newReading.systolic}/${newReading.diastolic}` 
      : newReading.value;

    // Check vital range
    const rangeCheck = checkVitalRange(newReading.type, finalValue);
    
    const reading: VitalReading = {
      id: Date.now().toString(),
      type: newReading.type,
      value: finalValue,
      timestamp: new Date()
    };

    setRecentReadings(prev => [reading, ...prev]);
    setNewReading({ type: 'heart-rate', value: '', systolic: '', diastolic: '' });
    setShowAddReading(false);

    // Show warning if vital is out of normal range
    if (!rangeCheck.isNormal) {
      setVitalWarningMessage(rangeCheck.message);
      setShowVitalWarning(true);
    }
  };

  const handleDeleteReading = (id: string) => {
    setRecentReadings(prev => prev.filter(reading => reading.id !== id));
  };

  const getLatestReading = (type: VitalReading['type']) => {
    return recentReadings.find(reading => reading.type === type);
  };

  const getReadingIcon = (type: VitalReading['type']) => {
    switch (type) {
      case 'heart-rate': return <Heart className="text-emergency-500" size={20} />;
      case 'blood-pressure': return <Activity className="text-primary-500" size={20} />;
      case 'temperature': return <Thermometer className="text-warning-500" size={20} />;
      case 'blood-oxygen': return <Droplets className="text-info-500" size={20} />;
    }
  };

  const getReadingTitle = (type: VitalReading['type']) => {
    switch (type) {
      case 'heart-rate': return 'Heart Rate';
      case 'blood-pressure': return 'Blood Pressure';
      case 'temperature': return 'Temperature';
      case 'blood-oxygen': return 'Blood Oxygen';
    }
  };

  const getReadingUnit = (type: VitalReading['type']) => {
    switch (type) {
      case 'heart-rate': return 'bpm';
      case 'blood-pressure': return 'mmHg';
      case 'temperature': return '°F';
      case 'blood-oxygen': return '%';
    }
  };

  return (
    <div>
      {/* Normal Ranges Information - Four Boxes in One Horizontal Line */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded mr-3 flex items-center justify-center">
            <Activity className="text-white" size={14} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Normal Vital Ranges</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Heart Rate Box */}
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <Heart className="text-red-500 mr-2" size={16} />
              <span className="text-blue-600 font-semibold text-sm">Heart Rate:</span>
            </div>
            <p className="text-blue-600 text-sm">60-100 bpm (adults)</p>
          </div>

          {/* Blood Pressure Box */}
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <Activity className="text-green-500 mr-2" size={16} />
              <span className="text-blue-600 font-semibold text-sm">Blood Pressure:</span>
            </div>
            <p className="text-blue-600 text-sm">Less than 120/80 mmHg</p>
          </div>

          {/* Temperature Box */}
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <Thermometer className="text-orange-500 mr-2" size={16} />
              <span className="text-blue-600 font-semibold text-sm">Temperature:</span>
            </div>
            <p className="text-blue-600 text-sm">97.8-99.1°F (36.5-37.3°C)</p>
          </div>

          {/* Blood Oxygen Box */}
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center mb-2">
              <Droplets className="text-blue-500 mr-2" size={16} />
              <span className="text-blue-600 font-semibold text-sm">Blood Oxygen:</span>
            </div>
            <p className="text-blue-600 text-sm">95-100%</p>
          </div>
        </div>
      </div>

      {/* Current Vitals Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <VitalCard 
          icon={<Heart className="text-emergency-500" size={24} />}
          title="Heart Rate"
          value={getLatestReading('heart-rate')?.value || ""}
          unit="bpm"
          trend="normal"
          isEmpty={!getLatestReading('heart-rate')}
        />
        <VitalCard 
          icon={<Activity className="text-primary-500" size={24} />}
          title="Blood Pressure"
          value={getLatestReading('blood-pressure')?.value || ""}
          unit="mmHg"
          trend="normal"
          isEmpty={!getLatestReading('blood-pressure')}
        />
        <VitalCard 
          icon={<Thermometer className="text-warning-500" size={24} />}
          title="Temperature"
          value={getLatestReading('temperature')?.value || ""}
          unit="°F"
          trend="normal"
          isEmpty={!getLatestReading('temperature')}
        />
        <VitalCard 
          icon={<Droplets className="text-info-500" size={24} />}
          title="Blood Oxygen"
          value={getLatestReading('blood-oxygen')?.value || ""}
          unit="%"
          trend="normal"
          isEmpty={!getLatestReading('blood-oxygen')}
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Recent Readings</h3>
        <button 
          onClick={() => setShowAddReading(true)}
          className="btn-outline py-1 px-3 flex items-center text-sm"
        >
          <Plus size={16} className="mr-1" />
          Add Reading
        </button>
      </div>
      
      {/* Recent Readings Section */}
      {recentReadings.length === 0 ? (
        <div className="card">
          <div className="text-center py-8 text-neutral-500">
            <Activity size={48} className="mx-auto mb-4 text-neutral-300" />
            <p className="text-lg font-medium mb-2">No recent readings</p>
            <p className="text-sm mb-4">Start tracking your vitals by adding readings for:</p>
            
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
              <div className="flex items-center text-sm text-neutral-600">
                <Heart className="text-emergency-500 mr-2" size={16} />
                Heart Rate
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Activity className="text-primary-500 mr-2" size={16} />
                Blood Pressure
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Thermometer className="text-warning-500 mr-2" size={16} />
                Temperature
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Droplets className="text-info-500 mr-2" size={16} />
                Blood Oxygen
              </div>
            </div>
            
            <button 
              onClick={() => setShowAddReading(true)}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus size={16} className="mr-1" />
              Add Your First Reading
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recentReadings.map((reading) => (
            <ReadingItem 
              key={reading.id}
              icon={getReadingIcon(reading.type)}
              title={getReadingTitle(reading.type)}
              value={`${reading.value} ${getReadingUnit(reading.type)}`}
              time={reading.timestamp.toLocaleString()}
              onDelete={() => handleDeleteReading(reading.id)}
            />
          ))}
        </div>
      )}

      {/* Vital Warning Modal */}
      {showVitalWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="text-center mb-4">
              <AlertTriangle className="text-emergency-500 mx-auto mb-3" size={48} />
              <h2 className="text-xl font-bold text-emergency-700 mb-2">Vital Alert</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-neutral-700 leading-relaxed">{vitalWarningMessage}</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowVitalWarning(false)}
                className="btn-outline flex-1"
              >
                I Understand
              </button>
              <button 
                onClick={() => {
                  setShowVitalWarning(false);
                  // Navigate to emergency features
                  window.location.href = '/panic-alert';
                }}
                className="btn-emergency flex-1"
              >
                Emergency Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reading Modal */}
      {showAddReading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Vital Reading</h2>
              <button 
                onClick={() => setShowAddReading(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Vital Type *</label>
                <select
                  value={newReading.type}
                  onChange={(e) => setNewReading(prev => ({ ...prev, type: e.target.value as VitalReading['type'] }))}
                  className="input"
                  required
                >
                  <option value="heart-rate">Heart Rate (bpm)</option>
                  <option value="blood-pressure">Blood Pressure (mmHg)</option>
                  <option value="temperature">Temperature (°F)</option>
                  <option value="blood-oxygen">Blood Oxygen (%)</option>
                </select>
              </div>
              
              {newReading.type === 'blood-pressure' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Systolic *</label>
                    <input
                      type="number"
                      value={newReading.systolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, systolic: e.target.value }))}
                      className="input"
                      placeholder="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Diastolic *</label>
                    <input
                      type="number"
                      value={newReading.diastolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, diastolic: e.target.value }))}
                      className="input"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Value * ({getReadingUnit(newReading.type)})
                  </label>
                  <input
                    type="number"
                    step={newReading.type === 'temperature' ? '0.1' : '1'}
                    value={newReading.value}
                    onChange={(e) => setNewReading(prev => ({ ...prev, value: e.target.value }))}
                    className="input"
                    placeholder={
                      newReading.type === 'heart-rate' ? '72' :
                      newReading.type === 'temperature' ? '98.6' :
                      newReading.type === 'blood-oxygen' ? '98' : ''
                    }
                    required
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddReading(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReading}
                disabled={
                  newReading.type === 'blood-pressure' 
                    ? !newReading.systolic || !newReading.diastolic
                    : !newReading.value
                }
                className={`btn-primary flex-1 ${
                  (newReading.type === 'blood-pressure' 
                    ? !newReading.systolic || !newReading.diastolic
                    : !newReading.value)
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Add Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface VitalCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'normal';
  isEmpty?: boolean;
}

const VitalCard: React.FC<VitalCardProps> = ({ icon, title, value, unit, trend, isEmpty = false }) => {
  return (
    <div className="card flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
      {isEmpty ? (
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-neutral-300">--</span>
          <span className="text-sm text-neutral-400 ml-1">{unit}</span>
          <div className="flex items-center mt-1">
            <span className="text-xs text-neutral-400">No data</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-neutral-500 ml-1">{unit}</span>
          </div>
          <div className="flex items-center mt-1">
            {trend === 'up' && <TrendingUp size={16} className="text-success-500 mr-1" />}
            {trend === 'down' && <TrendingUp size={16} className="text-emergency-500 mr-1 transform rotate-180" />}
            <span className="text-xs text-neutral-500">
              {trend === 'normal' ? 'Normal Range' : trend === 'up' ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

interface ReadingItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  time: string;
  onDelete: () => void;
}

const ReadingItem: React.FC<ReadingItemProps> = ({ icon, title, value, time, onDelete }) => {
  return (
    <div className="card flex items-center">
      <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <div className="flex justify-between">
          <p className="text-sm text-neutral-500">{time}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      </div>
      <button 
        onClick={onDelete}
        className="text-neutral-400 hover:text-emergency-500 p-2 ml-2"
        title="Delete reading"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const SymptomsTab: React.FC = () => {
  const [currentSymptoms, setCurrentSymptoms] = useState<Symptom[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<Symptom[]>([]);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    title: '',
    severity: 'Mild' as Symptom['severity'],
    duration: '',
    description: ''
  });

  const handleAddSymptom = () => {
    if (!newSymptom.title || !newSymptom.duration) return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      title: newSymptom.title,
      severity: newSymptom.severity,
      duration: newSymptom.duration,
      description: newSymptom.description,
      startDate: new Date()
    };

    setCurrentSymptoms(prev => [...prev, symptom]);
    setNewSymptom({ title: '', severity: 'Mild', duration: '', description: '' });
    setShowAddSymptom(false);
  };

  const resolveSymptom = (id: string) => {
    const symptom = currentSymptoms.find(s => s.id === id);
    if (symptom) {
      const resolvedSymptom = { ...symptom, resolved: true, resolvedDate: new Date() };
      setSymptomHistory(prev => [resolvedSymptom, ...prev]);
      setCurrentSymptoms(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Current Symptoms</h3>
        <button 
          onClick={() => setShowAddSymptom(true)}
          className="btn-outline py-1 px-3 flex items-center text-sm"
        >
          <PlusCircle size={16} className="mr-1" />
          Add Symptom
        </button>
      </div>
      
      {/* Current Symptoms */}
      {currentSymptoms.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 mb-6">
          <Thermometer size={48} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-lg font-medium mb-2">No current symptoms</p>
          <p className="text-sm">Track symptoms to monitor your health patterns</p>
          <button 
            onClick={() => setShowAddSymptom(true)}
            className="btn-primary mt-4 flex items-center mx-auto"
          >
            <PlusCircle size={16} className="mr-1" />
            Add Your First Symptom
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {currentSymptoms.map((symptom) => (
            <SymptomItem 
              key={symptom.id}
              title={symptom.title}
              severity={symptom.severity}
              duration={symptom.duration}
              description={symptom.description}
              onResolve={() => resolveSymptom(symptom.id)}
            />
          ))}
        </div>
      )}
      
      {/* Symptom History */}
      <div className="card">
        <h3 className="font-medium mb-3">Symptom History</h3>
        {symptomHistory.length === 0 ? (
          <div className="text-center py-6 text-neutral-500">
            <Activity size={32} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-sm font-medium mb-1">No symptom history</p>
            <p className="text-xs">Past symptoms will appear here once resolved</p>
          </div>
        ) : (
          <div className="space-y-3">
            {symptomHistory.map((symptom) => (
              <HistoryItem 
                key={symptom.id}
                title={symptom.title}
                dates={`${symptom.startDate.toLocaleDateString()} - ${symptom.resolvedDate?.toLocaleDateString()}`}
                resolved={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Symptom Modal */}
      {showAddSymptom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Symptom</h2>
              <button 
                onClick={() => setShowAddSymptom(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Symptom *</label>
                <input
                  type="text"
                  value={newSymptom.title}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                  placeholder="e.g., Headache, Fatigue, Nausea"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Severity *</label>
                <select
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, severity: e.target.value as Symptom['severity'] }))}
                  className="input"
                  required
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Duration *</label>
                <input
                  type="text"
                  value={newSymptom.duration}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, duration: e.target.value }))}
                  className="input"
                  placeholder="e.g., 2 hours, 3 days, 1 week"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newSymptom.description}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, description: e.target.value }))}
                  className="input"
                  placeholder="Additional details about the symptom"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddSymptom(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSymptom}
                disabled={!newSymptom.title || !newSymptom.duration}
                className={`btn-primary flex-1 ${
                  !newSymptom.title || !newSymptom.duration
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Add Symptom
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SymptomItemProps {
  title: string;
  severity: string;
  duration: string;
  description: string;
  onResolve?: () => void;
}

const SymptomItem: React.FC<SymptomItemProps> = ({ title, severity, duration, description, onResolve }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            severity === 'Mild' 
              ? 'bg-primary-100 text-primary-700' 
              : severity === 'Moderate' 
              ? 'bg-warning-100 text-warning-700' 
              : 'bg-emergency-100 text-emergency-700'
          }`}>
            {severity}
          </div>
          {onResolve && (
            <button
              onClick={onResolve}
              className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full hover:bg-success-200"
            >
              Mark Resolved
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-neutral-500 mb-1">Duration: {duration}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};

interface HistoryItemProps {
  title: string;
  dates: string;
  resolved: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ title, dates, resolved }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-200 last:border-0">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-neutral-500">{dates}</p>
      </div>
      {resolved && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
          Resolved
        </span>
      )}
    </div>
  );
};

const MetricsTab: React.FC = () => {
  const [weightData, setWeightData] = useState<Metric[]>([]);
  const [sleepData, setSleepData] = useState<Metric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Daily Steps', target: 10000, achieved: 0, unit: 'steps' },
    { id: '2', title: 'Sleep', target: 8, achieved: 0, unit: 'hours' },
    { id: '3', title: 'Water Intake', target: 8, achieved: 0, unit: 'glasses' }
  ]);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showUpdateProgress, setShowUpdateProgress] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [metricType, setMetricType] = useState<'weight' | 'sleep'>('weight');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newProgress, setNewProgress] = useState('');

  const handleAddMetric = () => {
    if (!newMetricValue) return;

    const metric: Metric = {
      id: Date.now().toString(),
      type: metricType,
      value: parseFloat(newMetricValue),
      unit: metricType === 'weight' ? 'lbs' : 'hours',
      timestamp: new Date()
    };

    if (metricType === 'weight') {
      setWeightData(prev => [metric, ...prev]);
    } else {
      setSleepData(prev => [metric, ...prev]);
    }

    setNewMetricValue('');
    setShowAddMetric(false);
  };

  const handleUpdateGoalTarget = () => {
    if (!selectedGoal || !newTarget) return;

    const updatedGoals = goals.map(goal => 
      goal.id === selectedGoal.id 
        ? { ...goal, target: parseFloat(newTarget) }
        : goal
    );

    setGoals(updatedGoals);
    setNewTarget('');
    setSelectedGoal(null);
    setShowEditGoal(false);
  };

  const handleUpdateProgress = () => {
    if (!selectedGoal || !newProgress) return;

    const updatedGoals = goals.map(goal => 
      goal.id === selectedGoal.id 
        ? { ...goal, achieved: parseFloat(newProgress) }
        : goal
    );

    setGoals(updatedGoals);
    setNewProgress('');
    setSelectedGoal(null);
    setShowUpdateProgress(false);
  };

  const getLatestMetric = (type: 'weight' | 'sleep') => {
    const data = type === 'weight' ? weightData : sleepData;
    return data[0];
  };

  const getPreviousMetric = (type: 'weight' | 'sleep') => {
    const data = type === 'weight' ? weightData : sleepData;
    return data[1];
  };

  const getChange = (type: 'weight' | 'sleep') => {
    const latest = getLatestMetric(type);
    const previous = getPreviousMetric(type);
    
    if (!latest || !previous) return null;
    
    const change = latest.value - previous.value;
    const unit = latest.unit;
    const sign = change >= 0 ? '+' : '';
    
    return `${sign}${change.toFixed(1)} ${unit}`;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Weight Card */}
        {weightData.length > 0 ? (
          <MetricCard 
            icon={<Scale className="text-primary-500" size={24} />}
            title="Weight"
            value={getLatestMetric('weight')?.value.toString() || ""}
            unit="lbs"
            change={getChange('weight') || ""}
          />
        ) : (
          <div className="card flex flex-col items-center text-center bg-neutral-50">
            <Scale className="text-neutral-400 mb-3" size={24} />
            <h3 className="text-sm font-medium text-neutral-500 mb-2">Weight</h3>
            <div className="flex flex-col items-center mb-3">
              <div className="border-b-2 border-dotted border-neutral-300 w-12 mb-1"></div>
              <span className="text-xs text-neutral-400">No data recorded</span>
            </div>
            <button 
              onClick={() => {
                setMetricType('weight');
                setShowAddMetric(true);
              }}
              className="btn-outline py-1 px-3 text-xs"
            >
              Add Weight
            </button>
          </div>
        )}

        {/* Sleep Card */}
        {sleepData.length > 0 ? (
          <MetricCard 
            icon={<Zap className="text-warning-500" size={24} />}
            title="Sleep"
            value={getLatestMetric('sleep')?.value.toString() || ""}
            unit="hours"
            change={getChange('sleep') || ""}
          />
        ) : (
          <div className="card flex flex-col items-center text-center bg-neutral-50">
            <Zap className="text-neutral-400 mb-3" size={24} />
            <h3 className="text-sm font-medium text-neutral-500 mb-2">Sleep</h3>
            <div className="flex flex-col items-center mb-3">
              <div className="border-b-2 border-dotted border-neutral-300 w-12 mb-1"></div>
              <span className="text-xs text-neutral-400">No data recorded</span>
            </div>
            <button 
              onClick={() => {
                setMetricType('sleep');
                setShowAddMetric(true);
              }}
              className="btn-outline py-1 px-3 text-xs"
            >
              Add Sleep
            </button>
          </div>
        )}
      </div>
      
      <div className="card mb-4">
        <h3 className="font-medium mb-3">Activity</h3>
        <div className="text-center py-6 text-neutral-500">
          <Activity size={32} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm font-medium mb-1">Real time activity tracking coming soon</p>
          <p className="text-xs">Activity tracking will be available in future updates</p>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Goals</h3>
        </div>
        
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="py-2">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">{goal.title}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-neutral-500">Target: {goal.target} {goal.unit}</p>
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setNewTarget(goal.target.toString());
                      setShowEditGoal(true);
                    }}
                    className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full hover:bg-neutral-200"
                  >
                    Edit Target
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setNewProgress(goal.achieved.toString());
                      setShowUpdateProgress(true);
                    }}
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full hover:bg-primary-200"
                  >
                    Update Progress
                  </button>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-1">
                <div 
                  className={`h-2.5 rounded-full ${
                    (goal.achieved / goal.target * 100) >= 75 ? 'bg-success-500' : 
                    (goal.achieved / goal.target * 100) >= 50 ? 'bg-primary-500' : 'bg-warning-500'
                  }`}
                  style={{ width: `${Math.min((goal.achieved / goal.target * 100), 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-neutral-500 text-right">
                {goal.achieved} / {goal.target} {goal.unit} ({Math.round((goal.achieved / goal.target * 100))}% completed)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Metric Modal */}
      {showAddMetric && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add {metricType === 'weight' ? 'Weight' : 'Sleep'}</h2>
              <button 
                onClick={() => setShowAddMetric(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {metricType === 'weight' ? 'Weight (lbs)' : 'Sleep Duration (hours)'} *
                </label>
                <input
                  type="number"
                  step={metricType === 'sleep' ? '0.5' : '0.1'}
                  value={newMetricValue}
                  onChange={(e) => setNewMetricValue(e.target.value)}
                  className="input"
                  placeholder={metricType === 'weight' ? '165' : '7.5'}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddMetric(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMetric}
                disabled={!newMetricValue}
                className={`btn-primary flex-1 ${
                  !newMetricValue ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Add {metricType === 'weight' ? 'Weight' : 'Sleep'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Target Modal */}
      {showEditGoal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Goal Target</h2>
              <button 
                onClick={() => setShowEditGoal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-lg">{selectedGoal.title}</h3>
              <p className="text-sm text-neutral-600">Current target: {selectedGoal.target} {selectedGoal.unit}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  New Target ({selectedGoal.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="input"
                  placeholder={`Enter target in ${selectedGoal.unit}`}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowEditGoal(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateGoalTarget}
                disabled={!newTarget}
                className={`btn-primary flex-1 ${
                  !newTarget ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Update Target
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {showUpdateProgress && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Progress</h2>
              <button 
                onClick={() => setShowUpdateProgress(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-lg">{selectedGoal.title}</h3>
              <p className="text-sm text-neutral-600">Target: {selectedGoal.target} {selectedGoal.unit}</p>
              <p className="text-sm text-neutral-600">Current: {selectedGoal.achieved} {selectedGoal.unit}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount Achieved ({selectedGoal.unit}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newProgress}
                  onChange={(e) => setNewProgress(e.target.value)}
                  className="input"
                  placeholder={`Enter amount in ${selectedGoal.unit}`}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowUpdateProgress(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateProgress}
                disabled={!newProgress}
                className={`btn-primary flex-1 ${
                  !newProgress ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Update Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  change: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, unit, change }) => {
  return (
    <div className="card flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-medium text-neutral-500 mb-1">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-neutral-500 ml-1">{unit}</span>
      </div>
      <div className="flex items-center mt-1">
        <span className={`text-xs ${
          change.startsWith('+') ? 'text-success-500' : 'text-emergency-500'
        }`}>
          {change} this week
        </span>
      </div>
    </div>
  );
};

export default HealthTracker;
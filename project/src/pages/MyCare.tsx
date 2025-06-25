import React, { useState, useEffect } from 'react';
import { 
  Heart, User, Phone, MapPin, FileText, Pill, 
  Edit, Plus, Calendar, Clock, Shield, Activity,
  Upload, Download, Trash2, AlertTriangle, Stethoscope,
  ClipboardList, BookOpen, TrendingUp, Home, Users,
  Bell, MessageCircle, Wind, Map, BarChart3, X, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  country?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

interface RecentActivity {
  id: string;
  type: 'profile' | 'contact' | 'medication' | 'document' | 'health' | 'emergency';
  action: string;
  details: string;
  timestamp: Date;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const MyCare: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Modal states
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  // Form states
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    startDate: ''
  });

  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    file: null as File | null
  });

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relation: ''
  });

  // Country data
  const countries = [
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
  ];

  // Clean up activities older than 24 hours
  const cleanupOldActivities = (activities: RecentActivity[]) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return activities.filter(activity => {
      const activityTime = new Date(activity.timestamp);
      return activityTime > twentyFourHoursAgo;
    });
  };

  useEffect(() => {
    // CLEAR ALL EXISTING DATA ON FIRST LOAD
    localStorage.removeItem('medications');
    localStorage.removeItem('documents');
    localStorage.removeItem('contacts');
    localStorage.removeItem('recentActivities');
    
    // Check if this is the first time opening the app after profile creation
    const isFirstTimeUser = localStorage.getItem('isFirstTimeUser');
    if (isFirstTimeUser === 'true') {
      setIsFirstTime(true);
      localStorage.removeItem('isFirstTimeUser'); // Remove flag after first visit
    }

    // Load user profile
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    // If no stored profile, profile stays null

    // Load medications - ALWAYS START EMPTY
    const storedMedications = localStorage.getItem('medications');
    if (storedMedications) {
      setMedications(JSON.parse(storedMedications));
    }
    // If no stored medications, medications array stays empty []

    // Load documents - ALWAYS START EMPTY
    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
    // If no stored documents, documents array stays empty []

    // Load contacts - ALWAYS START EMPTY
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
    // If no stored contacts, contacts array stays empty []

    // Load and clean up recent activities - ALWAYS START EMPTY
    const storedActivities = localStorage.getItem('recentActivities');
    if (storedActivities) {
      const activities = JSON.parse(storedActivities);
      const cleanedActivities = cleanupOldActivities(activities);
      setRecentActivities(cleanedActivities);
      
      // Update localStorage with cleaned activities
      if (cleanedActivities.length !== activities.length) {
        localStorage.setItem('recentActivities', JSON.stringify(cleanedActivities));
      }
    }
    // If no stored activities, recentActivities array stays empty []

    // Set up interval to clean up old activities every hour
    const cleanupInterval = setInterval(() => {
      const storedActivities = localStorage.getItem('recentActivities');
      if (storedActivities) {
        const activities = JSON.parse(storedActivities);
        const cleanedActivities = cleanupOldActivities(activities);
        
        if (cleanedActivities.length !== activities.length) {
          setRecentActivities(cleanedActivities);
          localStorage.setItem('recentActivities', JSON.stringify(cleanedActivities));
        }
      }
    }, 60 * 60 * 1000); // Run every hour

    return () => clearInterval(cleanupInterval);
  }, []);

  const addActivity = (type: RecentActivity['type'], action: string, details: string) => {
    const newActivity: RecentActivity = {
      id: Date.now().toString(),
      type,
      action,
      details,
      timestamp: new Date()
    };

    const updatedActivities = [newActivity, ...recentActivities].slice(0, 20); // Keep max 20 activities
    const cleanedActivities = cleanupOldActivities(updatedActivities);
    
    setRecentActivities(cleanedActivities);
    localStorage.setItem('recentActivities', JSON.stringify(cleanedActivities));
  };

  const handleEditProfile = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (editForm) {
      setProfile(editForm);
      localStorage.setItem('userProfile', JSON.stringify(editForm));
      addActivity('profile', 'Profile updated', 'Personal information updated');
      setIsEditing(false);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editForm) {
      setEditForm(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  // Medication functions
  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMedication,
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0]
      };
      
      const updatedMedications = [...medications, medication];
      setMedications(updatedMedications);
      localStorage.setItem('medications', JSON.stringify(updatedMedications));
      
      addActivity('medication', 'Medication added', `Added ${medication.name}`);
      
      // Reset form
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        startDate: ''
      });
      setShowAddMedication(false);
    }
  };

  const handleRemoveMedication = (id: string) => {
    const medication = medications.find(m => m.id === id);
    const updatedMedications = medications.filter(m => m.id !== id);
    setMedications(updatedMedications);
    localStorage.setItem('medications', JSON.stringify(updatedMedications));
    
    if (medication) {
      addActivity('medication', 'Medication removed', `Removed ${medication.name}`);
    }
  };

  // Document functions
  const handleAddDocument = () => {
    if (newDocument.name && newDocument.type) {
      const document: Document = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        uploadDate: new Date().toISOString().split('T')[0],
        size: newDocument.file ? `${(newDocument.file.size / 1024 / 1024).toFixed(1)} MB` : '0.1 MB'
      };
      
      const updatedDocuments = [...documents, document];
      setDocuments(updatedDocuments);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      addActivity('document', 'Document uploaded', `Uploaded ${document.name}`);
      
      // Reset form
      setNewDocument({
        name: '',
        type: '',
        file: null
      });
      setShowAddDocument(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    const document = documents.find(d => d.id === id);
    const updatedDocuments = documents.filter(d => d.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    
    if (document) {
      addActivity('document', 'Document removed', `Removed ${document.name}`);
    }
  };

  // Contact functions
  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relation) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact
      };
      
      const updatedContacts = [...contacts, contact];
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      
      addActivity('contact', 'Contact added', `Added ${contact.name}`);
      
      // Reset form
      setNewContact({
        name: '',
        phone: '',
        relation: ''
      });
      setShowAddContact(false);
    }
  };

  const handleRemoveContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    
    if (contact) {
      addActivity('contact', 'Contact removed', `Removed ${contact.name}`);
    }
  };

  const getCountryData = (countryCode?: string) => {
    return countries.find(c => c.code === countryCode) || { code: 'US', name: 'United States', flag: '🇺🇸' };
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile': return <User size={16} className="text-primary-500" />;
      case 'contact': return <Phone size={16} className="text-info-500" />;
      case 'medication': return <Pill size={16} className="text-warning-500" />;
      case 'document': return <FileText size={16} className="text-success-500" />;
      case 'health': return <Activity size={16} className="text-emergency-500" />;
      case 'emergency': return <AlertTriangle size={16} className="text-emergency-500" />;
      default: return <Activity size={16} className="text-neutral-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  // Function to get emoji for profile information
  const getProfileEmoji = (field: string, value: string) => {
    switch (field) {
      case 'bloodType':
        return '🩸';
      case 'allergies':
        return value && value !== 'None listed' ? '🤧' : '✅';
      case 'chronicConditions':
        return value && value !== 'None listed' ? '🏥' : '💚';
      case 'emergencyContact':
        return '📞';
      case 'country':
        const countryData = getCountryData(value);
        return countryData.flag;
      default:
        return '📋';
    }
  };

  // Component for teal circle with phone icon
  const TealPhoneIcon = () => (
    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
      <Phone size={12} className="text-white" />
    </div>
  );

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto mb-4 text-primary-500" size={48} />
        <h2 className="text-xl font-medium mb-2">Welcome to CærPal</h2>
        <p className="text-neutral-600 mb-6">Create your emergency health profile to get started</p>
        <button 
          onClick={() => window.location.href = '/create-profile'}
          className="btn-primary"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const countryData = getCountryData(profile.country);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Care</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <TabButton 
          id="overview" 
          label="Overview" 
          icon={<Home size={18} />} 
          isActive={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')} 
        />
        <TabButton 
          id="profile" 
          label="Profile" 
          icon={<User size={18} />} 
          isActive={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
        />
        <TabButton 
          id="medications" 
          label="Medications" 
          icon={<Pill size={18} />} 
          isActive={activeTab === 'medications'} 
          onClick={() => setActiveTab('medications')} 
        />
        <TabButton 
          id="documents" 
          label="Documents" 
          icon={<FileText size={18} />} 
          isActive={activeTab === 'documents'} 
          onClick={() => setActiveTab('documents')} 
        />
        <TabButton 
          id="contacts" 
          label="Contacts" 
          icon={<Users size={18} />} 
          isActive={activeTab === 'contacts'} 
          onClick={() => setActiveTab('contacts')} 
        />
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section - Dynamic based on first time vs returning user */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mr-4">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  {isFirstTime ? (
                    <>
                      <h2 className="text-xl font-bold text-primary-800">Welcome, {profile.name.split(' ')[0]}! 🎉</h2>
                      <p className="text-primary-600">Your health profile is now ready. Let's explore your features!</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-primary-800">Welcome back, {profile.name.split(' ')[0]}! 👋</h2>
                      <p className="text-primary-600">Your health companion is ready to assist you</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FeatureButton
                  emoji="🚨"
                  title="Panic Alert"
                  description="Emergency assistance"
                  onClick={() => navigate('/panic-alert')}
                  className="bg-emergency-50 hover:bg-emergency-100 border-emergency-200"
                />
                <FeatureButton
                  emoji="💬"
                  title="ChatMate"
                  description="AI health assistant"
                  onClick={() => navigate('/chat-mate')}
                  className="bg-info-50 hover:bg-info-100 border-info-200"
                />
                <FeatureButton
                  emoji="📊"
                  title="Health Tracker"
                  description="Monitor vitals & goals"
                  onClick={() => navigate('/health-tracker')}
                  className="bg-success-50 hover:bg-success-100 border-success-200"
                />
                <FeatureButton
                  emoji="🧘"
                  title="Breathing & Wellness"
                  description="Relaxation exercises"
                  onClick={() => navigate('/breathing-wellness')}
                  className="bg-primary-50 hover:bg-primary-100 border-primary-200"
                />
                <FeatureButton
                  emoji="🗺️"
                  title="Emergency Map"
                  description="🔜 Coming Soon"
                  onClick={() => navigate('/emergency-map')}
                  className="bg-warning-50 hover:bg-warning-100 border-warning-200"
                />
                <FeatureButton
                  emoji="👤"
                  title="My Profile"
                  description="Personal info"
                  onClick={() => setActiveTab('profile')}
                  className="bg-neutral-50 hover:bg-neutral-100 border-neutral-200"
                />
              </div>
            </div>

            {/* Health Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">📋 Health Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium flex items-center">
                      {getProfileEmoji('bloodType', profile.bloodType)} Blood Type
                    </span>
                    <span className="text-sm text-primary-600 font-semibold">{profile.bloodType}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium flex items-center">
                      💊 Medications
                    </span>
                    <span className="text-sm text-primary-600 font-semibold">{medications.length} active</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                    <span className="text-sm font-medium flex items-center">
                      📄 Documents
                    </span>
                    <span className="text-sm text-primary-600 font-semibold">{documents.length} files</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4">📞 Emergency Contact</h3>
                <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Phone className="text-emergency-500 mr-2" size={16} />
                    <span className="font-medium text-emergency-700">{profile.emergencyContactName}</span>
                  </div>
                  <p className="text-sm text-emergency-600 mb-1">{profile.emergencyContactRelation}</p>
                  <p className="text-sm text-emergency-600">{profile.emergencyContactPhone}</p>
                  <button 
                    onClick={() => {
                      window.location.href = `tel:${profile.emergencyContactPhone}`;
                      addActivity('emergency', 'Emergency call made', `Called ${profile.emergencyContactName}`);
                    }}
                    className="mt-3 btn-emergency py-1 px-3 text-sm"
                  >
                    Call Now
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">⏰ Recent Activity</h3>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <Activity size={48} className="mx-auto mb-4 text-neutral-300" />
                  <p className="text-lg font-medium mb-2">No recent activity</p>
                  <p className="text-sm">Activities will appear here when you use the app</p>
                  <p className="text-xs mt-2 text-neutral-400">Try adding medications, uploading documents, or tracking your health</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center p-3 bg-neutral-50 rounded-lg">
                      <div className="mr-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-neutral-600">{activity.details}</p>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                  {recentActivities.length > 5 && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-neutral-500">
                        Showing 5 of {recentActivities.length} activities
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <User className="text-primary-500" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-neutral-600">DOB: {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Medical Information with Emojis */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getProfileEmoji('bloodType', profile.bloodType)}</span>
                      <div>
                        <p className="text-sm text-neutral-500">Blood Type</p>
                        <p className="font-medium">{profile.bloodType}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getProfileEmoji('allergies', profile.allergies)}</span>
                      <div>
                        <p className="text-sm text-neutral-500">Allergies</p>
                        <p className="font-medium">{profile.allergies || 'None listed'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getProfileEmoji('chronicConditions', profile.chronicConditions)}</span>
                      <div>
                        <p className="text-sm text-neutral-500">Chronic Conditions</p>
                        <p className="font-medium">{profile.chronicConditions || 'None listed'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getProfileEmoji('country', profile.country || 'US')}</span>
                      <div>
                        <p className="text-sm text-neutral-500">Country</p>
                        <p className="font-medium">{countryData.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact with Teal Circle Phone Icon */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="mr-3">
                      <TealPhoneIcon />
                    </div>
                    <div>
                      <p className="font-medium text-emergency-700">{profile.emergencyContactName}</p>
                      <p className="text-sm text-emergency-600">{profile.emergencyContactRelation}</p>
                      <p className="text-sm text-emergency-600">{profile.emergencyContactPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">💊 Current Medications</h2>
              <button 
                onClick={() => setShowAddMedication(true)}
                className="btn-outline py-1 px-3 flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Medication
              </button>
            </div>
            
            {medications.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Pill size={48} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-lg font-medium mb-2">No medications added yet</p>
                <p className="text-sm">Keep track of your medications for emergency situations</p>
                <button 
                  onClick={() => setShowAddMedication(true)}
                  className="btn-primary mt-4 flex items-center mx-auto"
                >
                  <Plus size={16} className="mr-1" />
                  Add Your First Medication
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="text-lg mr-3">💊</span>
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-neutral-600">{medication.dosage} • {medication.frequency}</p>
                        <p className="text-xs text-neutral-500">Prescribed by {medication.prescribedBy}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMedication(medication.id)}
                      className="text-neutral-400 hover:text-emergency-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">📄 Medical Documents</h2>
              <button 
                onClick={() => setShowAddDocument(true)}
                className="btn-outline py-1 px-3 flex items-center text-sm"
              >
                <Upload size={16} className="mr-1" />
                Upload Document
              </button>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <FileText size={48} className="mx-auto mb-4 text-neutral-300" />
                <p className="text-lg font-medium mb-2">No documents uploaded yet</p>
                <p className="text-sm">Store important medical documents for quick access</p>
                <button 
                  onClick={() => setShowAddDocument(true)}
                  className="btn-primary mt-4 flex items-center mx-auto"
                >
                  <Upload size={16} className="mr-1" />
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="text-lg mr-3">📄</span>
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        <p className="text-sm text-neutral-600">{document.type} • {document.size}</p>
                        <p className="text-xs text-neutral-500">Uploaded {new Date(document.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => addActivity('document', 'Document downloaded', `Downloaded ${document.name}`)}
                        className="text-neutral-400 hover:text-primary-500 p-1"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleRemoveDocument(document.id)}
                        className="text-neutral-400 hover:text-emergency-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">📞 Emergency Contacts</h2>
              <button 
                onClick={() => setShowAddContact(true)}
                className="btn-outline py-1 px-3 flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Contact
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Primary Emergency Contact */}
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <TealPhoneIcon />
                    </div>
                    <div>
                      <h4 className="font-medium">{profile.emergencyContactName}</h4>
                      <p className="text-sm text-neutral-600">{profile.emergencyContactRelation}</p>
                      <p className="text-sm text-neutral-600">{profile.emergencyContactPhone}</p>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Primary</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        window.location.href = `tel:${profile.emergencyContactPhone}`;
                        addActivity('contact', 'Emergency call made', `Called ${profile.emergencyContactName}`);
                      }}
                      className="btn-primary py-2 px-3 flex items-center"
                    >
                      <Phone size={16} className="mr-1" />
                      Call
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Contacts */}
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <TealPhoneIcon />
                      </div>
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-neutral-600">{contact.relation}</p>
                        <p className="text-sm text-neutral-600">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          window.location.href = `tel:${contact.phone}`;
                          addActivity('contact', 'Contact called', `Called ${contact.name}`);
                        }}
                        className="btn-primary py-2 px-3 flex items-center"
                      >
                        <Phone size={16} className="mr-1" />
                        Call
                      </button>
                      <button 
                        onClick={() => handleRemoveContact(contact.id)}
                        className="text-neutral-400 hover:text-emergency-500 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="text-center py-4 text-neutral-500">
                  <p className="text-sm">No additional emergency contacts</p>
                  <p className="text-xs mt-1">Add more contacts for better emergency coverage</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Medication</h2>
              <button 
                onClick={() => setShowAddMedication(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Medication Name *</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="e.g., Lisinopril"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Dosage *</label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  className="input"
                  placeholder="e.g., 10mg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Frequency *</label>
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  className="input"
                  placeholder="e.g., Once daily"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Prescribed By</label>
                <input
                  type="text"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                  className="input"
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddMedication(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMedication}
                disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
                className={`btn-primary flex-1 ${
                  !newMedication.name || !newMedication.dosage || !newMedication.frequency 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Document</h2>
              <button 
                onClick={() => setShowAddDocument(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Name *</label>
                <input
                  type="text"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="e.g., Blood Test Results - March 2024"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Type *</label>
                <select
                  value={newDocument.type}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Medical Report">Medical Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Insurance">Insurance</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">File</label>
                <input
                  type="file"
                  onChange={(e) => setNewDocument(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  className="input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-xs text-neutral-500 mt-1">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddDocument(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDocument}
                disabled={!newDocument.name || !newDocument.type}
                className={`btn-primary flex-1 ${
                  !newDocument.name || !newDocument.type 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Emergency Contact</h2>
              <button 
                onClick={() => setShowAddContact(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="input"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="input"
                  placeholder="e.g., +1 (555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Relationship *</label>
                <input
                  type="text"
                  value={newContact.relation}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
                  className="input"
                  placeholder="e.g., Brother, Friend, Doctor"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddContact(false)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddContact}
                disabled={!newContact.name || !newContact.phone || !newContact.relation}
                className={`btn-primary flex-1 ${
                  !newContact.name || !newContact.phone || !newContact.relation 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
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
        isActive ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-800'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

interface FeatureButtonProps {
  emoji: string;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ emoji, title, description, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md text-left w-full ${className}`}
    >
      <div className="text-2xl mb-2">{emoji}</div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-neutral-600">{description}</p>
    </button>
  );
};

export default MyCare;
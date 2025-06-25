import React, { useState, useEffect } from 'react';
import { Bell, Phone, MessageSquare, AlertTriangle, Shield } from 'lucide-react';

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

interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
}

interface EmergencyService {
  country: string;
  flag: string;
  police: string;
  medical: string;
  fire: string;
  general: string;
}

const PanicAlert: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userCountry, setUserCountry] = useState<string>('US');
  
  // Emergency services by country
  const emergencyServices: Record<string, EmergencyService> = {
    'US': {
      country: 'United States',
      flag: '🇺🇸',
      police: '911',
      medical: '911',
      fire: '911',
      general: '911'
    },
    'CA': {
      country: 'Canada',
      flag: '🇨🇦',
      police: '911',
      medical: '911',
      fire: '911',
      general: '911'
    },
    'GB': {
      country: 'United Kingdom',
      flag: '🇬🇧',
      police: '999',
      medical: '999',
      fire: '999',
      general: '999'
    },
    'AU': {
      country: 'Australia',
      flag: '🇦🇺',
      police: '000',
      medical: '000',
      fire: '000',
      general: '000'
    },
    'DE': {
      country: 'Germany',
      flag: '🇩🇪',
      police: '110',
      medical: '112',
      fire: '112',
      general: '112'
    },
    'FR': {
      country: 'France',
      flag: '🇫🇷',
      police: '17',
      medical: '15',
      fire: '18',
      general: '112'
    },
    'IN': {
      country: 'India',
      flag: '🇮🇳',
      police: '100',
      medical: '108',
      fire: '101',
      general: '112'
    },
    'JP': {
      country: 'Japan',
      flag: '🇯🇵',
      police: '110',
      medical: '119',
      fire: '119',
      general: '110'
    }
  };

  useEffect(() => {
    // Load user profile
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setProfile(profileData);
      
      // Use country from profile if available
      if (profileData.country) {
        setUserCountry(profileData.country);
      }
    }

    // Load additional emergency contacts
    const storedContacts = localStorage.getItem('emergencyContacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }

    // If no country in profile, try to detect from other sources
    if (!profile?.country) {
      const detectUserCountry = () => {
        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          const phone = profileData.emergencyContactPhone;
          
          // Simple detection based on phone number format
          if (phone) {
            if (phone.startsWith('+1')) return 'US';
            if (phone.startsWith('+44')) return 'GB';
            if (phone.startsWith('+49')) return 'DE';
            if (phone.startsWith('+33')) return 'FR';
            if (phone.startsWith('+61')) return 'AU';
            if (phone.startsWith('+91')) return 'IN';
            if (phone.startsWith('+81')) return 'JP';
          }
        }
        
        // Try to detect from browser locale
        const locale = navigator.language || 'en-US';
        if (locale.includes('GB')) return 'GB';
        if (locale.includes('DE')) return 'DE';
        if (locale.includes('FR')) return 'FR';
        if (locale.includes('AU')) return 'AU';
        if (locale.includes('IN')) return 'IN';
        if (locale.includes('JP')) return 'JP';
        if (locale.includes('CA')) return 'CA';
        
        return 'US'; // Default to US
      };

      setUserCountry(detectUserCountry());
    }
  }, []);
  
  const handlePanicButtonClick = () => {
    setShowConfirmation(true);
  };
  
  const handleConfirm = () => {
    setShowConfirmation(false);
    setAlertSent(true);
    
    // Automatically send message to emergency contact
    if (profile) {
      const emergencyMessage = "Feeling sick, need help";
      handleText(profile.emergencyContactPhone, emergencyMessage);
    }
    
    // Reset alert sent state after 5 seconds
    setTimeout(() => {
      setAlertSent(false);
    }, 5000);
  };
  
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleCall = (phone: string) => {
    // In a real app, this would initiate a phone call
    window.location.href = `tel:${phone}`;
  };

  const handleText = (phone: string, message: string) => {
    // In a real app, this would open SMS with pre-filled message
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
  };

  const currentEmergencyService = emergencyServices[userCountry] || emergencyServices['US'];
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panic Alert</h1>
      
      <div className="card mb-6 bg-emergency-50 border-l-4 border-emergency-500">
        <div className="flex items-start">
          <AlertTriangle className="text-emergency-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-emergency-700">Emergency Use Only</h3>
            <p className="text-sm text-emergency-700">
              This button will send an alert with your current location to your emergency contacts. 
              Only use in case of a genuine emergency.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        {alertSent ? (
          <div className="card bg-success-500 text-white animate-fade-in">
            <Shield size={32} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold mb-2">Alert Sent Successfully</h2>
            <p>Your emergency contacts have been notified with your current location.</p>
            <p className="text-sm mt-2 opacity-90">Message sent: "Feeling sick, need help"</p>
          </div>
        ) : (
          <>
            <button 
              className={`h-32 w-32 rounded-full mb-4 focus:outline-none ${
                showConfirmation 
                  ? 'bg-neutral-300' 
                  : 'bg-emergency-500 hover:bg-emergency-600 emergency-pulse'
              }`}
              onClick={handlePanicButtonClick}
              disabled={showConfirmation}
            >
              <div className="flex flex-col items-center justify-center text-white">
                <Bell size={36} />
                <span className="font-bold mt-2">PANIC</span>
              </div>
            </button>
            <p className="text-neutral-500">Tap the button in case of emergency</p>
          </>
        )}
      </div>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-slide-up">
            <AlertTriangle className="text-emergency-500 mx-auto mb-4" size={40} />
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Emergency Alert</h2>
            <p className="mb-4 text-center">
              Are you sure you want to send an emergency alert to all your emergency contacts?
            </p>
            <div className="bg-info-50 border border-info-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-info-700 text-center">
                📱 This will automatically send: <strong>"Feeling sick, need help"</strong> to your emergency contact.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                className="btn-outline flex-1"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="btn-emergency flex-1"
                onClick={handleConfirm}
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-medium mb-3 flex items-center">
            <Phone size={18} className="mr-2 text-primary-500" />
            Quick Dial
          </h3>
          <div className="space-y-3">
            {/* Primary Emergency Contact */}
            {profile && (
              <div className="mb-2">
                <p className="text-xs text-neutral-500 mb-2">👥 Personal Emergency Contacts</p>
                <QuickDialButton 
                  label={`${profile.emergencyContactName} (${profile.emergencyContactRelation})`}
                  phone={profile.emergencyContactPhone}
                  onCall={handleCall}
                />
              </div>
            )}
            
            {/* Additional Emergency Contacts */}
            {contacts.map((contact) => (
              <QuickDialButton 
                key={contact.id}
                label={`${contact.name} (${contact.relation})`}
                phone={contact.phone}
                onCall={handleCall}
              />
            ))}
            
            {/* Country-specific Emergency Services */}
            <div className={`${(profile || contacts.length > 0) ? 'pt-2 border-t border-neutral-200' : ''}`}>
              <p className="text-xs text-neutral-500 mb-2 flex items-center">
                {currentEmergencyService.flag} Emergency Services - {currentEmergencyService.country}
              </p>
              <QuickDialButton 
                label={`Emergency Services (${currentEmergencyService.general})`}
                phone={currentEmergencyService.general}
                onCall={handleCall}
              />
              {/* Show specific services if they're different */}
              {currentEmergencyService.police !== currentEmergencyService.general && (
                <div className="mt-2">
                  <QuickDialButton 
                    label={`Police (${currentEmergencyService.police})`}
                    phone={currentEmergencyService.police}
                    onCall={handleCall}
                  />
                </div>
              )}
              {currentEmergencyService.medical !== currentEmergencyService.general && (
                <div className="mt-2">
                  <QuickDialButton 
                    label={`Medical Emergency (${currentEmergencyService.medical})`}
                    phone={currentEmergencyService.medical}
                    onCall={handleCall}
                  />
                </div>
              )}
            </div>
            
            {/* Show message if no personal contacts */}
            {!profile && contacts.length === 0 && (
              <div className="text-center py-2 text-neutral-500 mb-2">
                <p className="text-sm">No personal emergency contacts</p>
                <p className="text-xs mt-1">Add contacts in your profile</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="font-medium mb-3 flex items-center">
            <MessageSquare size={18} className="mr-2 text-primary-500" />
            Quick Text
          </h3>
          <div className="space-y-3">
            {/* Primary Emergency Contact */}
            {profile && (
              <>
                <p className="text-xs text-neutral-500 mb-2">Send to {profile.emergencyContactName}</p>
                <QuickTextButton 
                  label="I need help. Please call me."
                  phone={profile.emergencyContactPhone}
                  message="I need help. Please call me."
                  onText={handleText}
                />
                <QuickTextButton 
                  label="I'm having a medical emergency."
                  phone={profile.emergencyContactPhone}
                  message="I'm having a medical emergency. Please come to my location or call emergency services."
                  onText={handleText}
                />
                <QuickTextButton 
                  label="Please come to my location ASAP."
                  phone={profile.emergencyContactPhone}
                  message="Please come to my location ASAP. I need immediate assistance."
                  onText={handleText}
                />
              </>
            )}
            
            {/* Show message if no primary contact */}
            {!profile && (
              <div className="text-center py-4 text-neutral-500">
                <p className="text-sm">No primary emergency contact available</p>
                <p className="text-xs mt-1">Add a contact in your profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickDialButtonProps {
  label: string;
  phone: string;
  onCall: (phone: string) => void;
}

const QuickDialButton: React.FC<QuickDialButtonProps> = ({ label, phone, onCall }) => {
  return (
    <button 
      className="btn-outline w-full flex items-center justify-between hover:bg-primary-50"
      onClick={() => onCall(phone)}
    >
      <span className="text-left">{label}</span>
      <Phone size={18} className="text-primary-500" />
    </button>
  );
};

interface QuickTextButtonProps {
  label: string;
  phone: string;
  message: string;
  onText: (phone: string, message: string) => void;
}

const QuickTextButton: React.FC<QuickTextButtonProps> = ({ label, phone, message, onText }) => {
  return (
    <button 
      className="btn-outline w-full flex items-center justify-between hover:bg-primary-50"
      onClick={() => onText(phone, message)}
    >
      <span className="text-left text-sm">{label}</span>
      <MessageSquare size={18} className="text-primary-500" />
    </button>
  );
};

export default PanicAlert;
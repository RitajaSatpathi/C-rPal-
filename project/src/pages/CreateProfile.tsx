import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface ProfileData {
  name: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  country: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    country: 'US',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    emergencyContactPhone: false,
    emergencyContactRelation: false,
  });

  const [selectedCountry, setSelectedCountry] = useState('US');

  // Country codes and their phone number lengths (sorted alphabetically)
  const countries = [
    { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneLength: 9, format: '+61 XXX-XXX-XXX' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneLength: 10, format: '+1 XXX-XXX-XXXX' },
    { code: 'FR', name: 'France', flag: '🇫🇷', phoneLength: 10, format: '+33 X-XX-XX-XX-XX' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneLength: 11, format: '+49 XXX-XXXX-XXXX' },
    { code: 'IN', name: 'India', flag: '🇮🇳', phoneLength: 10, format: '+91 XXXXX-XXXXX' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneLength: 11, format: '+81 XX-XXXX-XXXX' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneLength: 11, format: '+44 XXXX-XXX-XXX' },
    { code: 'US', name: 'United States', flag: '🇺🇸', phoneLength: 10, format: '+1 XXX-XXX-XXXX' },
  ];

  const validatePhoneNumber = (phone: string, countryCode: string): boolean => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return false;
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === country.phoneLength;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle country selection
    if (name === 'country') {
      setSelectedCountry(value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }
    
    // Validation for phone number - only allow numbers, spaces, hyphens, parentheses, and plus sign
    if (name === 'emergencyContactPhone') {
      const phoneRegex = /^[0-9\s\-\(\)\+]*$/;
      if (!phoneRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, emergencyContactPhone: true }));
        // Clear error after 3 seconds
        setTimeout(() => {
          setValidationErrors(prev => ({ ...prev, emergencyContactPhone: false }));
        }, 3000);
        return; // Don't update if invalid characters
      } else {
        // Validate phone number length for selected country
        const isValid = validatePhoneNumber(value, selectedCountry);
        setValidationErrors(prev => ({ ...prev, emergencyContactPhone: !isValid && value.length > 0 }));
      }
    }
    
    // Validation for relationship - only allow alphabets and spaces
    if (name === 'emergencyContactRelation') {
      const relationRegex = /^[a-zA-Z\s]*$/;
      if (!relationRegex.test(value)) {
        setValidationErrors(prev => ({ ...prev, emergencyContactRelation: true }));
        // Clear error after 3 seconds
        setTimeout(() => {
          setValidationErrors(prev => ({ ...prev, emergencyContactRelation: false }));
        }, 3000);
        return; // Don't update if invalid characters
      } else {
        setValidationErrors(prev => ({ ...prev, emergencyContactRelation: false }));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.dateOfBirth && formData.bloodType && formData.country);
      case 2:
        return true; // Medical info is optional
      case 3:
        return !!(formData.emergencyContactName && formData.emergencyContactPhone && formData.emergencyContactRelation) && 
               validatePhoneNumber(formData.emergencyContactPhone, selectedCountry);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      // Store the profile data in localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      // Set flag to indicate this is a first-time user
      localStorage.setItem('isFirstTimeUser', 'true');
      
      setShowSuccess(true);
      
      // Navigate to My Care after 3 seconds
      setTimeout(() => {
        navigate('/my-care');
      }, 3000);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about you' },
    { number: 2, title: 'Medical Info', description: 'Health conditions and allergies' },
    { number: 3, title: 'Emergency Contact', description: 'Someone to contact in emergencies' }
  ];

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-500 p-3 rounded-full mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-neutral-600">Let's set up your emergency health profile</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  currentStep > step.number 
                    ? 'bg-primary-500 text-white' 
                    : currentStep === step.number 
                    ? 'bg-primary-500 text-white ring-4 ring-primary-200' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {currentStep > step.number ? <Check size={16} /> : step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-primary-500' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-medium mb-1">{steps[currentStep - 1].title}</h2>
            <p className="text-sm text-neutral-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <div className="card">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-neutral-500 mt-1">This helps us show relevant emergency services</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Blood Type *</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="card">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Peanuts, Shellfish, Penicillin"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Separate multiple allergies with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Chronic Conditions</label>
                  <input
                    type="text"
                    name="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., Diabetes, Hypertension, Asthma"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Separate multiple conditions with commas</p>
                </div>

                <div className="bg-info-50 border border-info-200 rounded-lg p-3">
                  <p className="text-sm text-info-700">
                    💡 This information helps emergency responders provide better care. You can skip this step and add details later.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="card">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter contact's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    className={`input ${validationErrors.emergencyContactPhone ? 'border-emergency-500 focus:ring-emergency-500' : ''}`}
                    placeholder={selectedCountryData?.format || "Enter phone number"}
                    required
                  />
                  {selectedCountryData && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Format: {selectedCountryData.format} ({selectedCountryData.phoneLength} digits)
                    </p>
                  )}
                  {validationErrors.emergencyContactPhone && (
                    <p className="text-xs text-emergency-600 mt-1 animate-fade-in">
                      ⚠️ Invalid phone number for {selectedCountryData?.name}. Please enter {selectedCountryData?.phoneLength} digits.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Relationship *</label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className={`input ${validationErrors.emergencyContactRelation ? 'border-emergency-500 focus:ring-emergency-500' : ''}`}
                    placeholder="e.g., Mother, Father, Spouse, Friend"
                    required
                  />
                  {validationErrors.emergencyContactRelation && (
                    <p className="text-xs text-emergency-600 mt-1 animate-fade-in">
                      ⚠️ Only letters and spaces are allowed
                    </p>
                  )}
                </div>

                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <p className="text-sm text-warning-700">
                    🚨 This person will be contacted in case of emergencies. Make sure they're aware and available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="btn-outline flex-1 flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className={`btn-primary flex-1 flex items-center justify-center ${
                !validateStep(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
              <ArrowRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(3)}
              className={`btn-primary flex-1 flex items-center justify-center ${
                !validateStep(3) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Create Profile
              <Check size={16} className="ml-1" />
            </button>
          )}
        </div>

        {/* Required Fields Note */}
        <p className="text-xs text-neutral-500 text-center mt-4">
          * Required fields
        </p>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full animate-slide-up text-center">
            <div className="mb-6">
              <div className="inline-block bg-success-500 p-4 rounded-full mb-4">
                <Check className="text-white" size={32} />
              </div>
              <div className="flex items-center justify-center mb-2">
                <h2 className="text-2xl font-bold text-success-700 mr-2">Profile Created Successfully</h2>
                <span className="text-2xl">🎉</span>
              </div>
              <p className="text-neutral-600">
                Welcome to CærPal! Your emergency health profile is now ready.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="text-primary-500 mr-2" size={20} />
                <span className="font-medium text-primary-700">You're all set!</span>
              </div>
              <p className="text-sm text-neutral-600">
                Redirecting you to your dashboard...
              </p>
            </div>

            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
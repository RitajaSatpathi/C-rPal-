import React from 'react';
import { MapPin, Clock, Wrench } from 'lucide-react';

const EmergencyMap: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Emergency Map</h1>
      </div>

      {/* Coming Soon Section */}
      <div className="min-h-[600px] flex items-center justify-center relative">
        <div className="text-center max-w-md mx-auto">
          {/* Main Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="text-primary-600" size={48} />
          </div>

          {/* Coming Soon Message */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-neutral-800 mb-3">
              🔜 Emergency Map — Coming Soon!
            </h2>
            <p className="text-lg text-neutral-600 mb-4">
              We're working hard to bring you real-time emergency services mapping
            </p>
            <p className="text-sm text-neutral-500">
              This feature will include live location tracking, nearby hospitals, pharmacies, police stations, and turn-by-turn directions to emergency services.
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-emergency-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="text-emergency-600" size={16} />
                </div>
                <h3 className="font-medium text-neutral-800">Real-time Location Services</h3>
              </div>
              <p className="text-sm text-neutral-600">Find nearby hospitals, clinics, and emergency services instantly</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-info-100 rounded-full flex items-center justify-center mr-3">
                  <Clock className="text-info-600" size={16} />
                </div>
                <h3 className="font-medium text-neutral-800">Live Operating Hours</h3>
              </div>
              <p className="text-sm text-neutral-600">Check which emergency services are currently open and available</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mr-3">
                  <Wrench className="text-success-600" size={16} />
                </div>
                <h3 className="font-medium text-neutral-800">Turn-by-turn Directions</h3>
              </div>
              <p className="text-sm text-neutral-600">Get precise navigation to the nearest emergency facility</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="inline-flex items-center bg-warning-50 border border-warning-200 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-warning-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-warning-700">In Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
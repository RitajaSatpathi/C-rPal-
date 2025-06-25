import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 text-center">
      <div className="animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary-500 p-4 rounded-full">
            <Heart className="text-white" size={48} />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-800">
          Cær<span className="text-primary-500">Pal</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-md mx-auto">
          Your Instant Emergency Companion
        </p>
        
        <div className="flex flex-col gap-4 max-w-xs mx-auto mb-12">
          <div className="card bg-white shadow-soft">
            <h3 className="font-medium mb-2">Instant Emergency Access</h3>
            <p className="text-sm text-neutral-600">One-tap access to emergency services and medical information.</p>
          </div>
          
          <div className="card bg-white shadow-soft">
            <h3 className="font-medium mb-2">Health Monitoring</h3>
            <p className="text-sm text-neutral-600">Track your vital signs and health data in one place.</p>
          </div>
          
          <div className="card bg-white shadow-soft">
            <h3 className="font-medium mb-2">24/7 AI Assistance</h3>
            <p className="text-sm text-neutral-600">Get instant guidance from our ChatMate assistant.</p>
          </div>
        </div>
        
        <Link 
          to="/create-profile" 
          className="btn-primary inline-flex items-center"
        >
          Get Started
          <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
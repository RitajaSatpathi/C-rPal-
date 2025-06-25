import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, MessageCircle, Activity, Wind, Map } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg md:hidden">
      <div className="grid grid-cols-6 gap-1">
        <NavItem 
          to="/my-care" 
          icon={<Heart size={20} />} 
          label="Care" 
          isActive={location.pathname === '/my-care'} 
        />
        <NavItem 
          to="/panic-alert" 
          icon={<Bell size={20} />} 
          label="Panic" 
          isActive={location.pathname === '/panic-alert'} 
          isEmergency
        />
        <NavItem 
          to="/chat-mate" 
          icon={<MessageCircle size={20} />} 
          label="Chat" 
          isActive={location.pathname === '/chat-mate'} 
        />
        <NavItem 
          to="/health-tracker" 
          icon={<Activity size={20} />} 
          label="Health" 
          isActive={location.pathname === '/health-tracker'} 
        />
        <NavItem 
          to="/breathing-wellness" 
          icon={<Wind size={20} />} 
          label="Wellness" 
          isActive={location.pathname === '/breathing-wellness'} 
        />
        <NavItem 
          to="/emergency-map" 
          icon={<Map size={20} />} 
          label="Map" 
          isActive={location.pathname === '/emergency-map'} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isEmergency?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, isEmergency }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
        isActive 
          ? isEmergency 
            ? 'text-emergency-500' 
            : 'text-primary-500' 
          : 'text-neutral-500'
      }`}
    >
      <div className={`mb-1 ${isEmergency && !isActive ? 'text-emergency-500' : ''}`}>
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default BottomNav;
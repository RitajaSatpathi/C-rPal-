import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/my-care':
        return 'My Care';
      case '/panic-alert':
        return 'Panic Alert';
      case '/chat-mate':
        return 'ChatMate';
      case '/health-tracker':
        return 'Health Tracker';
      case '/breathing-wellness':
        return 'Breathing & Wellness';
      case '/emergency-map':
        return 'Emergency Map';
      default:
        return 'CærPal';
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/my-care" className="flex items-center space-x-2">
          <Heart className="text-primary-500" size={24} />
          <span className="font-bold text-xl">CærPal</span>
        </Link>
        
        <div className="md:hidden">
          <h1 className="text-lg font-medium">{getPageTitle()}</h1>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <NavLink to="/my-care" label="My Care" />
          <NavLink to="/panic-alert" label="Panic Alert" />
          <NavLink to="/chat-mate" label="ChatMate" />
          <NavLink to="/health-tracker" label="Health Tracker" />
          <NavLink to="/breathing-wellness" label="Breathing & Wellness" />
          <NavLink to="/emergency-map" label="Emergency Map" />
        </div>
        
        <button 
          className="md:hidden text-neutral-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-up">
          <nav className="flex flex-col py-4">
            <MobileNavLink to="/my-care" label="My Care" onClick={toggleMenu} />
            <MobileNavLink to="/panic-alert" label="Panic Alert" onClick={toggleMenu} />
            <MobileNavLink to="/chat-mate" label="ChatMate" onClick={toggleMenu} />
            <MobileNavLink to="/health-tracker" label="Health Tracker" onClick={toggleMenu} />
            <MobileNavLink to="/breathing-wellness" label="Breathing & Wellness" onClick={toggleMenu} />
            <MobileNavLink to="/emergency-map" label="Emergency Map" onClick={toggleMenu} />
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`py-2 px-1 font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-primary-500 border-b-2 border-primary-500' 
          : 'text-neutral-600 hover:text-primary-500'
      }`}
    >
      {label}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`py-3 px-6 transition-colors duration-200 ${
        isActive 
          ? 'bg-primary-50 text-primary-500 border-l-4 border-primary-500' 
          : 'text-neutral-600 hover:bg-neutral-100'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MyCare from './pages/MyCare';
import PanicAlert from './pages/PanicAlert';
import ChatMate from './pages/ChatMate';
import HealthTracker from './pages/HealthTracker';
import BreathingWellness from './pages/BreathingWellness';
import EmergencyMap from './pages/EmergencyMap';
import Welcome from './pages/Welcome';
import CreateProfile from './pages/CreateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route element={<Layout />}>
          <Route path="/my-care" element={<MyCare />} />
          <Route path="/panic-alert" element={<PanicAlert />} />
          <Route path="/chat-mate" element={<ChatMate />} />
          <Route path="/health-tracker" element={<HealthTracker />} />
          <Route path="/breathing-wellness" element={<BreathingWellness />} />
          <Route path="/emergency-map" element={<EmergencyMap />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
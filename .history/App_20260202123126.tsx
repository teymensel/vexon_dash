import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Commands from './pages/Commands';
import Premium from './pages/Premium';
import Dashboard from './pages/Dashboard';
import ServerDashboard from './pages/ServerDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0f1016]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:guildId" element={<ServerDashboard />} />
            <Route path="/callback" element={<LoginCallback />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
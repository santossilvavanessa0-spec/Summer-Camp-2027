/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Highlights from './components/Highlights';
import Gallery from './components/Gallery';
import Schedule from './components/Schedule';
import Pricing from './components/Pricing';
import RegistrationForm from './components/RegistrationForm';
import ParticipantArea from './components/ParticipantArea';
import AdminPanel from './components/AdminPanel';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import AuthModal from './components/AuthModal';

import { initDB, getCurrentUser, logout, LoggedInUser } from './utils/db';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  // Stats refresh state
  const [statsTrigger, setStatsTrigger] = useState(0);

  // Initialize DB and load current user session
  useEffect(() => {
    initDB();
    setUser(getCurrentUser());
  }, []);

  // Sync scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      // Don't sync scroll if on admin or participant private pages
      if (activeSection === 'admin' || activeSection === 'participant') return;

      const sections = ['hero', 'about', 'highlights', 'gallery', 'schedule', 'pricing', 'faq', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // If it is a landing page section, scroll to it
    if (['hero', 'about', 'highlights', 'gallery', 'schedule', 'pricing', 'faq', 'contact', 'registration'].includes(sectionId)) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      // Scroll to top for private pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (loggedInUser: LoggedInUser) => {
    setUser(loggedInUser);
    setStatsTrigger(prev => prev + 1); // Refresh stats
    
    // Redirect accordingly
    if (loggedInUser.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('participant');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setStatsTrigger(prev => prev + 1); // Refresh stats
    handleNavigate('hero');
  };

  const handleRegistrationSuccess = (loggedInUser: LoggedInUser) => {
    setUser(loggedInUser);
    setStatsTrigger(prev => prev + 1); // Increment to update the progress bar and database stats
    handleNavigate('participant');
  };

  // Check if we are viewing private dashboard areas
  const isDashboardView = activeSection === 'admin' || activeSection === 'participant';

  return (
    <div id="app-root" className="min-h-screen bg-[#050b18] text-white selection:bg-orange-500 selection:text-white overflow-x-hidden font-sans antialiased">
      
      {/* Sticky Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Transition Frame */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {activeSection === 'admin' && user?.role === 'admin' ? (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel 
                onLogout={handleLogout} 
                onRefreshStats={() => setStatsTrigger(prev => prev + 1)} 
              />
            </motion.div>
          ) : activeSection === 'participant' && user?.role === 'participant' ? (
            <motion.div
              key="participant-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ParticipantArea
                user={user}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-0"
            >
              {/* Landing Page Content Sections */}
              <Hero onNavigate={handleNavigate} updateTrigger={statsTrigger} />
              <About />
              <Highlights />
              <Gallery />
              <Schedule />
              <Pricing onNavigate={handleNavigate} />
              <RegistrationForm 
                onSuccess={handleRegistrationSuccess} 
                onNavigate={handleNavigate} 
              />
              <FAQ />
              <Contact onNavigate={handleNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Auth Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

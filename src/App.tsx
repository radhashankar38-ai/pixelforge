/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppState, User, Project } from './types';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import AuthScreen from './components/AuthScreen';
import HomeDashboard from './components/HomeDashboard';
import EditorWorkspace from './components/EditorWorkspace';
import ProfileScreen from './components/ProfileScreen';
import ExportScreen from './components/ExportScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('pixelforge_onboarding');
      if (!hasSeenOnboarding) {
        setCurrentScreen('onboarding');
      } else {
        const storedUser = localStorage.getItem('pixelforge_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setCurrentScreen('home');
        } else {
          setCurrentScreen('auth');
        }
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('pixelforge_user', JSON.stringify(u));
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pixelforge_user');
    setCurrentScreen('auth');
  };

  const navigateTo = (screen: AppState) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <Onboarding onComplete={() => {
          localStorage.setItem('pixelforge_onboarding', 'true');
          setCurrentScreen('auth');
        }} />;
      case 'auth':
        return <AuthScreen onLogin={handleLogin} />;
      case 'home':
        return <HomeDashboard 
          user={user} 
          onNavigate={navigateTo} 
          onOpenProject={(p) => { setCurrentProject(p); setCurrentScreen('editor'); }} 
          onNewProject={(p) => { setCurrentProject(p); setCurrentScreen('editor'); }}
        />;
      case 'editor':
        return <EditorWorkspace 
          project={currentProject} 
          onBack={() => setCurrentScreen('home')} 
          onExport={(p) => { setCurrentProject(p); setCurrentScreen('export'); }} 
          onSave={(p) => {
             // In a real app, save to cloud/DB here
             setCurrentProject(p);
             setProjects(prev => {
               const exists = prev.find(x => x.id === p.id);
               if (exists) return prev.map(x => x.id === p.id ? p : x);
               return [p, ...prev];
             });
          }}
        />;
      case 'profile':
        return <ProfileScreen user={user} onLogout={handleLogout} onBack={() => setCurrentScreen('home')} />;
      case 'export':
        return <ExportScreen project={currentProject} onBack={() => setCurrentScreen('editor')} onDone={() => setCurrentScreen('home')} />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 font-sans flex justify-center selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-[#050507] min-h-screen relative overflow-hidden shadow-2xl overflow-y-auto">
        {renderScreen()}
      </div>
    </div>
  );
}

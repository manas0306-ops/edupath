import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PracticePage } from './pages/PracticePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ReportsPage } from './pages/ReportsPage';
import { PracticeModal } from './components/PracticeModal';
import { ChatBot } from './components/ChatBot';
import { AuthPage } from './pages/AuthPage';

export const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [practiceSkill, setPracticeSkill] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Initializing EduPath AI Agent...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActiveTab}
            onLaunchPractice={(skill) => setPracticeSkill(skill || "PyTorch")}
          />
        );
      case 'skill-gap':
        return (
          <SkillGapPage
            onLaunchPractice={(skill) => setPracticeSkill(skill || "PyTorch")}
          />
        );
      case 'roadmap':
        return (
          <RoadmapPage
            onLaunchPractice={(skill) => setPracticeSkill(skill || "PyTorch")}
          />
        );
      case 'practice':
        return (
          <PracticePage
            onLaunchPractice={(skill) => setPracticeSkill(skill || "PyTorch")}
          />
        );
      case 'projects':
        return <ProjectsPage />;
      case 'mentor':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Learning Mentor</h1>
            <ChatBot isFloating={false} />
          </div>
        );
      case 'reports':
        return <ReportsPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} onLaunchPractice={setPracticeSkill} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar onOpenAuth={(mode) => setAuthModal(mode)} />

      {/* Main View Area */}
      {!isAuthenticated ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => setAuthModal('register')}
            onExploreDemo={() => setActiveTab('dashboard')}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active Tab View */}
          <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
            {renderContent()}
          </main>

          {/* Floating AI Mentor Assistant (accessible across all tabs except mentor tab itself) */}
          {activeTab !== 'mentor' && <ChatBot isFloating={true} />}
        </div>
      )}

      {/* Diagnostic Practice Modal */}
      {practiceSkill && (
        <PracticeModal
          skillName={practiceSkill}
          isOpen={!!practiceSkill}
          onClose={() => setPracticeSkill(null)}
          onAttemptCompleted={() => {}}
        />
      )}

      {/* Authentication Modal */}
      {authModal && (
        <AuthPage
          defaultMode={authModal}
          onSuccess={() => setAuthModal(null)}
          onCancel={() => setAuthModal(null)}
        />
      )}

    </div>
  );
};

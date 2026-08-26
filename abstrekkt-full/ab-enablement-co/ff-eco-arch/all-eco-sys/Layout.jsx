import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useUserData } from './components/hooks/useUserData';
import ErrorBoundary from './components/common/ErrorBoundary';
import { 
  LayoutDashboard, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Users,
  Gift,
  User,
  Download,
  Plug,
  ChevronRight,
  Shield,
  FileText,
  Cake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from './components/notifications/NotificationBell';
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import ServiceWorkerInit from './components/pwa/ServiceWorkerInit';
import { OnboardingProvider } from './components/onboarding/OnboardingProvider';
import OnboardingModal from './components/onboarding/OnboardingModal';
import OnboardingProgress from './components/onboarding/OnboardingProgress';
import OnboardingTrigger from './components/onboarding/OnboardingTrigger';
import KeyboardShortcuts from './components/core/KeyboardShortcuts';
import { useSessionTimeout } from './components/hooks/useSessionTimeout';

const HEADER_IMAGE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691e3ae3bd4916f2e05ae35e/1b2b117bd_ChatGPTImageNov25202503_31_49PM.png';

export default function Layout({ children, currentPageName }) {
  // ✅ FIX: ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
  // This fixes the React Hooks violation where hooks were called after early return
  const { user, loading: userLoading } = useUserData(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Enable 8-hour session timeout
  useSessionTimeout(true);

  // Calculate role-based navigation BEFORE any returns
  const isAdmin = user?.role === 'admin';
  const isFacilitator = user?.user_type === 'facilitator';
  const isParticipant = user?.user_type === 'participant';

  // ✅ FIX: useMemo must be called unconditionally
  const navigation = useMemo(() => {
    if (isAdmin) {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
        { name: 'Facilitator', icon: Users, page: 'FacilitatorDashboard' },
        { name: 'Activities', icon: Sparkles, page: 'Activities' },
        { name: 'Templates', icon: LayoutDashboard, page: 'EventTemplates' },
        { name: 'Calendar', icon: Calendar, page: 'Calendar' },
        { name: 'Employee Directory', icon: Users, page: 'EmployeeDirectory' },
        { name: 'Learning Paths', icon: FileText, page: 'LearningDashboard' },
        { name: 'Teams', icon: Users, page: 'Teams' },
        { name: 'Channels', icon: Users, page: 'Channels' },
        { name: 'Recognition', icon: Gift, page: 'Recognition' },
        { name: 'Leaderboards', icon: BarChart3, page: 'Leaderboards' },
        { name: 'Team Competition', icon: Users, page: 'TeamCompetition' },
        { name: 'Skills', icon: BarChart3, page: 'SkillsDashboard' },
        { name: 'Gamification', icon: Gift, page: 'GamificationDashboard' },
        { name: 'Gamification Admin', icon: Shield, page: 'GamificationAdmin' },
        { name: 'Gamification Settings', icon: SettingsIcon, page: 'GamificationSettings' },
        { name: 'Gamification Analytics', icon: BarChart3, page: 'AdvancedGamificationAnalytics' },
        { name: 'AI Event Planner', icon: Sparkles, page: 'AIEventPlanner' },
        { name: 'Surveys', icon: FileText, page: 'Surveys' },
        { name: 'Milestones', icon: Cake, page: 'Milestones' },
        { name: 'Analytics', icon: BarChart3, page: 'Analytics' },
        { name: 'Audit Log', icon: Shield, page: 'AuditLog' },
        { name: 'Integrations', icon: Plug, page: 'IntegrationsHub' },
        { name: 'Real-Time Analytics', icon: BarChart3, page: 'RealTimeAnalytics' },
        { name: 'Project Plan', icon: LayoutDashboard, page: 'ProjectPlan' },
        { name: 'Documentation', icon: LayoutDashboard, page: 'Documentation' },
        { name: 'Onboarding Hub', icon: User, page: 'OnboardingDashboard' },
        { name: 'Settings', icon: SettingsIcon, page: 'Settings' },
      ];
    }
    
    if (isFacilitator) {
      return [
        { name: 'Dashboard', icon: LayoutDashboard, page: 'FacilitatorDashboard' },
        { name: 'Team Leader', icon: Users, page: 'TeamLeaderDashboard' },
        { name: 'Activities', icon: Sparkles, page: 'Activities' },
        { name: 'Calendar', icon: Calendar, page: 'Calendar' },
        { name: 'Learning', icon: FileText, page: 'LearningDashboard' },
        { name: 'Teams', icon: Users, page: 'Teams' },
        { name: 'Channels', icon: Users, page: 'Channels' },
        { name: 'Recognition', icon: Gift, page: 'Recognition' },
        { name: 'Leaderboards', icon: BarChart3, page: 'Leaderboards' },
        { name: 'My Profile', icon: User, page: 'UserProfile' },
      ];
    }
    
    // Participant navigation
    return [
      { name: 'My Events', icon: Calendar, page: 'ParticipantPortal' },
      { name: 'Learning', icon: FileText, page: 'LearningDashboard' },
      { name: 'Teams', icon: Users, page: 'Teams' },
      { name: 'Recognition', icon: Gift, page: 'Recognition' },
      { name: 'Leaderboards', icon: BarChart3, page: 'Leaderboards' },
      { name: 'My Profile', icon: User, page: 'UserProfile' },
    ];
  }, [isAdmin, isFacilitator, isParticipant]);

  // PWA install prompt handler
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleLogout = () => {
    // Prevent multiple logout clicks
    if (currentPageName === 'Login') return;
    base44.auth.logout();
  };

  // ✅ NOW SAFE: Early returns AFTER all hooks
  // Minimal layout pages (no sidebar/header)
  if (currentPageName === 'ParticipantEvent' || currentPageName === 'RoleSelection') {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  // Rest of component continues with normal layout...
  return (
    <OnboardingProvider>
      <ServiceWorkerInit />
      <KeyboardShortcuts />
      
      <div className="min-h-screen bg-slate-50">
        {/* Install Banner */}
        {showInstallBanner && (
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5" />
              <p className="text-sm font-medium">
                Install Interact for a better experience
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInstallClick}
                className="text-white hover:bg-white/20"
              >
                Install
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallBanner}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Mobile Menu */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md hover:bg-slate-100"
                >
                  {sidebarOpen ? (
                    <X className="h-6 w-6 text-slate-600" />
                  ) : (
                    <Menu className="h-6 w-6 text-slate-600" />
                  )}
                </button>
                
                <Link to={createPageUrl('Dashboard')} className="flex items-center space-x-3">
                  <img
                    src={HEADER_IMAGE}
                    alt="Interact Logo"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Interact
                  </span>
                </Link>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                <OnboardingProgress />
                <OnboardingTrigger />
                <NotificationBell />
                
                {user && (
                  <div className="flex items-center space-x-3">
                    <Link 
                      to={createPageUrl('UserProfile')}
                      className="hidden sm:flex items-center space-x-2 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {user.full_name || user.email}
                      </span>
                    </Link>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] sticky top-16">
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.page;
                
                return (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
              <aside
                className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">Menu</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <nav className="p-4 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPageName === item.page;
                    
                    return (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal />
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt
          onInstall={handleInstallClick}
          onDismiss={dismissInstallBanner}
        />
      </div>
    </OnboardingProvider>
  );
}

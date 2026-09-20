import React from 'react';
import { NavigationProvider } from './contexts/NavigationContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { MainLayout } from './components/layout/MainLayout';
import { ContentViewer } from './components/ContentViewer';
import { ToastContainer } from './components/ui/Toast';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  return (
    <MainLayout>
      <ContentViewer />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </MainLayout>
  );
}

function App() {
  return (
    <NavigationProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </NavigationProvider>
  );
}

export default App;

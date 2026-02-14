import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, AuthContext } from '@/context/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { useCurrentUser } from '@/hooks/useAuthMutations';

import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import ProjectsPage from '@/pages/ProjectsPage';
import TicketsPage from '@/pages/TicketsPage';
import TicketDetailPage from '@/pages/TicketDetailPage';

import PrivateRoute from '@/components/PrivateRoute';
import Navbar from '@/components/Navbar';

function AppContent() {
  const { setUser } = React.useContext(AuthContext)!;
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orgs/:orgId/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:projectId/tickets" element={<TicketsPage />} />
                    <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

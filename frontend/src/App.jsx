import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Analytics from './pages/Analytics';
import LeadDetail from './pages/LeadDetail';
import Settings from './pages/Settings';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0F1C' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-slow"
            style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', boxShadow: '0 0 30px rgba(0,229,255,0.3)' }}
          >
            <span className="text-xl">⚡</span>
          </div>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Loading OrbitFlow CRM...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
      <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
      <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#121A2A',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#0A0F1C' },
              style: { borderColor: 'rgba(34,197,94,0.2)' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#0A0F1C' },
              style: { borderColor: 'rgba(239,68,68,0.2)' },
            },
          }}
        />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

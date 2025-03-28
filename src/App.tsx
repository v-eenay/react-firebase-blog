import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import { ModerationProvider } from './contexts/ModerationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import CreatePost from './pages/CreatePost';
import './styles/modern-theme.css';
import NotificationBell from './components/NotificationBell';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import TermsOfService from './pages/TermsOfService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CollaborationProvider>
          <GamificationProvider>
            <LanguageProvider>
              <ModerationProvider>
                <ThemeProvider>
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route
                          path="/blog/:id"
                          element={
                            <ProtectedRoute>
                              <BlogPost />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/login" element={<Login />} /> 
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/about" element={<About />} />
                        <Route
                          path="/profile/:id?"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute requireAdmin={true}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <UserDashboard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/create-post"
                          element={
                            <ProtectedRoute>
                              <CreatePost />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </Layout>
                  </Router>
                </ThemeProvider>
              </ModerationProvider>
            </LanguageProvider>
          </GamificationProvider>
        </CollaborationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

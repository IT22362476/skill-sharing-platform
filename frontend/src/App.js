import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, CircularProgress } from '@mui/material';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import MyLearningPage from './pages/MyLearningPage';
import CreateProgressPage from './pages/CreateProgressPage';
import CreatePlanPage from './pages/CreatePlanPage';
import UserSearchPage from './pages/UserSearchPage';
import OAuthRedirectHandler from './pages/OAuthRedirectHandler';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Navbar />
      <Box sx={{ minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          {/* Public Routes — only login/register and landing */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirectHandler />} />
          <Route path="/" element={
            <ProtectedRoute><FeedPage /></ProtectedRoute>
          } />

          {/* Landing page for guests */}
          <Route path="/welcome" element={<LandingPage />} />

          {/* Protected Routes — require login */}
          <Route path="/posts/:id" element={
            <ProtectedRoute><PostDetailPage /></ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute><UserSearchPage /></ProtectedRoute>
          } />
          <Route path="/create-post" element={
            <ProtectedRoute><CreatePostPage /></ProtectedRoute>
          } />
          <Route path="/my-learning" element={
            <ProtectedRoute><MyLearningPage /></ProtectedRoute>
          } />
          <Route path="/create-progress" element={
            <ProtectedRoute><CreateProgressPage /></ProtectedRoute>
          } />
          <Route path="/create-plan" element={
            <ProtectedRoute><CreatePlanPage /></ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route path="/create-post" element={
            <ProtectedRoute><CreatePostPage /></ProtectedRoute>
          } />
          <Route path="/my-learning" element={
            <ProtectedRoute><MyLearningPage /></ProtectedRoute>
          } />
          <Route path="/create-progress" element={
            <ProtectedRoute><CreateProgressPage /></ProtectedRoute>
          } />
          <Route path="/create-plan" element={
            <ProtectedRoute><CreatePlanPage /></ProtectedRoute>
          } />
        </Routes>
      </Box>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

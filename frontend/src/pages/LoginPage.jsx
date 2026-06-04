import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, Divider,
  Link, Alert, CircularProgress, Fade, Collapse
} from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login, register, user } = useAuth();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await register(username, email, password);
        toast.success('Account created!');
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: mode === 'light'
          ? 'linear-gradient(135deg, #e3f0ff 0%, #f5f5f5 50%, #fce4ec 100%)'
          : 'linear-gradient(135deg, #0d1b2a 0%, #121212 50%, #1a0a12 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Fade in timeout={400}>
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            borderRadius: '16px !important',
            boxShadow: mode === 'light'
              ? '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)'
              : '0 20px 60px rgba(0,0,0,0.6)',
            border: '1px solid',
            borderColor: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 52,
                  height: 52,
                  borderRadius: '14px',
                  bgcolor: 'primary.main',
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(25,118,210,0.35)',
                }}
              >
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>S</Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.03em' }}>
                SkillShare
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
              </Typography>
            </Box>

            {/* Error Alert */}
            <Collapse in={Boolean(error)}>
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            </Collapse>

            {/* OAuth Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 2.5 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
                onClick={() => handleOAuth('google')}
                size="large"
                sx={{
                  borderColor: '#dadce0',
                  color: mode === 'light' ? '#3c4043' : 'text.primary',
                  '&:hover': {
                    borderColor: '#1a73e8',
                    bgcolor: 'rgba(26,115,232,0.04)',
                    transform: 'translateY(-1px)',
                  },
                  py: 1.25,
                  fontWeight: 600,
                }}
              >
                Continue with Google
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GitHub />}
                onClick={() => handleOAuth('github')}
                size="large"
                sx={{
                  borderColor: mode === 'light' ? '#d0d7de' : 'rgba(255,255,255,0.2)',
                  color: mode === 'light' ? '#24292f' : 'text.primary',
                  '&:hover': {
                    borderColor: mode === 'light' ? '#24292f' : 'rgba(255,255,255,0.4)',
                    bgcolor: mode === 'light' ? 'rgba(36,41,47,0.04)' : 'rgba(255,255,255,0.06)',
                    transform: 'translateY(-1px)',
                  },
                  py: 1.25,
                  fontWeight: 600,
                }}
              >
                Continue with GitHub
              </Button>
            </Box>

            <Divider sx={{ my: 2.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 500 }}>
                OR
              </Typography>
            </Divider>

            {/* Email/Password Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Collapse in={!isLogin} timeout={200}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  required={!isLogin}
                  size="medium"
                  sx={{ mb: 0 }}
                />
              </Collapse>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus={isLogin}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                helperText={!isLogin ? 'At least 6 characters' : ''}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 2.5,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                    boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </Box>

            <Typography textAlign="center" variant="body2" color="text.secondary">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link
                component="button"
                type="button"
                onClick={handleToggle}
                underline="hover"
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default LoginPage;

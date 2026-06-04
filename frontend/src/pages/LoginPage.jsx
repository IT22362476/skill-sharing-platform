import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button, Divider,
  Link, Alert, CircularProgress
} from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login, register, user } = useAuth();
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
      const msg = err.response?.data?.message || 'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Card sx={{ maxWidth: 440, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            SkillShare
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* OAuth Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={() => handleOAuth('google')}
              size="large"
            >
              Continue with Google
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHub />}
              onClick={() => handleOAuth('github')}
              size="large"
            >
              Continue with GitHub
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          {/* Email/Password Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                autoFocus={!isLogin}
              />
            )}
            <TextField
              fullWidth
              label="Email"
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
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : (isLogin ? 'Login' : 'Register')}
            </Button>
          </Box>

          <Typography textAlign="center" variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              component="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              underline="hover"
            >
              {isLogin ? 'Register' : 'Login'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

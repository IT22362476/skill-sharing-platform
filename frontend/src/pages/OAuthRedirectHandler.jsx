import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const OAuthRedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthRedirect } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleOAuthRedirect(token);
      navigate('/', { replace: true });
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    }
  }, [searchParams, handleOAuthRedirect, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Completing authentication...</Typography>
        </>
      )}
    </Box>
  );
};

export default OAuthRedirectHandler;

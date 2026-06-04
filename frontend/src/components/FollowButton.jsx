import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PersonAdd, PersonRemove } from '@mui/icons-material';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FollowButton = ({ userId, initialFollowing, onFollowChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.id === userId) return;

    const prev = following;
    setFollowing(!following);
    setLoading(true);
    try {
      if (prev) {
        await userAPI.unfollowUser(userId);
      } else {
        await userAPI.followUser(userId);
      }
      if (onFollowChange) onFollowChange(!prev);
    } catch (err) {
      setFollowing(prev);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === userId) return null;

  return (
    <Button
      variant={following ? 'outlined' : 'contained'}
      size="small"
      onClick={handleClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      startIcon={
        loading ? null : following
          ? <PersonRemove sx={{ fontSize: '0.9rem' }} />
          : <PersonAdd sx={{ fontSize: '0.9rem' }} />
      }
      sx={{
        minWidth: 100,
        fontWeight: 600,
        fontSize: '0.8rem',
        borderRadius: '8px',
        transition: 'all 0.18s ease',
        ...(following
          ? {
              borderColor: hovered ? 'error.main' : 'divider',
              color: hovered ? 'error.main' : 'text.secondary',
              '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'error.light',
                color: 'error.main',
              },
            }
          : {
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
              },
            }),
      }}
    >
      {loading ? (
        <CircularProgress size={14} color="inherit" />
      ) : following ? (
        hovered ? 'Unfollow' : 'Following'
      ) : (
        'Follow'
      )}
    </Button>
  );
};

export default FollowButton;

import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
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

    setLoading(true);
    try {
      if (following) {
        await userAPI.unfollowUser(userId);
        setFollowing(false);
      } else {
        await userAPI.followUser(userId);
        setFollowing(true);
      }
      if (onFollowChange) onFollowChange(!following);
    } catch (err) {
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
      startIcon={following ? <PersonRemove /> : <PersonAdd />}
    >
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;

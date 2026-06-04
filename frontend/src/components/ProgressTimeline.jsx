import React, { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Card, CardContent, Chip, IconButton
} from '@mui/material';
import { School, Star, Timer, Delete } from '@mui/icons-material';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TYPE_CONFIG = {
  COMPLETED_TUTORIAL: {
    icon: <School fontSize="small" />,
    color: 'success',
    borderColor: '#4caf50',
    label: 'Completed Tutorial',
  },
  NEW_SKILL: {
    icon: <Star fontSize="small" />,
    color: 'primary',
    borderColor: '#1976d2',
    label: 'New Skill',
  },
  TIME_SPENT: {
    icon: <Timer fontSize="small" />,
    color: 'warning',
    borderColor: '#ff9800',
    label: 'Time Spent',
  },
};

const ProgressTimeline = ({ userId }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwn = user && user.id === userId;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressAPI.getUserProgress(userId, 0, 30);
        setProgress(res.data.content || []);
      } catch (err) {
        console.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this progress update?')) return;
    try {
      await progressAPI.deleteProgress(id);
      setProgress((prev) => prev.filter((p) => p.id !== id));
      toast.success('Progress deleted');
    } catch (err) {
      toast.error('Failed to delete progress');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (progress.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2" sx={{ py: 4, textAlign: 'center' }}>
        No progress updates yet
      </Typography>
    );
  }

  return (
    <Box>
      {progress.map((item) => {
        const config = TYPE_CONFIG[item.templateType] || TYPE_CONFIG.COMPLETED_TUTORIAL;
        return (
          <Card
            key={item.id}
            sx={{
              mb: 2,
              borderLeft: `4px solid ${config.borderColor}`,
              '&:hover .delete-btn': { opacity: 1 },
            }}
          >
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={config.icon}
                    label={config.label}
                    size="small"
                    color={config.color}
                    variant="outlined"
                  />
                  {item.skillCategory && (
                    <Chip
                      label={item.skillCategory}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
                {isOwn && (
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.15s ease',
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <Delete sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, mb: 1 }}>
                {item.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ProgressTimeline;

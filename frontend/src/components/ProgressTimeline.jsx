import React, { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Card, CardContent, Chip
} from '@mui/material';
import { School, Star, Timer } from '@mui/icons-material';
import { progressAPI } from '../services/api';

const ProgressTimeline = ({ userId }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressAPI.getUserProgress(userId, 0, 20);
        setProgress(res.data.content || []);
      } catch (err) {
        console.error('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  const getIcon = (type) => {
    switch (type) {
      case 'COMPLETED_TUTORIAL': return <School fontSize="small" />;
      case 'NEW_SKILL': return <Star fontSize="small" />;
      case 'TIME_SPENT': return <Timer fontSize="small" />;
      default: return <School fontSize="small" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'COMPLETED_TUTORIAL': return 'success';
      case 'NEW_SKILL': return 'primary';
      case 'TIME_SPENT': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <CircularProgress size={24} />;

  if (progress.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        No progress updates yet
      </Typography>
    );
  }

  return (
    <Box>
      {progress.map((item) => (
        <Card
          key={item.id}
          sx={{
            mb: 2,
            borderLeft: 4,
            borderColor: `${getColor(item.templateType)}.main`,
          }}
        >
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getIcon(item.templateType)}
              <Chip
                label={item.templateType.replace(/_/g, ' ')}
                size="small"
                color={getColor(item.templateType)}
                variant="outlined"
              />
              {item.skillCategory && (
                <Chip label={item.skillCategory} size="small" variant="outlined" />
              )}
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {item.content}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProgressTimeline;

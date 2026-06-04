import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Tabs, Tab, Button, Grid, CircularProgress
} from '@mui/material';
import { Add, School, EmojiEvents } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { planAPI } from '../services/api';
import ProgressTimeline from '../components/ProgressTimeline';
import PlanCard from '../components/PlanCard';

const MyLearningPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await planAPI.getUserPlans(user.id);
        setPlans(res.data || []);
      } catch (err) {
        console.error('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [user.id]);

  const handlePlanUpdate = async (planId, status, progressNotes) => {
    try {
      const res = await planAPI.updatePlan(planId, { status, progressNotes });
      setPlans((prev) => prev.map((p) => (p.id === planId ? res.data : p)));
    } catch (err) {
      console.error('Failed to update plan');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 3, px: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
            My Learning
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            Track your progress and manage your learning plans
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/create-progress')}
          >
            Add Progress
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create-plan')}
          >
            New Plan
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab icon={<School sx={{ fontSize: '1rem' }} />} label="Progress" iconPosition="start" />
          <Tab icon={<EmojiEvents sx={{ fontSize: '1rem' }} />} label="Plans" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Progress Tab */}
      {tab === 0 && (
        <Box sx={{ maxWidth: 680 }}>
          <ProgressTimeline userId={user.id} />
        </Box>
      )}

      {/* Plans Tab */}
      {tab === 1 && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : plans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                mb: 2.5,
              }}
            >
              <EmojiEvents sx={{ fontSize: 36, color: 'text.disabled' }} />
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
              No learning plans yet
            </Typography>
            <Typography variant="body2" color="text.disabled" mb={3}>
              Create your first learning plan to structure your journey!
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create-plan')}>
              Create Plan
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} md={6} key={plan.id}>
                <PlanCard plan={plan} onUpdate={handlePlanUpdate} />
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Box>
  );
};

export default MyLearningPage;

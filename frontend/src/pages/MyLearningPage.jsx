import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Tabs, Tab, Button, Grid, CircularProgress
} from '@mui/material';
import { Add, School, EmojiEvents } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { progressAPI, planAPI } from '../services/api';
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
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? res.data : p))
      );
    } catch (err) {
      console.error('Failed to update plan');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 3, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          My Learning
        </Typography>
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

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<School />} label="Progress" iconPosition="start" />
        <Tab icon={<EmojiEvents />} label="Plans" iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <ProgressTimeline userId={user.id} />
      )}

      {tab === 1 && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : plans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No learning plans yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create your first learning plan to track your progress!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/create-plan')}>
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

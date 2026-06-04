import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Chip, CircularProgress, Alert, Stepper, Step, StepLabel,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { planAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const STEPS = ['Basic Info', 'Topics & Resources', 'Dates & Review'];

const CreatePlanPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState('');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleAddResource = () => {
    if (newResource.trim() && !resources.includes(newResource.trim())) {
      setResources([...resources, newResource.trim()]);
      setNewResource('');
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return title.trim().length > 0;
      case 1:
        return topics.length > 0;
      case 2:
        return startDate && targetDate && new Date(targetDate) > new Date(startDate);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      setError('Please check all fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await planAPI.createPlan({
        title: title.trim(),
        description: description.trim() || null,
        topics,
        resources,
        startDate,
        targetDate,
      });
      toast.success('Learning plan created!');
      navigate('/my-learning');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Create Learning Plan
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Structure your learning journey with topics, resources, and deadlines
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {activeStep === 0 && (
            <Box>
              <TextField
                fullWidth
                label="Plan Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn Full-Stack Web Development"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning goals..."
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Topics <Typography component="span" color="error">*</Typography>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                />
                <IconButton color="primary" onClick={handleAddTopic}>
                  <Add />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                {topics.map((topic, i) => (
                  <Chip
                    key={i}
                    label={topic}
                    onDelete={() => setTopics(topics.filter((_, idx) => idx !== i))}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Resources (optional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="URL or text description"
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
                />
                <IconButton color="primary" onClick={handleAddResource}>
                  <Add />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {resources.map((resource, i) => (
                  <Chip
                    key={i}
                    label={resource.length > 50 ? resource.substring(0, 50) + '...' : resource}
                    onDelete={() => setResources(resources.filter((_, idx) => idx !== i))}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Target Completion Date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: startDate }}
                required
              />

              {startDate && targetDate && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Duration: {Math.ceil((new Date(targetDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
                </Alert>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep < STEPS.length - 1 ? (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Plan'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePlanPage;

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
    const trimmed = newTopic.trim();
    if (trimmed && !topics.includes(trimmed)) {
      setTopics([...topics, trimmed]);
      setNewTopic('');
    }
  };

  const handleAddResource = () => {
    const trimmed = newResource.trim();
    if (trimmed && !resources.includes(trimmed)) {
      setResources([...resources, trimmed]);
      setNewResource('');
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0: return title.trim().length > 0;
      case 1: return topics.length > 0;
      case 2: return startDate && targetDate && new Date(targetDate) > new Date(startDate);
      default: return true;
    }
  };

  const getStepError = () => {
    switch (activeStep) {
      case 0: return 'Plan title is required';
      case 1: return 'Add at least one topic';
      case 2: return 'Select valid start and target dates (target must be after start)';
      default: return '';
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      setError(getStepError());
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
      setError(getStepError());
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

  const durationDays = startDate && targetDate && new Date(targetDate) > new Date(startDate)
    ? Math.ceil((new Date(targetDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
        Create Learning Plan
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Structure your learning journey with topics, resources, and deadlines
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 1: Basic Info */}
          {activeStep === 0 && (
            <Box>
              <TextField
                fullWidth
                label="Plan Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Master Full-Stack Web Development"
                sx={{ mb: 2.5 }}
                required
                inputProps={{ maxLength: 200 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What do you want to achieve? What are your learning goals?"
                inputProps={{ maxLength: 1000 }}
                helperText={`${description.length}/1000`}
              />
            </Box>
          )}

          {/* Step 2: Topics & Resources */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Topics <Typography component="span" color="error">*</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                What subjects or technologies will you learn?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a topic (e.g., React, Python)"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddTopic}
                  disabled={!newTopic.trim()}
                  sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '8px' }}
                >
                  <Add />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3, minHeight: 32 }}>
                {topics.map((topic, i) => (
                  <Chip
                    key={i}
                    label={topic}
                    onDelete={() => setTopics(topics.filter((_, idx) => idx !== i))}
                    variant="outlined"
                    color="primary"
                    sx={{ transition: 'all 0.15s ease' }}
                  />
                ))}
                {topics.length === 0 && (
                  <Typography variant="caption" color="text.disabled" sx={{ py: 0.5 }}>
                    No topics added yet
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Resources (optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                URLs, books, or other learning materials
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="URL or resource description"
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
                />
                <IconButton
                  color="primary"
                  onClick={handleAddResource}
                  disabled={!newResource.trim()}
                  sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '8px' }}
                >
                  <Add />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, minHeight: 32 }}>
                {resources.map((resource, i) => (
                  <Chip
                    key={i}
                    label={resource.length > 50 ? resource.substring(0, 50) + '...' : resource}
                    onDelete={() => setResources(resources.filter((_, idx) => idx !== i))}
                    variant="outlined"
                    sx={{ transition: 'all 0.15s ease' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Step 3: Dates & Review */}
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
                sx={{ mb: 2 }}
                required
              />

              {durationDays && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Plan Duration: {durationDays} day{durationDays !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {title} &bull; {topics.length} topic{topics.length !== 1 ? 's' : ''}
                    {resources.length > 0 && ` \u2022 ${resources.length} resource${resources.length !== 1 ? 's' : ''}`}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep < STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ minWidth: 100 }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{
                    minWidth: 140,
                    background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                    '&:hover': { background: 'linear-gradient(135deg, #1565c0, #0d47a1)' },
                  }}
                >
                  {submitting ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Create Plan'}
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

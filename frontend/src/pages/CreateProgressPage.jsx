import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  CircularProgress, Alert, Chip
} from '@mui/material';
import { School, Star, Timer } from '@mui/icons-material';
import { progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TEMPLATES = [
  {
    type: 'COMPLETED_TUTORIAL',
    label: 'Completed Tutorial',
    icon: <School fontSize="small" />,
    placeholder: 'e.g., Completed the React Hooks tutorial and built a todo app with useState and useEffect',
  },
  {
    type: 'NEW_SKILL',
    label: 'Learned New Skill',
    icon: <Star fontSize="small" />,
    placeholder: 'e.g., Learned Docker containerization and deployed my first containerized application',
  },
  {
    type: 'TIME_SPENT',
    label: 'Time Spent',
    icon: <Timer fontSize="small" />,
    placeholder: 'e.g., Spent 5 hours studying Python data structures and algorithms',
  },
];

const SKILL_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science',
  'Machine Learning', 'DevOps', 'Design', 'Writing',
  'Business', 'Music', 'Language', 'Other',
];

const CreateProgressPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templateType, setTemplateType] = useState('COMPLETED_TUTORIAL');
  const [content, setContent] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const selectedTemplate = TEMPLATES.find((t) => t.type === templateType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please describe what you learned');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await progressAPI.createProgress({
        templateType,
        skillCategory: skillCategory || null,
        content: content.trim(),
      });
      toast.success('Progress logged!');
      navigate('/my-learning');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log progress');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
        Log Learning Progress
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Track your growth using a predefined template
      </Typography>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Template Selection */}
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel
                component="legend"
                sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 1.5, color: 'text.primary', '&.Mui-focused': { color: 'text.primary' } }}
              >
                Progress Type
              </FormLabel>
              <RadioGroup
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}
              >
                {TEMPLATES.map((t) => (
                  <Box
                    key={t.type}
                    onClick={() => setTemplateType(t.type)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.25,
                      border: '2px solid',
                      borderColor: templateType === t.type ? 'primary.main' : 'divider',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      bgcolor: templateType === t.type ? 'action.selected' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Radio
                      value={t.type}
                      size="small"
                      sx={{ p: 0, mr: 0 }}
                      checked={templateType === t.type}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: templateType === t.type ? 'primary.main' : 'text.secondary' }}>
                      {t.icon}
                      <Typography variant="body2" fontWeight={600}>
                        {t.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>

            {/* Content Field */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label={selectedTemplate?.label}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={selectedTemplate?.placeholder}
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 1000 }}
              helperText={`${content.length}/1000`}
            />

            {/* Skill Category Chips */}
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel
                component="legend"
                sx={{ fontWeight: 700, fontSize: '0.875rem', mb: 1.5, color: 'text.primary', '&.Mui-focused': { color: 'text.primary' } }}
              >
                Skill Category (optional)
              </FormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {SKILL_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    variant={skillCategory === cat ? 'filled' : 'outlined'}
                    color={skillCategory === cat ? 'primary' : 'default'}
                    onClick={() => setSkillCategory(skillCategory === cat ? '' : cat)}
                    clickable
                    sx={{
                      transition: 'all 0.15s ease',
                      '&:hover': { transform: 'translateY(-1px)' },
                    }}
                  />
                ))}
              </Box>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting || !content.trim()}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                  boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                },
              }}
            >
              {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Log Progress'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProgressPage;

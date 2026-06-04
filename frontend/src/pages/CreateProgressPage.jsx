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
    icon: <School />,
    placeholder: 'e.g., Completed React tutorial on building a todo app',
  },
  {
    type: 'NEW_SKILL',
    label: 'Learned New Skill',
    icon: <Star />,
    placeholder: 'e.g., Learned Docker containerization',
  },
  {
    type: 'TIME_SPENT',
    label: 'Time Spent Learning',
    icon: <Timer />,
    placeholder: 'e.g., Spent 5 hours learning Python data structures',
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
      setError('Please fill in the progress content');
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
      toast.success('Progress update added!');
      navigate('/my-learning');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create progress update');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Log Learning Progress
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Share your learning journey with predefined templates
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Progress Type</FormLabel>
              <RadioGroup
                row
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
              >
                {TEMPLATES.map((t) => (
                  <FormControlLabel
                    key={t.type}
                    value={t.type}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {t.icon}
                        {t.label}
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label={selectedTemplate?.label}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={selectedTemplate?.placeholder}
              sx={{ mb: 2 }}
            />

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Skill Category (optional)</FormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {SKILL_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    variant={skillCategory === cat ? 'filled' : 'outlined'}
                    color={skillCategory === cat ? 'primary' : 'default'}
                    onClick={() => setSkillCategory(skillCategory === cat ? '' : cat)}
                    clickable
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
            >
              {submitting ? <CircularProgress size={24} /> : 'Log Progress'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateProgressPage;

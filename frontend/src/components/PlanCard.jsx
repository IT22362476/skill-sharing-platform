import React from 'react';
import {
  Card, CardContent, Typography, Chip, Box, LinearProgress,
  Button, Collapse
} from '@mui/material';
import {
  CalendarToday, MenuBook, Link as LinkIcon
} from '@mui/icons-material';

const PlanCard = ({ plan, onUpdate }) => {
  const [expanded, setExpanded] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'default';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      default: return 'default';
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 0;
      case 'IN_PROGRESS': return 50;
      case 'COMPLETED': return 100;
      default: return 0;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {plan.title}
          </Typography>
          <Chip
            label={plan.status.replace(/_/g, ' ')}
            size="small"
            color={getStatusColor(plan.status)}
          />
        </Box>

        {plan.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {plan.description}
          </Typography>
        )}

        <LinearProgress
          variant="determinate"
          value={getProgress(plan.status)}
          sx={{ mb: 2, height: 8, borderRadius: 4 }}
          color={getStatusColor(plan.status)}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(plan.startDate)} - {formatDate(plan.targetDate)}
            </Typography>
          </Box>
        </Box>

        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Less details' : `More details (${(plan.topics || []).length} topics)`}
        </Button>

        <Collapse in={expanded}>
          {plan.topics && plan.topics.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <MenuBook fontSize="small" /> Topics
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {plan.topics.map((topic, i) => (
                  <Chip key={i} label={topic} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {plan.resources && plan.resources.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LinkIcon fontSize="small" /> Resources
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {plan.resources.map((resource, i) => (
                  <Chip
                    key={i}
                    label={resource.length > 40 ? resource.substring(0, 40) + '...' : resource}
                    size="small"
                    variant="outlined"
                    onClick={() => resource.startsWith('http') && window.open(resource, '_blank')}
                  />
                ))}
              </Box>
            </Box>
          )}

          {plan.progressNotes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Progress Notes</Typography>
              <Typography variant="body2" color="text.secondary">
                {plan.progressNotes}
              </Typography>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PlanCard;

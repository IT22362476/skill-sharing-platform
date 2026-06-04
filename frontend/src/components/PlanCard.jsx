import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Chip, Box, LinearProgress,
  Button, Collapse, Divider
} from '@mui/material';
import { CalendarToday, MenuBook, Link as LinkIcon, ExpandMore, ExpandLess } from '@mui/icons-material';

const STATUS_CONFIG = {
  NOT_STARTED: { color: 'default', progress: 0, label: 'Not Started' },
  IN_PROGRESS: { color: 'warning', progress: 50, label: 'In Progress' },
  COMPLETED: { color: 'success', progress: 100, label: 'Completed' },
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const PlanCard = ({ plan, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[plan.status] || STATUS_CONFIG.NOT_STARTED;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {plan.title}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            color={config.color}
            sx={{ flexShrink: 0, fontWeight: 600 }}
          />
        </Box>

        {/* Description */}
        {plan.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6 }}>
            {plan.description}
          </Typography>
        )}

        {/* Progress bar */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Progress</Typography>
            <Typography variant="caption" fontWeight={700} color={
              config.progress === 100 ? 'success.main' :
              config.progress === 50 ? 'warning.main' : 'text.secondary'
            }>
              {config.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={config.progress}
            color={config.color === 'default' ? 'inherit' : config.color}
            sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
          />
        </Box>

        {/* Date range */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <CalendarToday sx={{ fontSize: '0.85rem', color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(plan.startDate)} &mdash; {formatDate(plan.targetDate)}
          </Typography>
        </Box>

        {/* Expand button */}
        {((plan.topics && plan.topics.length > 0) || (plan.resources && plan.resources.length > 0) || plan.progressNotes) && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              sx={{ color: 'text.secondary', fontSize: '0.8rem', p: 0, '&:hover': { background: 'none', color: 'primary.main' } }}
            >
              {expanded ? 'Less details' : `More details`}
            </Button>

            <Collapse in={expanded}>
              <Box sx={{ mt: 1.5 }}>
                {plan.topics && plan.topics.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      <MenuBook sx={{ fontSize: '0.85rem' }} /> Topics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {plan.topics.map((topic, i) => (
                        <Chip key={i} label={topic} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {plan.resources && plan.resources.length > 0 && (
                  <Box sx={{ mb: plan.progressNotes ? 2 : 0 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      <LinkIcon sx={{ fontSize: '0.85rem' }} /> Resources
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {plan.resources.map((resource, i) => (
                        <Chip
                          key={i}
                          label={resource.length > 45 ? resource.substring(0, 45) + '...' : resource}
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => resource.startsWith('http') && window.open(resource, '_blank')}
                          clickable={resource.startsWith('http')}
                          sx={{ cursor: resource.startsWith('http') ? 'pointer' : 'default' }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {plan.progressNotes && (
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Progress Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {plan.progressNotes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;

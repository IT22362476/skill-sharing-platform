import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent
} from '@mui/material';
import {
  School, PeopleAlt, EmojiEvents, Timeline,
  ArrowForward, Google, GitHub
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Share Skills',
      desc: 'Post what you learn with text, images, and short videos.',
    },
    {
      icon: <PeopleAlt sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Connect with Learners',
      desc: 'Follow like-minded people and build your learning network.',
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Track Progress',
      desc: 'Log tutorials, skills, and hours spent learning.',
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Earn Badges',
      desc: 'Complete learning plans and earn achievement badges.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ fontSize: { xs: '2rem', md: '3.5rem' }, mb: 2 }}
          >
            Learn. Share. Grow.
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, mb: 5, fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            A community where learners share their journey, track progress,
            and inspire each other to master new skills.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Get Started
              <ArrowForward sx={{ ml: 1 }} />
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Learn More
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="text"
              startIcon={<Google />}
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Sign in with Google
            </Button>
            <Button
              variant="text"
              startIcon={<GitHub />}
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/github'}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Sign in with GitHub
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Why SkillShare?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Everything you need to document, track, and share your learning journey.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Ready to start your learning journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join our community of learners and start sharing your skills today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 5, py: 1.5, fontWeight: 700 }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Avatar, Typography, TextField, Button,
  CircularProgress, Tabs, Tab, Chip, Alert, Grid
} from '@mui/material';
import { Edit, CalendarToday, School, EmojiEvents } from '@mui/icons-material';
import { userAPI, postAPI, progressAPI, planAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import FollowButton from '../components/FollowButton';
import ProgressTimeline from '../components/ProgressTimeline';
import PlanCard from '../components/PlanCard';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwnProfile = user && userId && user.id === parseInt(userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          userAPI.getProfile(userId),
          postAPI.getFeed(0, 20),
        ]);
        setProfile(profileRes.data);
        const userPosts = (postsRes.data.content || []).filter(
          (p) => p.userId === parseInt(userId)
        );
        setPosts(userPosts);
        setEditBio(profileRes.data.bio || '');
        setEditUsername(profileRes.data.username || '');
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({
        username: editUsername,
        bio: editBio,
      });
      setProfile((prev) => ({ ...prev, ...res.data }));
      updateUser(res.data);
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 3, px: 2 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              src={profile.avatarUrl}
              sx={{ width: 100, height: 100 }}
            />
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                {isEditing ? (
                  <TextField
                    size="small"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    sx={{ maxWidth: 250 }}
                  />
                ) : (
                  <Typography variant="h5" fontWeight={700}>
                    {profile.username}
                  </Typography>
                )}
                {isOwnProfile && !isEditing && (
                  <Button
                    startIcon={<Edit />}
                    size="small"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
                {!isOwnProfile && (
                  <FollowButton
                    userId={profile.id}
                    initialFollowing={profile.following}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Joined {new Date(profile.joinDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Typography variant="body2">
                  <strong>{profile.followerCount}</strong> followers
                </Typography>
                <Typography variant="body2">
                  <strong>{profile.followingCount}</strong> following
                </Typography>
              </Box>

              {isEditing ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? <CircularProgress size={20} /> : 'Save'}
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {profile.bio || 'No bio yet'}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<School />} label="Posts" iconPosition="start" />
        <Tab icon={<EmojiEvents />} label="Progress" iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        posts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No posts yet
          </Typography>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )
      )}

      {tab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Learning Progress
            </Typography>
            <ProgressTimeline userId={parseInt(userId)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Learning Plans
            </Typography>
            <PlanList userId={parseInt(userId)} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

// Inline Plan List component
const PlanList = ({ userId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await planAPI.getUserPlans(userId);
        setPlans(res.data || []);
      } catch (err) {
        console.error('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [userId]);

  if (loading) return <CircularProgress size={24} />;

  return plans.length === 0 ? (
    <Typography color="text.secondary">No learning plans</Typography>
  ) : (
    plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
  );
};

export default ProfilePage;

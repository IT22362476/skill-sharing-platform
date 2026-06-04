import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Avatar, Typography, TextField, Button,
  CircularProgress, Tabs, Tab, Grid, Divider
} from '@mui/material';
import { Edit, CalendarToday, School, EmojiEvents, Check, Close } from '@mui/icons-material';
import { userAPI, postAPI, planAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import FollowButton from '../components/FollowButton';
import ProgressTimeline from '../components/ProgressTimeline';
import PlanCard from '../components/PlanCard';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
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
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
          userAPI.getProfile(userId),
          postAPI.getFeed(0, 50),
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
      const res = await userAPI.updateProfile({ username: editUsername, bio: editBio });
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography color="text.secondary">User not found</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Feed</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 3, px: 2 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexWrap: 'wrap' }}>
            <Avatar
              src={profile.avatarUrl}
              alt={profile.username}
              sx={{
                width: 96,
                height: 96,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
                border: '3px solid',
                borderColor: 'divider',
                flexShrink: 0,
              }}
            >
              {!profile.avatarUrl && profile.username?.slice(0, 2).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 200 }}>
              {/* Username row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                {isEditing ? (
                  <TextField
                    size="small"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    label="Username"
                    sx={{ maxWidth: 250 }}
                    autoFocus
                  />
                ) : (
                  <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                    {profile.username}
                  </Typography>
                )}

                {isOwnProfile ? (
                  !isEditing ? (
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      variant="outlined"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={saving ? <CircularProgress size={14} /> : <Check />}
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Close />}
                        onClick={() => { setIsEditing(false); setEditBio(profile.bio || ''); setEditUsername(profile.username); }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )
                ) : (
                  <FollowButton
                    userId={profile.id}
                    initialFollowing={profile.following}
                    onFollowChange={(newFollowing) => {
                      setProfile((prev) => ({
                        ...prev,
                        followerCount: newFollowing ? prev.followerCount + 1 : Math.max(0, prev.followerCount - 1),
                        following: newFollowing,
                      }));
                    }}
                  />
                )}
              </Box>

              {/* Join date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                <CalendarToday sx={{ fontSize: '0.85rem', color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </Typography>
              </Box>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={800}>{profile.followerCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Followers</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={800}>{profile.followingCount}</Typography>
                  <Typography variant="caption" color="text.secondary">Following</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={800}>{posts.length}</Typography>
                  <Typography variant="caption" color="text.secondary">Posts</Typography>
                </Box>
              </Box>

              {/* Bio */}
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${editBio.length}/500`}
                />
              ) : (
                <Typography
                  variant="body2"
                  color={profile.bio ? 'text.primary' : 'text.secondary'}
                  sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}
                >
                  {profile.bio || 'No bio yet'}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab icon={<School sx={{ fontSize: '1rem' }} />} label="Posts" iconPosition="start" />
          <Tab icon={<EmojiEvents sx={{ fontSize: '1rem' }} />} label="Learning" iconPosition="start" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          {posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No posts yet</Typography>
            </Box>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </Box>
      )}

      {tab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Learning Progress
            </Typography>
            <ProgressTimeline userId={parseInt(userId)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Learning Plans
            </Typography>
            <ProfilePlanList userId={parseInt(userId)} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

const ProfilePlanList = ({ userId }) => {
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
    <Typography color="text.secondary" variant="body2">No learning plans yet</Typography>
  ) : (
    plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
  );
};

export default ProfilePage;

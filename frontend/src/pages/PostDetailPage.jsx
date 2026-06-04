import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardHeader, CardContent, CardActions,
  Avatar, Typography, IconButton, Chip, CircularProgress, Alert, Button
} from '@mui/material';
import { Favorite, FavoriteBorder, ArrowBack, Delete } from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CommentSection from '../components/CommentSection';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postAPI.getPost(id);
        setPost(res.data);
        setLiked(res.data.likedByCurrentUser);
        setLikeCount(res.data.likeCount);
      } catch (err) {
        setError('Post not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => newLiked ? prev + 1 : Math.max(0, prev - 1));
    try {
      if (newLiked) {
        await postAPI.likePost(id);
      } else {
        await postAPI.unlikePost(id);
      }
    } catch (err) {
      setLiked(!newLiked);
      setLikeCount((prev) => newLiked ? Math.max(0, prev - 1) : prev + 1);
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return;
    try {
      await postAPI.deletePost(id);
      toast.success('Post deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 680, mx: 'auto', py: 4, px: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')}>Back to Feed</Button>
      </Box>
    );
  }

  const isOwner = user && post && user.id === post.userId;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
      >
        Back
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={
            <Avatar
              src={post.userAvatarUrl}
              alt={post.username}
              onClick={() => navigate(`/profile/${post.userId}`)}
              sx={{
                cursor: 'pointer', width: 44, height: 44, bgcolor: 'primary.light',
                fontWeight: 700, '&:hover': { opacity: 0.85 },
              }}
            >
              {!post.userAvatarUrl && post.username?.slice(0, 2).toUpperCase()}
            </Avatar>
          }
          action={
            isOwner && (
              <IconButton
                onClick={handleDelete}
                sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
              >
                <Delete />
              </IconButton>
            )
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="subtitle1" fontWeight={700}
                onClick={() => navigate(`/profile/${post.userId}`)}
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
              >
                {post.username}
              </Typography>
              {post.skillCategory && (
                <Chip label={post.skillCategory} size="small" color="primary" variant="outlined" />
              )}
            </Box>
          }
          subheader={
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          }
        />

        <CardContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {post.content}
          </Typography>
        </CardContent>

        {post.mediaList && post.mediaList.length > 0 && (
          <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {post.mediaList.map((media) => (
              <Box
                key={media.id}
                sx={{
                  width: media.type === 'VIDEO' ? '100%' : 'calc(50% - 6px)',
                  borderRadius: 2, overflow: 'hidden',
                }}
              >
                {media.type === 'VIDEO' ? (
                  <video
                    src={media.url} controls
                    style={{ width: '100%', borderRadius: 8, maxHeight: 400, display: 'block' }}
                  />
                ) : (
                  <img
                    src={media.url} alt="Post media"
                    style={{
                      width: '100%', maxHeight: 400, objectFit: 'contain',
                      borderRadius: 8, display: 'block', background: '#000',
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}

        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
          <IconButton
            onClick={handleLike}
            sx={{
              color: liked ? 'error.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': { transform: 'scale(1.15)', color: 'error.main' },
            }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </Typography>
        </CardActions>
      </Card>

      <CommentSection postId={parseInt(id)} postUserId={post.userId} />
    </Box>
  );
};

export default PostDetailPage;

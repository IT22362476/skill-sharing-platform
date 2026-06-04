import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardHeader, CardMedia, CardContent, CardActions,
  Avatar, Typography, IconButton, Chip, CircularProgress, Alert
} from '@mui/material';
import { Favorite, FavoriteBorder, ArrowBack, Delete } from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CommentSection from '../components/CommentSection';

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
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      if (liked) {
        await postAPI.unlikePost(id);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await postAPI.likePost(id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 680, mx: 'auto', py: 4, px: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Feed
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBack />
      </IconButton>

      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={post.userAvatarUrl}
              onClick={() => navigate(`/profile/${post.userId}`)}
              sx={{ cursor: 'pointer' }}
            />
          }
          action={
            post.isOwner && (
              <IconButton onClick={handleDelete}>
                <Delete />
              </IconButton>
            )
          }
          title={
            <Typography
              variant="subtitle1"
              fontWeight={600}
              onClick={() => navigate(`/profile/${post.userId}`)}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {post.username}
            </Typography>
          }
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
              {post.skillCategory && (
                <Chip label={post.skillCategory} size="small" variant="outlined" />
              )}
            </Box>
          }
        />

        <CardContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
        </CardContent>

        {post.mediaList && post.mediaList.length > 0 && (
          <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {post.mediaList.map((media) => (
              <Box key={media.id} sx={{ width: media.type === 'VIDEO' ? '100%' : '48%' }}>
                {media.type === 'VIDEO' ? (
                  <video
                    src={media.url}
                    controls
                    style={{ width: '100%', borderRadius: 8, maxHeight: 400 }}
                  />
                ) : (
                  <img
                    src={media.url}
                    alt="Post media"
                    style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}

        <CardActions>
          <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
            {liked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likeCount} likes
          </Typography>
        </CardActions>
      </Card>

      <Box sx={{ mt: 3 }}>
        <CommentSection postId={parseInt(id)} postUserId={post.userId} />
      </Box>
    </Box>
  );
};

export default PostDetailPage;

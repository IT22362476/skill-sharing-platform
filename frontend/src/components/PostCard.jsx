import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Avatar, Typography, IconButton, Box, Chip, Collapse
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Comment as CommentIcon, Delete
} from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PostCard = ({ post, onDelete, onLikeToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [deleting, setDeleting] = useState(false);
  const [expandedMedia, setExpandedMedia] = useState(false);

  const isOwner = user && user.id === post.userId;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (liked) {
        await postAPI.unlikePost(post.id);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        await postAPI.likePost(post.id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
      if (onLikeToggle) onLikeToggle(post.id, !liked);
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await postAPI.deletePost(post.id);
      toast.success('Post deleted');
      if (onDelete) onDelete(post.id);
    } catch (err) {
      toast.error('Failed to delete post');
      setDeleting(false);
    }
  };

  const hasMedia = post.mediaList && post.mediaList.length > 0;

  return (
    <Card
      sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.userAvatarUrl}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`); }}
            sx={{ cursor: 'pointer' }}
          />
        }
        action={
          isOwner && (
            <IconButton onClick={handleDelete} disabled={deleting} size="small">
              <Delete />
            </IconButton>
          )
        }
        title={
          <Typography
            variant="subtitle2"
            fontWeight={600}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`); }}
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

      <CardContent sx={{ py: 1 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      </CardContent>

      {hasMedia && (
        <>
          <Box sx={{ px: 2, pb: 1 }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); setExpandedMedia(!expandedMedia); }}
            >
              {expandedMedia ? 'Hide media' : `Show ${post.mediaList.length} media file(s)`}
            </Typography>
          </Box>
          <Collapse in={expandedMedia}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2, pb: 2 }}>
              {post.mediaList.map((media) => (
                <Box key={media.id} sx={{ width: media.type === 'VIDEO' ? '100%' : '30%' }}>
                  {media.type === 'VIDEO' ? (
                    <video
                      src={media.url}
                      controls
                      style={{ width: '100%', borderRadius: 8, maxHeight: 300 }}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="Post media"
                      style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </>
      )}

      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color={liked ? 'error' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {likeCount}
        </Typography>

        <IconButton onClick={(e) => { e.stopPropagation(); navigate(`/posts/${post.id}`); }}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.commentCount || 0}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PostCard;

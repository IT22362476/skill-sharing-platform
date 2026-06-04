import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardContent, CardActions,
  Avatar, Typography, IconButton, Box, Chip, Collapse, Tooltip
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Comment as CommentIcon, Delete,
  ExpandMore, ExpandLess
} from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const formatRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

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
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => newLiked ? prev + 1 : Math.max(0, prev - 1));
    try {
      if (newLiked) {
        await postAPI.likePost(post.id);
      } else {
        await postAPI.unlikePost(post.id);
      }
      if (onLikeToggle) onLikeToggle(post.id, newLiked);
    } catch (err) {
      setLiked(!newLiked);
      setLikeCount((prev) => newLiked ? Math.max(0, prev - 1) : prev + 1);
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
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        '&:hover': { boxShadow: 4, transform: 'translateY(-1px)' },
      }}
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <CardHeader
        avatar={
          <Avatar
            src={post.userAvatarUrl}
            alt={post.username}
            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`); }}
            sx={{
              cursor: 'pointer',
              width: 40,
              height: 40,
              bgcolor: 'primary.light',
              fontWeight: 700,
              transition: 'transform 0.15s ease',
              '&:hover': { transform: 'scale(1.08)' },
            }}
          >
            {!post.userAvatarUrl && post.username?.slice(0, 2).toUpperCase()}
          </Avatar>
        }
        action={
          isOwner && (
            <Tooltip title="Delete post">
              <IconButton
                onClick={handleDelete}
                disabled={deleting}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', bgcolor: 'error.light + 22' },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${post.userId}`); }}
              sx={{
                cursor: 'pointer',
                '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                transition: 'color 0.15s ease',
              }}
            >
              {post.username}
            </Typography>
            {post.skillCategory && (
              <Chip
                label={post.skillCategory}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(post.createdAt)}
          </Typography>
        }
        sx={{ pb: 0.5 }}
      />

      <CardContent sx={{ py: 1, pb: '8px !important' }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
          {post.content}
        </Typography>
      </CardContent>

      {hasMedia && (
        <>
          <Box
            sx={{ px: 2, pb: 1 }}
            onClick={(e) => { e.stopPropagation(); setExpandedMedia(!expandedMedia); }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'primary.main',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                py: 0.25,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {expandedMedia ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              {expandedMedia ? 'Hide media' : `View ${post.mediaList.length} media file${post.mediaList.length > 1 ? 's' : ''}`}
            </Box>
          </Box>
          <Collapse in={expandedMedia}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                px: 2,
                pb: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {post.mediaList.map((media) => (
                <Box
                  key={media.id}
                  sx={{
                    width: media.type === 'VIDEO' ? '100%' : 'calc(33.333% - 8px)',
                    minWidth: media.type === 'VIDEO' ? 'unset' : 80,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {media.type === 'VIDEO' ? (
                    <video
                      src={media.url}
                      controls
                      style={{ width: '100%', borderRadius: 8, maxHeight: 300, display: 'block' }}
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="Post media"
                      style={{
                        width: '100%',
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: 8,
                        display: 'block',
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </>
      )}

      <CardActions disableSpacing sx={{ pt: 0.5, pb: 1, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton
            onClick={handleLike}
            size="small"
            sx={{
              color: liked ? 'error.main' : 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': { transform: 'scale(1.15)', color: 'error.main' },
            }}
          >
            {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 18 }}>
            {likeCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 1 }}>
          <IconButton
            onClick={(e) => { e.stopPropagation(); navigate(`/posts/${post.id}`); }}
            size="small"
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.commentCount || 0}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

export default PostCard;

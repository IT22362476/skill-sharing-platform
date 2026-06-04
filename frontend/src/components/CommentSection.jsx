import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, ListItemAvatar,
  ListItemText, Avatar, IconButton, Divider, Fade, Paper
} from '@mui/material';
import { Delete, Edit, Send } from '@mui/icons-material';
import { commentAPI } from '../services/api';
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

const CommentSection = ({ postId, postUserId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await commentAPI.getComments(postId, 0, 50);
      setComments(res.data.content || []);
    } catch (err) {
      console.error('Failed to load comments');
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    setSubmitting(true);
    try {
      await commentAPI.addComment(postId, { content: newComment.trim() });
      setNewComment('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      await commentAPI.updateComment(commentId, { content: editContent.trim() });
      setEditingId(null);
      setEditContent('');
      toast.success('Comment updated');
      fetchComments();
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId, commentUserId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      if (user.id === commentUserId) {
        await commentAPI.deleteOwnComment(commentId);
      } else if (user.id === postUserId) {
        await commentAPI.deleteAsPostOwner(postId, commentId);
      }
      toast.success('Comment deleted');
      fetchComments();
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const canDelete = (commentUserId) => {
    if (!user) return false;
    return user.id === commentUserId || user.id === postUserId;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mb: 2.5 }}>
        Comments ({comments.length})
      </Typography>

      {user && (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 3,
            alignItems: 'flex-start',
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.username}
            sx={{ width: 36, height: 36, bgcolor: 'primary.light', fontSize: '0.8rem', fontWeight: 700, mt: 0.5 }}
          >
            {!user.avatarUrl && user.username?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'action.hover',
                  '& fieldset': { border: 'none' },
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                    boxShadow: '0 0 0 2px rgba(25,118,210,0.25)',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              sx={{ minWidth: 40, px: 2, height: 40, borderRadius: '10px', flexShrink: 0 }}
              endIcon={<Send sx={{ fontSize: '1rem !important' }} />}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}

      {comments.length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">
            No comments yet. Be the first to comment!
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {comments.map((comment, index) => (
            <Fade in key={comment.id} timeout={300}>
              <Box>
                <ListItem
                  alignItems="flex-start"
                  disableGutters
                  sx={{
                    px: 0,
                    py: 1.5,
                    gap: 1.5,
                    '&:hover .comment-actions': { opacity: 1 },
                  }}
                >
                  <Avatar
                    src={comment.userAvatarUrl}
                    alt={comment.username}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.light',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {!comment.userAvatarUrl && comment.username?.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {editingId === comment.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          size="small"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          multiline
                          rows={2}
                          autoFocus
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleEdit(comment.id)}
                            disabled={!editContent.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            onClick={() => { setEditingId(null); setEditContent(''); }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          bgcolor: 'action.hover',
                          borderRadius: '0 12px 12px 12px',
                          px: 2,
                          py: 1.25,
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={700}>
                            {comment.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(comment.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
                          {comment.content}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {user && editingId !== comment.id && (
                    <Box
                      className="comment-actions"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.25,
                        opacity: 0,
                        transition: 'opacity 0.15s ease',
                        flexShrink: 0,
                      }}
                    >
                      {comment.isOwner && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Edit sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      )}
                      {canDelete(comment.userId) && (
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(comment.id, comment.userId)}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <Delete sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </ListItem>
                {index < comments.length - 1 && <Divider />}
              </Box>
            </Fade>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CommentSection;

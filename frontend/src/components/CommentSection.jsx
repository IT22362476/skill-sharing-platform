import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, ListItemAvatar,
  ListItemText, Avatar, IconButton, Divider
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
      toast.success('Comment added');
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
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Comments ({comments.length})
      </Typography>

      {user && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            onClick={handleAddComment}
            disabled={!newComment.trim() || submitting}
            sx={{ minWidth: 80 }}
          >
            Post
          </Button>
        </Box>
      )}

      {comments.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <List>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar src={comment.userAvatarUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment.username}
                    </Typography>
                  }
                  secondary={
                    editingId === comment.id ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          multiline
                          rows={2}
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button size="small" variant="contained" onClick={() => handleEdit(comment.id)}>
                            Save
                          </Button>
                          <Button size="small" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </>
                    )
                  }
                />
                {user && (
                  <Box>
                    {comment.isOwner && editingId !== comment.id && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {canDelete(comment.userId) && editingId !== comment.id && (
                      <IconButton size="small" onClick={() => handleDelete(comment.id, comment.userId)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </ListItem>
              {index < comments.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CommentSection;

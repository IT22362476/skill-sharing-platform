import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Popover, Box, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Typography, IconButton, Divider, Button, CircularProgress
} from '@mui/material';
import { Delete, CheckCircle, Favorite, Comment, NotificationsNone } from '@mui/icons-material';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NotificationsDropdown = ({ open, anchorEl, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [notifRes, countRes] = await Promise.all([
        notificationAPI.getNotifications(0, 15),
        notificationAPI.getUnreadCount(),
      ]);
      setNotifications(notifRes.data.content || []);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const notif = notifications.find((n) => n.id === id);
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (notif && !notif.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const handleNotifClick = (notif) => {
    if (notif.postId) {
      navigate(`/posts/${notif.postId}`);
    }
    onClose();
  };

  const getMessage = (notif) => {
    const name = notif.triggeredByUsername || 'Someone';
    return notif.type === 'LIKE'
      ? `${name} liked your post`
      : `${name} commented on your post`;
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          width: 380,
          maxHeight: 500,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                bgcolor: 'error.main',
                color: '#fff',
                borderRadius: '10px',
                px: 0.75,
                py: 0.1,
                fontSize: '0.7rem',
                fontWeight: 700,
                minWidth: 20,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            sx={{
              fontSize: '0.75rem',
              color: 'primary.main',
              fontWeight: 600,
              p: 0,
              minWidth: 'auto',
              '&:hover': { background: 'none', textDecoration: 'underline' },
            }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, px: 2 }}>
            <NotificationsNone sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              No notifications yet
            </Typography>
            <Typography variant="caption" color="text.disabled" textAlign="center" mt={0.5}>
              You'll be notified when someone likes or comments on your posts
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  alignItems="flex-start"
                  onMouseEnter={() => setHoveredId(notif.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleNotifClick(notif)}
                  sx={{
                    px: 2,
                    py: 1.25,
                    cursor: notif.postId ? 'pointer' : 'default',
                    bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                    transition: 'background 0.15s ease',
                    '&:hover': { bgcolor: 'action.selected' },
                    position: 'relative',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      src={notif.triggeredByAvatarUrl}
                      sx={{ width: 36, height: 36 }}
                    >
                      {notif.type === 'LIKE'
                        ? <Favorite sx={{ fontSize: '1rem', color: '#f44336' }} />
                        : <Comment sx={{ fontSize: '1rem', color: '#1976d2' }} />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pr: hoveredId === notif.id ? 6 : 0 }}>
                        <Box>
                          <Typography component="span" variant="body2" sx={{ lineHeight: 1.5 }}>
                            {getMessage(notif)}
                          </Typography>
                          {!notif.isRead && (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                ml: 0.75,
                                verticalAlign: 'middle',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(notif.createdAt)}
                      </Typography>
                    }
                  />

                  {/* Hover actions */}
                  {hoveredId === notif.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        gap: 0.25,
                      }}
                    >
                      {!notif.isRead && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMarkAsRead(e, notif.id)}
                          title="Mark as read"
                          sx={{
                            width: 28,
                            height: 28,
                            color: 'success.main',
                            '&:hover': { bgcolor: 'success.light', color: '#fff' },
                          }}
                        >
                          <CheckCircle sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(e, notif.id)}
                        title="Delete"
                        sx={{
                          width: 28,
                          height: 28,
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'error.light', color: '#fff' },
                        }}
                      >
                        <Delete sx={{ fontSize: '0.9rem' }} />
                      </IconButton>
                    </Box>
                  )}
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider component="li" sx={{ mx: 2 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationsDropdown;

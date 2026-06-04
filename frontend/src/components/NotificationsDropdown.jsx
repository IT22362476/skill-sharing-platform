import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Popover, Box, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Typography, IconButton, Divider, Button, Badge
} from '@mui/material';
import { Delete, CheckCircle, Favorite, Comment } from '@mui/icons-material';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationsDropdown = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        notificationAPI.getNotifications(0, 10),
        notificationAPI.getUnreadCount(),
      ]);
      setNotifications(notifRes.data.content || []);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    return type === 'LIKE' ? <Favorite color="error" /> : <Comment color="primary" />;
  };

  const getMessage = (notif) => {
    const userStr = notif.triggeredByUsername || 'Someone';
    if (notif.type === 'LIKE') return `${userStr} liked your post`;
    return `${userStr} commented on your post`;
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 360, maxHeight: 480, borderRadius: 2 },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>Notifications</Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={handleMarkAllAsRead}>
            Mark all read
          </Button>
        )}
      </Box>
      <Divider />
      {notifications.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications yet</Typography>
        </Box>
      ) : (
        <List sx={{ py: 0 }}>
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notif.isRead ? 'transparent' : 'action.hover',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
                secondaryAction={
                  <Box>
                    {!notif.isRead && (
                      <IconButton size="small" onClick={() => handleMarkAsRead(notif.id)}>
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => handleDelete(notif.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                }
                onClick={() => {
                  if (notif.postId) navigate(`/posts/${notif.postId}`);
                  onClose();
                }}
              >
                <ListItemAvatar>
                  <Avatar src={notif.triggeredByAvatarUrl}>
                    {getIcon(notif.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={getMessage(notif)}
                  secondary={new Date(notif.createdAt).toLocaleDateString()}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Popover>
  );
};

export default NotificationsDropdown;

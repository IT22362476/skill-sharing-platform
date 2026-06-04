import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Badge,
  Menu, MenuItem, Avatar, Box, useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Brightness4, Brightness7,
  Home, Add, Logout
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, flexGrow: 0 }}
        >
          SkillShare
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, ml: 3 }}>
          <Button color="inherit" startIcon={<Home />} component={RouterLink} to="/">
            Feed
          </Button>
          {user && (
            <Button color="inherit" startIcon={<Add />} component={RouterLink} to="/create-post">
              New Post
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              <IconButton color="inherit" onClick={() => setNotificationOpen(!notificationOpen)}>
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <NotificationsDropdown
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
              />

              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar alt={user.username} src={user.avatarUrl} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate(`/profile/${user.id}`); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/my-learning'); }}>
                  My Learning
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

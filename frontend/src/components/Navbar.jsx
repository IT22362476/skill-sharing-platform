import React, { useState, useRef } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Badge,
  Menu, MenuItem, Avatar, Box, Divider, Tooltip, useScrollTrigger
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Brightness4, Brightness7,
  Home, Add, Search, Logout, Person, School,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkSx = (path) => ({
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: 2,
    px: 1.5,
    py: 0.75,
    color: 'inherit',
    opacity: isActive(path) ? 1 : 0.82,
    background: isActive(path) ? 'rgba(255,255,255,0.18)' : 'transparent',
    '&:hover': {
      background: 'rgba(255,255,255,0.12)',
      opacity: 1,
    },
    transition: 'all 0.18s ease',
    minWidth: 'unset',
  });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 3 : 0}
      sx={{
        bgcolor: mode === 'light' ? 'primary.main' : '#1a1a2e',
        borderBottom: scrolled ? 'none' : '1px solid rgba(255,255,255,0.08)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: { xs: 56, sm: 64 }, gap: 0.5 }}>
        {/* Brand */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.02em',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mr: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: '8px',
              bgcolor: 'rgba(255,255,255,0.22)',
              fontSize: '15px',
              fontWeight: 800,
            }}
          >
            S
          </Box>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
            SkillShare
          </Box>
        </Typography>

        {/* Nav links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 0.25 }}>
          <Button
            sx={navLinkSx('/')}
            startIcon={<Home sx={{ fontSize: '1rem !important' }} />}
            component={RouterLink}
            to="/"
          >
            Feed
          </Button>
          {user && (
            <Button
              sx={navLinkSx('/create-post')}
              startIcon={<Add sx={{ fontSize: '1rem !important' }} />}
              component={RouterLink}
              to="/create-post"
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>New Post</Box>
            </Button>
          )}
          <Button
            sx={navLinkSx('/search')}
            startIcon={<Search sx={{ fontSize: '1rem !important' }} />}
            component={RouterLink}
            to="/search"
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>Search</Box>
          </Button>
        </Box>

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.10)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                width: 36,
                height: 36,
              }}
            >
              {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  onClick={handleNotifOpen}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.10)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                    width: 36,
                    height: 36,
                  }}
                >
                  <Badge color="error" variant="dot" overlap="circular">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <NotificationsDropdown
                open={Boolean(notifAnchorEl)}
                anchorEl={notifAnchorEl}
                onClose={handleNotifClose}
              />

              <Box
                onClick={handleMenu}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  ml: 0.25,
                  cursor: 'pointer',
                  bgcolor: 'rgba(255,255,255,0.10)',
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  transition: 'background 0.18s ease',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                  userSelect: 'none',
                }}
              >
                <Avatar
                  alt={user.username}
                  src={user.avatarUrl}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                    bgcolor: 'secondary.main',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {!user.avatarUrl && getInitials(user.username)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    display: { xs: 'none', sm: 'block' },
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.username}
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    fontSize: '1rem',
                    color: 'inherit',
                    opacity: 0.75,
                    display: { xs: 'none', sm: 'block' },
                    transition: 'transform 0.2s ease',
                    transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => { handleClose(); navigate(`/profile/${user.id}`); }}
                  sx={{ mt: 0.5, mx: 0.5, borderRadius: 1.5 }}
                >
                  <Person fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => { handleClose(); navigate('/my-learning'); }}
                  sx={{ mx: 0.5, borderRadius: 1.5 }}
                >
                  <School fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                  My Learning
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ mx: 0.5, mb: 0.5, borderRadius: 1.5, color: 'error.main' }}
                >
                  <Logout fontSize="small" sx={{ mr: 1.5 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              component={RouterLink}
              to="/login"
              sx={{
                ml: 0.5,
                bgcolor: 'rgba(255,255,255,0.20)',
                color: 'inherit',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.28)', transform: 'translateY(-1px)' },
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

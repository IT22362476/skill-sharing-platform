import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, CircularProgress, Paper
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FollowButton from '../components/FollowButton';
import { toast } from 'react-toastify';

const UserSearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await userAPI.searchUsers(q.trim());
      setResults(res.data || []);
    } catch (err) {
      toast.error('Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Find People
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Search for users by username
      </Typography>

      <Paper sx={{ p: 1, mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search username..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          variant="standard"
          sx={{ ml: 1 }}
        />
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && searched && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Person sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term
          </Typography>
        </Box>
      )}

      <List>
        {results.map((u) => (
          <Paper key={u.id} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                user && user.id !== u.id && (
                  <FollowButton userId={u.id} initialFollowing={u.following} />
                )
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={u.avatarUrl}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${u.id}`)}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => navigate(`/profile/${u.id}`)}
                  >
                    {u.username}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" component="span">
                      {u.followerCount} followers
                    </Typography>
                    {u.bio && (
                      <Typography variant="body2" color="text.secondary" noWrap component="div">
                        {u.bio}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default UserSearchPage;

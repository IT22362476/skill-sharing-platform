import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, InputAdornment, Avatar,
  CircularProgress, Paper, Button, Divider
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
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
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

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(val);
    }, 300);
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
        Find People
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Discover skilled people to follow and learn from
      </Typography>

      {/* Search Input */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'box-shadow 0.2s ease',
          '&:focus-within': {
            boxShadow: '0 0 0 3px rgba(25,118,210,0.12)',
            borderColor: 'primary.main',
          },
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by username..."
          value={query}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color={query ? 'primary' : 'disabled'} />
              </InputAdornment>
            ),
            endAdornment: loading && (
              <InputAdornment position="end">
                <CircularProgress size={18} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Paper>

      {/* Empty/No results state */}
      {!loading && searched && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              mb: 2,
            }}
          >
            <Person sx={{ fontSize: 32, color: 'text.disabled' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Try a different search term
          </Typography>
        </Box>
      )}

      {/* Initial empty state */}
      {!searched && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              mb: 2,
            }}
          >
            <Search sx={{ fontSize: 32, color: 'text.disabled' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Start typing to search for users
          </Typography>
        </Box>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {results.map((u, index) => (
            <Box key={u.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2.5,
                  py: 2,
                  transition: 'background 0.15s ease',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Avatar
                  src={u.avatarUrl}
                  alt={u.username}
                  sx={{
                    width: 48,
                    height: 48,
                    cursor: 'pointer',
                    bgcolor: 'primary.light',
                    fontWeight: 700,
                    '&:hover': { opacity: 0.85 },
                  }}
                  onClick={() => navigate(`/profile/${u.id}`)}
                >
                  {!u.avatarUrl && u.username?.slice(0, 2).toUpperCase()}
                </Avatar>

                <Box
                  sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${u.id}`)}
                >
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {u.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {u.followerCount} follower{u.followerCount !== 1 ? 's' : ''}
                  </Typography>
                  {u.bio && (
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                      {u.bio}
                    </Typography>
                  )}
                </Box>

                {user && user.id !== u.id && (
                  <FollowButton
                    userId={u.id}
                    initialFollowing={u.following}
                  />
                )}
              </Box>
              {index < results.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default UserSearchPage;

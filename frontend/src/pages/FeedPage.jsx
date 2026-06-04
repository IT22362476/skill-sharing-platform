import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, CircularProgress, Button, Tabs, Tab } from '@mui/material';
import { DynamicFeed, Add, Explore, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observer = useRef();



  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Tab 0 = Following feed (personalized), Tab 1 = Discover feed (public)
        const endpoint = tab === 1 || !user
          ? postAPI.getDiscoverFeed(page, 10)
          : postAPI.getFeed(page, 10);
        const res = await endpoint;
        const newPosts = res.data.content || [];
        setPosts((prev) => (page === 0 ? newPosts : [...prev, ...newPosts]));
        setHasMore(!res.data.last);
      } catch (err) {
        console.error('Failed to fetch feed');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };
    fetchPosts();
  }, [page, tab, user]);

  const handleTabChange = (_, newTab) => {
    setTab(newTab);
    setPage(0);
    setPosts([]);
    setHasMore(true);
    setInitialLoading(true);
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const showTabs = !!user;

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
            {!user ? 'Discover' : (tab === 0 ? 'Your Feed' : 'Discover')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {!user
              ? 'Explore what people are learning and sharing'
              : tab === 0
                ? 'Posts from people you follow'
                : 'Browse all public posts'}
          </Typography>
        </Box>
        {user && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create-post')}
            size="small"
            sx={{ flexShrink: 0 }}
          >
            Post
          </Button>
        )}
      </Box>

      {/* Tabs: Following | Discover (only for logged-in users) */}
      {showTabs && (
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<People fontSize="small" />} label="Following" iconPosition="start" sx={{ minHeight: 48 }} />
          <Tab icon={<Explore fontSize="small" />} label="Discover" iconPosition="start" sx={{ minHeight: 48 }} />
        </Tabs>
      )}

      {/* Empty state */}

      {/* Case 1: Following tab with no posts (new user, no follows) */}
      {posts.length === 0 && tab === 0 && user && (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              mb: 2.5,
            }}
          >
            <People sx={{ fontSize: 36, color: 'text.disabled' }} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            Your feed is empty
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3} sx={{ maxWidth: 400, mx: 'auto' }}>
            Follow other users to see their posts here, or check out the Discover tab to explore what the community is sharing!
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Explore />}
              onClick={() => handleTabChange(null, 1)}
            >
              Browse Discover
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate('/create-post')}
            >
              Create a post
            </Button>
          </Box>
        </Box>
      )}

      {/* Case 2: Discover tab or public feed with no posts at all */}
      {posts.length === 0 && (tab === 1 || !user) && (
        <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              mb: 2.5,
            }}
          >
            <DynamicFeed sx={{ fontSize: 36, color: 'text.disabled' }} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Be the first to share your skills with the community!
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-post')}
            >
              Create the first post
            </Button>
          )}
        </Box>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <PostCard post={post} onDelete={handleDelete} />
                </div>
              );
            }
            return <PostCard key={post.id} post={post} onDelete={handleDelete} />;
          })}
        </>
      )}

      {loading && posts.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!hasMore && posts.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.disabled">
            You've reached the end
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FeedPage;

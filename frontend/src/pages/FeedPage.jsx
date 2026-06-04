import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { DynamicFeed, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        const res = await postAPI.getFeed(page, 10);
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
  }, [page]);

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

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
            {user ? 'Your Feed' : 'Public Feed'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {user
              ? 'Posts from people you follow and the community'
              : 'Discover what people are learning and sharing'}
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

      {/* Posts */}
      {posts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            px: 3,
          }}
        >
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
            {user
              ? 'Follow other users to see their posts here, or be the first to share!'
              : 'Be the first to share your skills with the community!'}
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-post')}
            >
              Create your first post
            </Button>
          )}
        </Box>
      ) : (
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
            You've reached the end of the feed
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FeedPage;

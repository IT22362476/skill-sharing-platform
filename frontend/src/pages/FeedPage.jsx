import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import PostCard from '../components/PostCard';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeedPage = () => {
  const { user } = useAuth();
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {user ? 'Your Feed' : 'Public Feed'}
      </Typography>
      {user && (
        <Typography variant="body2" color="text.secondary" mb={3}>
          Showing posts from users you follow and public posts
        </Typography>
      )}

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Follow users to see their posts here!
          </Typography>
        </Box>
      ) : (
        posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostRef} key={post.id}>
                <PostCard post={post} onDelete={handleDelete} />
              </div>
            );
          }
          return <PostCard key={post.id} post={post} onDelete={handleDelete} />;
        })
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default FeedPage;

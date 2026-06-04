import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Chip, CircularProgress, Alert, Paper, IconButton
} from '@mui/material';
import { CloudUpload, Delete, Image, VideoFile } from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();

  if (!user) {
    navigate('/login');
    return null;
  }

  const processFiles = useCallback((selected) => {
    const validFiles = [];
    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error(`${file.name} is not a supported format`);
        continue;
      }
      validFiles.push(file);
    }

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    }));

    setFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  }, [files]);

  const handleFileSelect = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [processFiles]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removeFile = (index) => {
    URL.revokeObjectURL(filePreviews[index].url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please add some content to your post');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (skillCategory.trim()) formData.append('skillCategory', skillCategory.trim());
      files.forEach((file) => formData.append('files', file));
      await postAPI.createPost(formData);
      toast.success('Post shared!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
        Create a Post
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Share a skill, tutorial, or learning experience with the community
      </Typography>

      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What skill are you sharing?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe what you've learned, built, or discovered..."
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 2000 }}
              helperText={`${content.length}/2000`}
            />

            <TextField
              fullWidth
              label="Skill Category (optional)"
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              placeholder="e.g., Web Development, Data Science, Design"
              sx={{ mb: 2.5 }}
            />

            {/* File Upload Zone */}
            <Paper
              variant="outlined"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                p: 3,
                mb: 2,
                textAlign: 'center',
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: dragActive ? 'primary.main' : 'divider',
                cursor: files.length >= MAX_FILES ? 'not-allowed' : 'pointer',
                bgcolor: dragActive ? 'action.selected' : 'action.hover',
                transition: 'all 0.2s ease',
                borderRadius: '12px',
                '&:hover': {
                  borderColor: files.length < MAX_FILES ? 'primary.light' : 'divider',
                  bgcolor: files.length < MAX_FILES ? 'action.selected' : 'action.hover',
                },
              }}
              onClick={() => files.length < MAX_FILES && fileInputRef.current?.click()}
            >
              <CloudUpload
                sx={{
                  fontSize: 40,
                  color: dragActive ? 'primary.main' : 'text.disabled',
                  mb: 1.5,
                  transition: 'color 0.2s ease',
                }}
              />
              <Typography variant="body2" fontWeight={600} color={dragActive ? 'primary.main' : 'text.secondary'}>
                {dragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
              </Typography>
              <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
                Max {MAX_FILES} files, 10MB each &bull; JPEG, PNG, MP4
              </Typography>
              <Typography variant="caption" color={files.length >= MAX_FILES ? 'error.main' : 'text.disabled'} display="block" mt={0.25}>
                {files.length}/{MAX_FILES} files added
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                accept="image/jpeg,image/png,video/mp4"
                onChange={handleFileSelect}
              />
            </Paper>

            {/* File Previews */}
            {filePreviews.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
                {filePreviews.map((preview, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 120,
                      height: 120,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      flexShrink: 0,
                    }}
                  >
                    {preview.type === 'video' ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: '#111',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        <VideoFile sx={{ color: '#fff', fontSize: 28 }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', px: 0.5, textAlign: 'center' }} noWrap>
                          {preview.name}
                        </Typography>
                      </Box>
                    ) : (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    {/* Number badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                    {/* Remove button */}
                    <IconButton
                      size="small"
                      onClick={() => removeFile(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        width: 24,
                        height: 24,
                        '&:hover': { bgcolor: 'error.main' },
                      }}
                    >
                      <Delete sx={{ fontSize: '0.85rem' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting || !content.trim()}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                  boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                },
              }}
            >
              {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Share Post'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePostPage;

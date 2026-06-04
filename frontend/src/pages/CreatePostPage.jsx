import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Chip, CircularProgress, Alert, Paper
} from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
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
    }));

    setFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please add some content');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (skillCategory.trim()) {
        formData.append('skillCategory', skillCategory.trim());
      }
      files.forEach((file) => formData.append('files', file));

      await postAPI.createPost(formData);
      toast.success('Post created!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 3, px: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Create a Post
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Share a skill, tutorial, or learning experience
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="What skill are you sharing?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe what you've learned or created..."
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Skill Category (optional)"
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              placeholder="e.g., Web Development, Data Science, Design"
              sx={{ mb: 3 }}
            />

            {/* File Upload */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 2,
                textAlign: 'center',
                borderStyle: 'dashed',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Drag & drop or click to upload (max 3 files, 10MB each)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPEG, PNG, MP4 supported
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {filePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative', width: 120, height: 120 }}>
                    {preview.type === 'video' ? (
                      <video
                        src={preview.url}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                      />
                    )}
                    <Chip
                      label={`${index + 1}`}
                      size="small"
                      color="primary"
                      sx={{ position: 'absolute', top: 4, left: 4 }}
                    />
                    <Button
                      size="small"
                      color="error"
                      sx={{ position: 'absolute', top: 4, right: 4, minWidth: 24, p: 0 }}
                      onClick={() => removeFile(index)}
                    >
                      <Delete fontSize="small" />
                    </Button>
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
            >
              {submitting ? <CircularProgress size={24} /> : 'Share Post'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePostPage;

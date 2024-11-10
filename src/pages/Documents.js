import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import UploadProgress from '../components/UploadProgress';
import DocumentPreview from '../components/DocumentPreview';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await api.post('/documents/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        }
      });
      setOpen(false);
      loadDocuments();
    } catch (error) {
      setError('Upload failed');
    } finally {
      setUploadProgress(0);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Upload />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Upload Document
      </Button>

      <Grid container spacing={2}>
        {documents.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card 
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedDocument(doc);
                setPreviewOpen(true);
              }}
            >
              <CardContent>
                <Typography variant="h6">{doc.title}</Typography>
                <Typography color="textSecondary">
                  {doc.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: 20 }}
          />
          {uploadProgress > 0 && <UploadProgress progress={uploadProgress} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>

      <ErrorAlert 
        open={!!error}
        message={error}
        onClose={() => setError(null)}
      />

      <DocumentPreview
        document={selectedDocument}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedDocument(null);
        }}
      />
    </>
  );
}
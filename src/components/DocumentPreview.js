import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function DocumentPreview({ document, open, onClose }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {document?.title}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <iframe
          src={`${process.env.REACT_APP_API_URL}/documents/${document?.id}/preview`}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
}

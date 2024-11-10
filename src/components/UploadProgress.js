import { Box, LinearProgress, Typography } from '@mui/material';

export default function UploadProgress({ progress }) {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" color="text.secondary" align="center">
        {Math.round(progress)}%
      </Typography>
    </Box>
  );
}

import { Backdrop, CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

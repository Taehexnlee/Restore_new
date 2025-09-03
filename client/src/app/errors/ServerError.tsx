import { Container, Paper, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';

type ProblemDetails = {
  title?: string;
  detail?: string;
  status?: number;
};

export default function ServerError() {
  const { state } = useLocation() as { state?: { error?: ProblemDetails } };
  const error = state?.error;

  return (
    <Container component={Paper} sx={{ p: 4, mt: 10 }}>
      {error ? (
        <>
          <Typography variant="h3" gutterBottom color="secondary" sx={{ px: 4, pt: 2 }}>
            {error.title ?? 'Server error'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ p: 4, whiteSpace: 'pre-wrap' }}>
            {error.detail ?? 'An unexpected error occurred.'}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" gutterBottom>
          Server error
        </Typography>
      )}
    </Container>
  );
}
// src/features/about/AboutPage.tsx
import { Container, Typography, ButtonGroup, Button } from '@mui/material';
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery,
} from './errorApi';

export default function AboutPage() {
  const [get400] = useLazyGet400ErrorQuery();
  const [get401] = useLazyGet401ErrorQuery();
  const [get404] = useLazyGet404ErrorQuery();
  const [get500] = useLazyGet500ErrorQuery();
  const [getVal] = useLazyGetValidationErrorQuery();  // ✅

  const getValidationError = async () => {
    try {
      await getVal().unwrap();                        // Updated name and usage pattern
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Errors for testing
      </Typography>

      <ButtonGroup fullWidth sx={{ gap: 2 }}>
        <Button variant="contained" onClick={() => get400().unwrap().catch(console.log)}>
          Test 400 error
        </Button>
        <Button variant="contained" onClick={() => get401().unwrap().catch(console.log)}>
          Test 401 error
        </Button>
        <Button variant="contained" onClick={() => get404().unwrap().catch(console.log)}>
          Test 404 error
        </Button>
        <Button variant="contained" onClick={() => get500().unwrap().catch(console.log)}>
          Test 500 error
        </Button>
        <Button variant="contained" onClick={getValidationError}>
          Test validation error
        </Button>
      </ButtonGroup>
    </Container>
  );
}

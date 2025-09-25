// src/features/accounts/RegisterForm.tsx
import {
    Box, Button, Container, Paper, TextField, Typography,
  } from '@mui/material';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
  import { Link, useNavigate } from 'react-router-dom';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import {
    registerSchema,
    type RegisterSchema,
  } from '../../lib/schemas/registerSchema';
  import { useRegisterMutation } from './accountsApi';
  import { toast } from 'react-toastify';
  
  export default function RegisterForm() {
    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
    } = useForm<RegisterSchema>({
      resolver: zodResolver(registerSchema),
      mode: 'onTouched',
    });
  
    const [registerUser] = useRegisterMutation();
  
    const onSubmit = async (data: RegisterSchema) => {
        await registerUser(data).unwrap();
  
        // Provide feedback after a successful registration
        toast.success('Registration successful! You can now sign in.');
        navigate('/login');
      
    };
  
    return (
      <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={8} p={4}>
          <LockOutlinedIcon sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
          <Typography variant="h5" sx={{ mt: 1 }}>
            Register
          </Typography>
  
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, my: 3 }}
          >
            <TextField
              fullWidth
              label="Email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
  
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
  
            <Button type="submit" variant="contained" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
  
            <Typography textAlign="center">
              Already have an account?
              <Typography
                component={Link}
                to="/login"
                color="primary"
                sx={{ ml: 2, display: 'inline' }}
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

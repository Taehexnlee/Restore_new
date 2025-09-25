// src/features/accounts/LoginForm.tsx
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useLoginMutation, useLazyUserInfoQuery } from "./accountsApi";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  // Location provided by RequireAuth for post-login redirect (falls back to catalog)
  const from =
    (location.state as { from?: Location } | null)?.from?.pathname ?? "/catalog";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const [login, { isLoading }] = useLoginMutation();
  const [fetchUserInfo] = useLazyUserInfoQuery(); // Force a refresh right after login

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap();       // Sets authentication cookie
      await fetchUserInfo().unwrap();   // Immediately refresh user info to avoid timing issues
      navigate(from, { replace: true }); // Redirect to intended destination or /catalog
    } catch (err) {
      // Surface a toast or error message if desired
      console.error(err);
    }
  };

  return (
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8} p={4}>
        <LockOutlinedIcon sx={{ mt: 3, color: "secondary.main", fontSize: 40 }} />
        <Typography variant="h5" sx={{ mt: 1 }}>
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3, my: 3 }}
        >
          <TextField
            fullWidth
            label="Email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Typography textAlign="center">
            Don’t have an account?
            <Typography
              component={Link}
              to="/register"
              color="primary"
              sx={{ ml: 2, display: "inline" }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

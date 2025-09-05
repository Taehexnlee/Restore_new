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
  // RequireAuth에서 보낸 돌아갈 위치(없으면 null)
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
  const [fetchUserInfo] = useLazyUserInfoQuery(); // 로그인 직후 강제 갱신

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data).unwrap();       // 쿠키 설정
      await fetchUserInfo().unwrap();   // ✅ 타이밍 이슈 방지: userInfo를 즉시 갱신
      navigate(from, { replace: true }); // ✅ 원래 가려던 곳 또는 /catalog
    } catch (err) {
      // 필요 시 토스트/에러 표시
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
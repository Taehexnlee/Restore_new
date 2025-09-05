// src/app/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountsApi";

export default function RequireAuth() {
  const { data: user, isLoading } = useUserInfoQuery();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} // 로그인 후 돌아올 경로 기억
        replace
      />
    );
  }

  return <Outlet />; // 인증된 사용자만 children 라우트 접근 허용
}
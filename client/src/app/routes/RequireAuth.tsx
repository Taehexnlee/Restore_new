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
        state={{ from: location }} // Preserve intended route for redirect after login
        replace
      />
    );
  }

  return <Outlet />; // Only authenticated users may access nested routes
}

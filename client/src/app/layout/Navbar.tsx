// src/app/layout/Navbar.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  IconButton,
  Badge,
  Box,
  LinearProgress,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../basket/basketApi";

// ⬇️ 추가: 계정 API 훅 + UserMenu
import UserMenu from "./UserMenu";
import { useUserInfoQuery, useLogoutMutation } from "../../features/account/accountsApi";

type LinkItem = { title: string; path: string };

const midLinks: LinkItem[] = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks: LinkItem[] = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "#baecf9" },
} as const;

export default function Navbar() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const isLoading = useAppSelector((s) => s.ui.isLoading);

  // 장바구니
  const { data: basket } = useFetchBasketQuery();
  const itemCount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // ⬇️ 추가: 로그인 유지용 사용자 정보 & 로그아웃 훅
  const { data: user } = useUserInfoQuery(); // (204면 undefined로 옴)
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // 필요하면 여기서 리다이렉트/토스트 처리
    } catch {
      // 무시 또는 에러 처리
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* 좌측: 로고 + 테마 토글 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ ...navStyles, "&.active": { color: "inherit" } }}
          >
            RE-STORE
          </Typography>

          <IconButton
            size="large"
            sx={{ color: "inherit" }}
            onClick={() => dispatch(toggleDarkMode())}
            aria-label="toggle theme"
          >
            {darkMode ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon sx={{ color: "yellow" }} />
            )}
          </IconButton>
        </Box>

        {/* 중앙: 네비 링크 */}
        <List sx={{ display: "flex", gap: 2, alignItems: "center", m: 0, p: 0 }}>
          {midLinks.map(({ title, path }) => (
            <ListItem key={path} component={NavLink} to={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        {/* 우측: 장바구니 + (로그인 여부에 따라) UserMenu / 로그인·회원가입 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            sx={{ color: "inherit" }}
            aria-label="open cart"
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <List sx={{ display: "flex", gap: 1.5, alignItems: "center", m: 0, p: 0 }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem key={path} component={NavLink} to={path} sx={navStyles}>
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>

      {/* 전역 로딩바 */}
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  );
}
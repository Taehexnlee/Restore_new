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
} from "@mui/material";
import { NavLink } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type LinkItem = { title: string; path: string };

type Props = {
  darkMode?: boolean;
  onToggleTheme?: () => void;
};

// 가운데(메인) 링크들
const midLinks: LinkItem[] = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

// 우측 링크들(임시)
const rightLinks: LinkItem[] = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

// 공통 네비 스타일: 기본/hover/active
const navStyles = {
  color: "inherit",
  textDecoration: "none",
  typography: "h6",
  "&:hover": { color: "grey.500" },
  // NavLink가 붙여주는 활성 클래스는 ".active" (콜론 아님!)
  "&.active": { color: "#baecf9" },
} as const;

export default function Navbar({ darkMode, onToggleTheme }: Props) {
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
        {/* 좌측: 로고 + (옵션) 테마 토글 아이콘 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{ ...navStyles, "&.active": { color: "inherit" } }}
          >
            RE-STORE
          </Typography>

          {onToggleTheme && (
            <IconButton
              size="large"
              sx={{ color: "inherit" }}
              onClick={onToggleTheme}
              aria-label="toggle theme"
            >
              {darkMode ? <DarkModeIcon /> : <LightModeIcon sx={{ color: "yellow" }} />}
            </IconButton>
          )}
        </Box>

        {/* 중앙: 카탈로그/어바웃/컨택트 */}
        <List sx={{ display: "flex", gap: 2, alignItems: "center", m: 0, p: 0 }}>
          {midLinks.map(({ title, path }) => (
            <ListItem key={path} component={NavLink} to={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        {/* 우측: 장바구니 + 로그인/회원가입 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton size="large" sx={{ color: "inherit" }}>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <List sx={{ display: "flex", gap: 1.5, alignItems: "center", m: 0, p: 0 }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem key={path} component={NavLink} to={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
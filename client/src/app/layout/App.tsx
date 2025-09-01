import { useEffect, useMemo, useState } from "react";
import type { Product } from "../models/product";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Navbar from "./Navbar";
import Catalog from "../../features/catalog/Catalogs";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  // 다크모드 상태 + 로컬스토리지 동기화
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("colorMode");
    return saved ? saved === "dark" : true; // 기본 다크
  });

  const toggleColorMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("colorMode", next ? "dark" : "light");
      return next;
    });
  };

  // MUI 테마
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#121212" : "#eaeaea",
          },
        },
      }),
    [darkMode]
  );

  // 상품 로드
  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  // 배경 그라디언트(강의 스타일)
  const gradient = darkMode
    ? "radial-gradient(circle, #1E3ABA, #111B27)"
    : "radial-gradient(circle, #AECFF9, #F0F9FF)";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} onToggleTheme={toggleColorMode} />

      <Box
        sx={{
          bgcolor: "background.default",
          backgroundImage: gradient,
          minHeight: "100vh",
          py: 6,          // 상하 패딩
          mt: 14,         // 고정 AppBar 높이만큼 아래로 내리기 (대략)
        }}
      >
        <Container maxWidth="xl">
          <Catalog products={products} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
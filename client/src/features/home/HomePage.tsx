import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  return (
    <Box
      sx={{
        maxWidth: "xl",
        mx: "auto",                // Center horizontally
        px: 4,                     // Apply horizontal padding
        position: "relative",      // Provide positioning context for overlay elements
        mt: { xs: 4, md: 8 },
        height: { xs: 420, sm: 520, md: 640 },
      }}
    >
      {/* Background image */}
      <Box
        component="img"
        src="/images/hero1.jpg"
        alt="Ski resort image"
        sx={{
          position: "absolute",
          inset: 0,                // top/right/bottom/left: 0
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "16px",
          zIndex: 0,
        }}
      />

      {/* Overlay content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 8,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          color="white"
          fontWeight="bold"
          sx={{
            fontSize: { xs: 36, sm: 48, md: 64 },
            textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            mb: 3,
          }}
        >
          Welcome to Restore!
        </Typography>

        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/catalog"
          sx={{
            mt: 4,
            backgroundImage: "linear-gradient(to right, #2563EB, #06B6D4)",
            fontWeight: "bold",
            color: "white",
            borderRadius: "16px",
            px: 6,
            py: 1.5,
            border: "2px solid transparent",
            boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            "&:hover": {
              filter: "brightness(1.05)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
            },
          }}
        >
          Go to shop
        </Button>
      </Box>
    </Box>
  );
}

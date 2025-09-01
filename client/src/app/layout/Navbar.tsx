import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

type Props = {
  darkMode: boolean;
  onToggleTheme: () => void;
};

export default function Navbar({ darkMode, onToggleTheme }: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">RE-STORE</Typography>

        <IconButton
          color="inherit"
          onClick={onToggleTheme}
          aria-label="toggle color mode"
        >
          {darkMode ? (
            <DarkMode />
          ) : (
            <LightMode sx={{ color: "yellow" }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
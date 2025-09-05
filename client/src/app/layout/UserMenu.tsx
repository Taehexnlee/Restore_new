// src/app/layout/UserMenu.tsx
import { useState } from "react";
import {
  Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import type { User } from "../models/user";

type Props = {
  user: User;
  onLogout: () => void;
};

export default function UserMenu({ user, onLogout }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit" size="large" sx={{ fontSize: '1.1rem' }}>
        <AccountCircleIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} transitionDuration={160}>
        <MenuItem disabled>
          <ListItemText primary={user.email} />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleClose}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="My Orders" />
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            onLogout();
          }}
        >
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </>
  );
}
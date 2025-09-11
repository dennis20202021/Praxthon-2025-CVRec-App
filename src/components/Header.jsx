import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DiamondIcon from "@mui/icons-material/Diamond";

function Header({ onLogin, onRegister }) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "primary.dark" }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <DiamondIcon sx={{ mr: 1, color: "gold" }} />
          <Typography variant="h6" component="div" sx={{ color: "gold", fontFamily: "Playfair Display, serif" }}>
            CV App
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem onClick={handleMobileMenuClose}>Home</MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>Jobs</MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>Candidates</MenuItem>
              <MenuItem onClick={handleMobileMenuClose}>About</MenuItem>
              <MenuItem onClick={onLogin}>Login</MenuItem>
              <MenuItem onClick={onRegister}>Register</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", mx: 2 }}>
              <Button color="inherit" sx={{ mx: 1 }}>
                Home
              </Button>
              <Button color="inherit" sx={{ mx: 1 }}>
                Jobs
              </Button>
              <Button color="inherit" sx={{ mx: 1 }}>
                Candidates
              </Button>
              <Button color="inherit" sx={{ mx: 1 }}>
                About
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                sx={{ borderColor: "gold", color: "gold", mx: 1 }}
                onClick={onLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "error.main", mx: 1 }}
                onClick={onRegister}
              >
                Register
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
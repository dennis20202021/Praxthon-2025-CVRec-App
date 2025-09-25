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
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import {
  Logout as LogoutIcon,
} from "@mui/icons-material";

function Header({ onLogin, onRegister, user, onLogout }) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "primary.dark" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate(user ? "/dashboard" : "/")}
        >
          <DiamondIcon sx={{ mr: 1, color: "gold" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ color: "gold", fontFamily: "Playfair Display, serif" }}
          >
            CV App
          </Typography>
        </Box>

        {user ? (
          // User is logged in
          isMobile ? (
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
                {user.role === "candidate" ? (
                  <>
                    <MenuItem onClick={() => handleNavigation("/dashboard")}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation("/jobs")}>
                      Jobs
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation("/upload-cv")}>
                      Upload CV
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation("/profile")}>
                      My Profile
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavigation("/dashboard")}>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation("/post-job")}>
                      Post Job
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation("/candidates")}>
                      Candidates
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user.role === "candidate" ? (
                <>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/jobs")}
                  >
                    Jobs
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/profile")}
                  >
                    My Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/post-job")}
                  >
                    Post Job
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/candidates")}
                  >
                    Candidates
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={() => navigate("/jobs")}
                  >
                    Manage Jobs
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                sx={{ borderColor: "gold", color: "gold", mx: 1 }}
                onClick={onLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          )
        ) : // User is not logged in
        isMobile ? (
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
              <MenuItem onClick={() => handleNavigation("/")}>Home</MenuItem>
              <MenuItem onClick={() => handleNavigation("/jobs")}>
                Browse Jobs
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/candidates")}>
                Search Candidates
              </MenuItem>
              <MenuItem onClick={onLogin}>Login</MenuItem>
              <MenuItem onClick={onRegister}>Register</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              sx={{ mx: 1 }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1 }}
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </Button>
            <Button
              color="inherit"
              sx={{ mx: 1 }}
              onClick={() => navigate("/candidates")}
            >
              Search Candidates
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: "gold", color: "gold", mx: 1 }}
              startIcon={<LoginIcon />}
              onClick={onLogin}
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "error.main", mx: 1 }}
              onClick={onRegister}
              startIcon={<PersonAddIcon />}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;

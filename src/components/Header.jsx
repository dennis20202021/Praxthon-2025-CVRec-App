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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DiamondIcon from "@mui/icons-material/Diamond";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";

function Header({ onLogin, onRegister, user, onLogout }) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState("candidates");
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

  const handleCandidatesClick = () => {
    if (user && user.role === "recruiter") {
      navigate("/candidates");
    } else {
      setDialogType("candidates");
      setAuthDialogOpen(true);
    }
  };

  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
  };

  const handleLoginFromDialog = () => {
    setAuthDialogOpen(false);
    navigate("/login");
  };

  const handleRegisterFromDialog = () => {
    setAuthDialogOpen(false);
    navigate("/register");
  };

  const getDialogContent = () => {
    switch (dialogType) {
      case "candidates":
        return {
          title: "Access Candidates Section",
          description:
            "You need to be registered and logged in as a recruiter to access the candidates section.",
          action: "recruiter account",
        };
      default:
        return {
          title: "Authentication Required",
          description:
            "You need to be registered and logged in to access this feature.",
          action: "account",
        };
    }
  };

  const { title, description, action } = getDialogContent();

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "primary.dark" }}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
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
                        Profile
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
                      <MenuItem onClick={() => handleNavigation("/jobs")}>
                        Manage Jobs
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
                      onClick={() => navigate("/upload-cv")}
                    >
                      Upload CV
                    </Button>
                    <Button
                      color="inherit"
                      sx={{ mx: 1 }}
                      onClick={() => navigate("/profile")}
                    >
                      Profile
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
                  Jobs
                </MenuItem>
                <MenuItem onClick={handleCandidatesClick}>Candidates</MenuItem>
                <MenuItem onClick={() => handleNavigation("/about")}>
                  About Us
                </MenuItem>
                <MenuItem onClick={onLogin}>Login</MenuItem>
                <MenuItem onClick={onRegister}>Register</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", mx: 2 }}>
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
                  Jobs
                </Button>
                <Button
                  color="inherit"
                  sx={{ mx: 1 }}
                  onClick={handleCandidatesClick}
                >
                  Candidates
                </Button>
                <Button
                  color="inherit"
                  sx={{ mx: 1 }}
                  onClick={() => navigate("/about")}
                >
                  About Us
                </Button>
              </Box>
              <Box>
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
                >
                  Register
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Auth Dialog */}
      <Dialog
        open={authDialogOpen}
        onClose={handleAuthDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4" component="div">
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please login or register for a {action} to continue.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleLoginFromDialog}
              startIcon={<LoginIcon />}
              size="large"
              sx={{
                color: "#4CC9F0",
                borderColor: "rgba(76, 201, 240, 0.5)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(26, 26, 46, 0.7)",
                minWidth: "140px",
                "&:hover": {
                  backgroundColor: "rgba(76, 201, 240, 0.1)",
                  borderColor: "#4CC9F0",
                  color: "#4CC9F0",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(76, 201, 240, 0.15)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Button>
            <Button
            variant="contained"
            onClick={handleRegisterFromDialog}
            startIcon={<PersonAddIcon />}
            size="large"
            color="primary"
          >
            Register
          </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;

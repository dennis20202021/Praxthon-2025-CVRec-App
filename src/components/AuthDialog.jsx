import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

function AuthDialog({ open, onClose, type = "candidates" }) {
  const navigate = useNavigate();

  const getDialogContent = () => {
    switch (type) {
      case "candidates":
        return {
          title: "Access Candidates Section",
          description:
            "You need to be registered and logged in as a recruiter to access the candidates section.",
          action: "recruiter account",
        };
      case "apply":
        return {
          title: "Apply for Job",
          description:
            "You need to be registered and logged in as a candidate to apply for jobs.",
          action: "candidate account",
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

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLogin}
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
            onClick={handleRegister}
            startIcon={<PersonAddIcon />}
            size="large"
            color="primary"
          >
            Register
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AuthDialog;

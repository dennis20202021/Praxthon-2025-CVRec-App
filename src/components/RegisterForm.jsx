import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

function RegisterForm({ onRegister }) {
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // In handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const name = e.target.registerName.value;
    const email = e.target.registerEmail.value;
    const password = e.target.registerPassword.value;

    try {
      const response = await axios.post("/api/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        onRegister(role, response.data.user);
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 503) {
        setError(
          "Blockchain network is currently unavailable. Please try again later."
        );
      } else {
        setError(
          error.response?.data?.error ||
            "Registration failed. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={8} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Create an Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="registerName"
          label="Full Name"
          margin="normal"
          required
          placeholder="Enter your full name"
        />

        <TextField
          fullWidth
          id="registerEmail"
          label="Email"
          type="email"
          margin="normal"
          required
          placeholder="Enter your email"
        />

        <TextField
          fullWidth
          id="registerPassword"
          label="Password"
          type="password"
          margin="normal"
          required
          placeholder="Create a password"
        />

        <TextField
          fullWidth
          select
          id="registerRole"
          label="I want to"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          margin="normal"
        >
          <MenuItem value="candidate">Find a Job</MenuItem>
          <MenuItem value="recruiter">Hire Candidates</MenuItem>
        </TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 3,
          p: 1,
          bgcolor: "success.light",
          borderRadius: 1,
        }}
      >
        <LinkIcon sx={{ mr: 1 }} />
        <Typography variant="body2">
          Your identity will be stored on blockchain
        </Typography>
      </Box>
    </Paper>
  );
}

export default RegisterForm;

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

function LoginForm({ onLogin }) {
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // In handleSubmit function:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    try {
      const response = await axios.post("/api/login", { email, password });
      onLogin(response.data.user.role, response.data.user);
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={8} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Login to Your Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          id="loginEmail"
          label="Email"
          type="email"
          margin="normal"
          required
          placeholder="Enter your email"
        />

        <TextField
          fullWidth
          id="loginPassword"
          label="Password"
          type="password"
          margin="normal"
          required
          placeholder="Enter your password"
        />

        <TextField
          fullWidth
          select
          id="loginRole"
          label="Login as"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          margin="normal"
        >
          <MenuItem value="candidate">Candidate</MenuItem>
          <MenuItem value="recruiter">Recruiter</MenuItem>
        </TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
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
          Connected to Hyperledger Fabric Network
        </Typography>
      </Box>
    </Paper>
  );
}

export default LoginForm;

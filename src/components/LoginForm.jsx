import { useState, useEffect } from "react";
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
  LinearProgress,
  Snackbar,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

function LoginForm({ onLogin }) {
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let timer;
    if (showMessage) {
      setProgress(100);
      timer = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 100 / 25)); // 5 seconds = 25 intervals of 200ms
      }, 200);

      const timeout = setTimeout(() => {
        setShowMessage(false);
        clearInterval(timer);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        clearInterval(timer);
      };
    }
  }, [showMessage]);

  const showMessageWithType = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    try {
      const response = await axios.post("/api/login", { email, password });
      onLogin(response.data.user.role, response.data.user);
      showMessageWithType("Login successful!", "success");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed";
      showMessageWithType(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={8} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Login to Your Account
      </Typography>

      {/* Message Snackbar */}
      <Snackbar
        open={showMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ width: "100%" }}>
          <Alert
            severity={message.type}
            sx={{
              width: "100%",
              alignItems: "center",
              "& .MuiAlert-message": {
                flexGrow: 1,
              },
            }}
          >
            {message.text}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 1,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "rgba(255,255,255,0.7)",
                },
              }}
            />
          </Alert>
        </Box>
      </Snackbar>

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

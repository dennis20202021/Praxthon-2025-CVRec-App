import { useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function UploadCV({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate file upload
    setTimeout(() => {
      setLoading(false);
      setSuccess("CV uploaded successfully!");
    }, 2000);
  };

  return (
    <Paper elevation={8} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Upload Your CV
      </Typography>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <input
          accept=".pdf"
          style={{ display: "none" }}
          id="cv-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="cv-upload">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Select PDF File"}
          </Button>
        </label>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
          Upload your CV in PDF format (max 5MB)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}

export default UploadCV;

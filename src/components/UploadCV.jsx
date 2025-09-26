import { useState, useEffect } from "react"; // Import useEffect
import {
  Box,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function UploadCV({ user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cvData, setCvData] = useState(null); // { fileName, fileSize, uploadDate, ipfsHash }
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Load existing CV on component mount - FIXED: use useEffect instead of useState
  useEffect(() => {
    if (user?.email) {
      loadUserCV();
    }
  }, [user]);

  const loadUserCV = async () => {
    try {
      const response = await axios.get(`/api/user/${user.email}`);
      if (response.data.success && response.data.user.cvData) {
        setCvData(response.data.user.cvData);
      }
    } catch (error) {
      console.error("Error loading CV:", error);
    }
  };

  // Simple base64 encoding for demo purposes (for production, use IPFS)
  const encodeFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // For demo: Convert to base64 and store in blockchain
      // In production, you would upload to IPFS and store the hash
      const base64Data = await encodeFileToBase64(file);

      const cvData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        data: base64Data, // Store base64 data directly
        // In production, use IPFS: ipfsHash: "Qm..."
      };

      // Store in blockchain
      const updateData = {
        cvData: cvData,
      };

      // First, get the user by email to obtain the userId
      const userResponse = await axios.get(`/api/user/${user.email}`);
      if (!userResponse.data.success) {
        throw new Error("User not found");
      }

      const userData = userResponse.data.user;

      const userId = userData.userId;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(`/api/user/${userId}`, updateData);

      if (response.data.success) {
        setCvData(cvData);
        setSuccess("CV uploaded successfully!");
        // Clear file input
        e.target.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async () => {
    setLoading(true);
    try {
      const updateData = {
        cvData: null,
      };

      // First, get the user by email to obtain the userId
      const userResponse = await axios.get(`/api/user/${user.email}`);
      if (!userResponse.data.success) {
        throw new Error("User not found");
      }

      const userData = userResponse.data.user;

      const userId = userData.userId;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.put(`/api/user/${userId}`, updateData);

      if (response.data.success) {
        setCvData(null);
        setSuccess("CV deleted successfully!");
        setError("");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = () => {
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
  };

  const downloadCV = () => {
    if (cvData?.data) {
      const link = document.createElement("a");
      link.href = cvData.data;
      link.download = cvData.fileName || "cv.pdf";
      link.click();
    }
  };

  return (
    <>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          mb: 8,
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
          border: "1px solid rgba(76, 201, 240, 0.3)",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ color: "#4CC9F0" }}
        >
          Upload Your CV
        </Typography>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <input
            accept=".pdf"
            style={{ display: "none" }}
            id="cv-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <label htmlFor="cv-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
              sx={{
                mb: 2,
                background: "linear-gradient(135deg, #4CC9F0 0%, #2A9ED8 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2A9ED8 0%, #4CC9F0 100%)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Select PDF File"}
            </Button>
          </label>

          <Typography
            variant="body2"
            sx={{ mb: 3, color: "rgba(255,255,255,0.7)" }}
          >
            Upload your CV in PDF format (max 5MB)
          </Typography>

          {/* CV Actions Section */}
          {cvData && (
            <Box
              sx={{
                mt: 3,
                p: 3,
                border: "1px solid rgba(76, 201, 240, 0.3)",
                borderRadius: "12px",
                background: "rgba(76, 201, 240, 0.05)",
              }}
            >
              <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
                CV Uploaded Successfully!
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}
              >
                {cvData.fileName} • {(cvData.fileSize / 1024 / 1024).toFixed(2)}{" "}
                MB
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleViewCV}
                  sx={{
                    borderColor: "#4CC9F0",
                    color: "#4CC9F0",
                    "&:hover": {
                      borderColor: "#2A9ED8",
                      backgroundColor: "rgba(76, 201, 240, 0.1)",
                    },
                  }}
                >
                  View CV
                </Button>
                <Button
                  variant="outlined"
                  onClick={downloadCV}
                  sx={{
                    borderColor: "#43e97b",
                    color: "#43e97b",
                    "&:hover": {
                      borderColor: "#38f9d7",
                      backgroundColor: "rgba(67, 233, 123, 0.1)",
                    },
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteCV}
                  disabled={loading}
                  sx={{
                    borderColor: "#FF6B6B",
                    color: "#FF6B6B",
                    "&:hover": {
                      borderColor: "#FF5252",
                      backgroundColor: "rgba(255, 107, 107, 0.1)",
                    },
                  }}
                >
                  Delete CV
                </Button>
              </Box>
            </Box>
          )}

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

      {/* PDF Viewer Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
            border: "1px solid rgba(76, 201, 240, 0.3)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, rgba(76, 201, 240, 0.2) 0%, rgba(76, 201, 240, 0.1) 100%)",
            borderBottom: "1px solid rgba(76, 201, 240, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#4CC9F0", fontWeight: "bold" }}
          >
            CV Preview - {cvData?.fileName}
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: "#4CC9F0",
              "&:hover": {
                backgroundColor: "rgba(76, 201, 240, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {cvData?.data ? (
            <iframe
              src={cvData.data}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "0 0 16px 16px" }}
              title="CV Preview"
            />
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
              Unable to display PDF preview
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            background: "rgba(26, 26, 46, 0.8)",
            borderTop: "1px solid rgba(76, 201, 240, 0.3)",
            py: 2,
            px: 3,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#4CC9F0",
              borderColor: "#4CC9F0",
              "&:hover": {
                backgroundColor: "rgba(76, 201, 240, 0.1)",
              },
            }}
          >
            Close
          </Button>
          <Button
            onClick={downloadCV}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4CC9F0 0%, #2A9ED8 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #2A9ED8 0%, #4CC9F0 100%)",
              },
            }}
          >
            Download CV
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UploadCV;

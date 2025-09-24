import { useRef } from "react";
import {
  Box,
  Chip,
  Button,
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  AttachFile,
  Delete,
  PictureAsPdf,
  Image as ImageIcon,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";

function CertificateUpload({ certificates = [], onCertificatesChange }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`File ${file.name} exceeds 10MB limit`);
        return false;
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        alert(`File ${file.name} must be PDF, JPEG, or PNG`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newCertificates = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        file: file,
        type: file.type,
        uploadDate: new Date().toISOString(),
      }));

      onCertificatesChange([...certificates, ...newCertificates]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveCertificate = (certificateId) => {
    const updatedCertificates = certificates.filter(
      (cert) => cert.id !== certificateId
    );
    onCertificatesChange(updatedCertificates);
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return <PictureAsPdf sx={{ color: "#E94560" }} />;
    } else {
      return <ImageIcon sx={{ color: "#4CC9F0" }} />;
    }
  };

  const getFileTypeColor = (fileType) => {
    if (fileType === "application/pdf") {
      return "#E94560";
    } else if (fileType.includes("image")) {
      return "#4CC9F0";
    }
    return "#FFD700";
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: "#FFD700",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CheckCircle sx={{ fontSize: 28 }} />
        Course Certificates
      </Typography>

      <input
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <Card
        sx={{
          background: "rgba(26, 26, 46, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          mb: 2,
          p: 2,
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 3 }}>
          <CloudUpload
            sx={{ fontSize: 48, color: "#4CC9F0", mb: 2, opacity: 0.8 }}
          />
          <Typography variant="body1" sx={{ color: "white", mb: 2 }}>
            Upload your certificates and credentials
          </Typography>
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            startIcon={<CloudUpload />}
            sx={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(67, 233, 123, 0.4)",
              },
              px: 3,
              py: 1.5,
              borderRadius: "12px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
          >
            Add Certificates
          </Button>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1, display: "block" }}
          >
            Supported formats: PDF, JPEG, PNG (max 10MB each)
          </Typography>
        </CardContent>
      </Card>

      {certificates.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            background: "rgba(26, 26, 46, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#FFD700", mb: 2 }}>
            Uploaded Certificates ({certificates.length})
          </Typography>
          <List>
            {certificates.map((certificate) => (
              <ListItem
                key={certificate.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveCertificate(certificate.id)}
                    color="error"
                    sx={{
                      backgroundColor: "rgba(233, 69, 96, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(233, 69, 96, 0.2)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                }
                sx={{
                  mb: 1,
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  {getFileIcon(certificate.type)}
                  <Box sx={{ flexGrow: 1, ml: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      {certificate.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      Uploaded:{" "}
                      {new Date(certificate.uploadDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={certificate.type.split("/")[1].toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: getFileTypeColor(certificate.type),
                      borderColor: getFileTypeColor(certificate.type),
                      backgroundColor: `${getFileTypeColor(
                        certificate.type
                      )}15`,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default CertificateUpload;

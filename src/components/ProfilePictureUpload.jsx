import { useState, useRef } from "react";
import { Box, Avatar, Button, Typography, IconButton } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";

function ProfilePictureUpload({ currentPhoto, onPhotoChange, onPhotoRemove }) {
  const [previewUrl, setPreviewUrl] = useState(currentPhoto);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewUrl(imageUrl);
        onPhotoChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl("");
    onPhotoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 3,
        p: 3,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        background: "rgba(26, 26, 46, 0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Avatar
        src={previewUrl}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          border: previewUrl
            ? "3px solid #4CC9F0"
            : "3px dashed rgba(255, 255, 255, 0.3)",
          boxShadow: previewUrl ? "0 4px 20px rgba(76, 201, 240, 0.3)" : "none",
          transition: "all 0.3s ease",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          startIcon={<PhotoCamera />}
          sx={{
            background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(79, 172, 254, 0.4)",
            },
            px: 3,
            py: 1,
            borderRadius: "12px",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
          }}
        >
          Upload Photo
        </Button>

        {previewUrl && (
          <IconButton
            color="error"
            onClick={handleRemovePhoto}
            sx={{
              backgroundColor: "rgba(233, 69, 96, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(233, 69, 96, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
              width: 40,
              height: 40,
            }}
          >
            <Delete />
          </IconButton>
        )}
      </Box>

      <Typography
        variant="caption"
        sx={{
          mt: 2,
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center",
          maxWidth: 200,
        }}
      >
        Recommended: Square image, max 5MB
        <br />
        Supports: JPG, PNG, WebP
      </Typography>
    </Box>
  );
}

export default ProfilePictureUpload;

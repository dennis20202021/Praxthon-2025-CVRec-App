import { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera, Delete, Person } from "@mui/icons-material";

function ProfilePictureUpload({ currentPhoto, onPhotoChange, onPhotoRemove }) {
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Your ImgBB API Key
  const IMGBB_API_KEY = "d070a3ba1665df1cc91685b83bacd6f8";

  // Update preview when currentPhoto changes
  useEffect(() => {
    console.log("Current photo from parent:", currentPhoto);
    if (currentPhoto) {
      setPreviewUrl(currentPhoto);
    } else {
      setPreviewUrl("");
    }
  }, [currentPhoto]);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      if (!data.data || !data.data.url) {
        throw new Error("No URL returned from ImgBB");
      }

      return data.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      // Create temporary preview first
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);

      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(file);
      console.log("Image uploaded successfully. URL:", imageUrl);

      // Use the permanent URL from ImgBB
      setPreviewUrl(imageUrl);
      onPhotoChange(imageUrl); // This sends the URL to parent component

      // Clean up temporary URL
      URL.revokeObjectURL(tempUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}. Please try again.`);
      // Revert to original photo on error
      setPreviewUrl(currentPhoto || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    console.log("Removing photo...");
    setPreviewUrl("");
    onPhotoRemove(); // This should send empty string to parent

    // Also clear the file input
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
          backgroundColor: previewUrl ? "transparent" : "rgba(255,255,255,0.1)",
        }}
      >
        {!previewUrl && (
          <Person sx={{ fontSize: 48, color: "rgba(255,255,255,0.3)" }} />
        )}
      </Avatar>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={uploading}
      />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={() => fileInputRef.current?.click()}
          startIcon={
            uploading ? <CircularProgress size={16} /> : <PhotoCamera />
          }
          disabled={uploading}
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
          {uploading
            ? "Uploading..."
            : previewUrl
            ? "Change Photo"
            : "Upload Photo"}
        </Button>

        {previewUrl && !uploading && (
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
        {previewUrl ? "Photo ready to save" : "No photo selected"}
        <br />
        Max 5MB • JPG, PNG, WebP
        {uploading && (
          <>
            <br />
            Uploading to cloud...
          </>
        )}
      </Typography>
    </Box>
  );
}

export default ProfilePictureUpload;

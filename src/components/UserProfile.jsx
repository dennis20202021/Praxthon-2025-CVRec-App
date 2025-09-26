import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Save,
  Edit,
  Person,
  ContactPhone,
  Work,
  Security,
} from "@mui/icons-material";
import ProfilePictureUpload from "./ProfilePictureUpload";
import CertificateUpload from "./CertificateUpload";
import CountryCodeSelector from "./CountryCodeSelector";

function UserProfile({ user }) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    title: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    skills: "",
    experience: "",
    education: "",
    countryCode: "US",
    phoneNumber: "",
    linkedInUrl: "",
    profilePhoto: "",
    certificates: [],
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get(`/api/user/${user.email}`);
      if (response.data.success) {
        const userData = response.data.user;
        setProfileData((prev) => ({
          ...prev,
          userId: userData.userId,
          name: userData.name || "",
          email: userData.email || "",
          title: userData.title || "",
          skills: Array.isArray(userData.skills)
            ? userData.skills.join(", ")
            : userData.skills || "",
          experience: userData.experience || "",
          education: userData.education || "",
          countryCode: userData.countryCode || "US",
          phoneNumber: userData.phoneNumber || "",
          linkedInUrl: userData.linkedInUrl || "",
          profilePhoto: userData.profilePhoto || "",
          certificates: userData.certificates || [],
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      showSnackbar("Error loading profile data", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleInputChange = (field) => (event) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePhotoChange = (photoUrl) => {
    setProfileData((prev) => ({
      ...prev,
      profilePhoto: photoUrl,
    }));
  };

  const handlePhotoRemove = () => {
    setProfileData((prev) => ({
      ...prev,
      profilePhoto: "",
    }));
  };

  const handleCertificatesChange = (certificates) => {
    setProfileData((prev) => ({
      ...prev,
      certificates,
    }));
  };

  const handleSave = async () => {
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        showSnackbar(
          "Please enter your current password to change it",
          "error"
        );
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        showSnackbar("New passwords do not match", "error");
        return;
      }
      if (profileData.newPassword.length < 6) {
        showSnackbar(
          "New password must be at least 6 characters long",
          "error"
        );
        return;
      }
    }

    setLoading(true);

    try {
      const updateData = {
        name: profileData.name,
        title: profileData.title,
        skills: profileData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        experience: profileData.experience,
        education: profileData.education,
        countryCode: profileData.countryCode,
        phoneNumber: profileData.phoneNumber,
        linkedInUrl: profileData.linkedInUrl,
        profilePhoto: profileData.profilePhoto,
        certificates: profileData.certificates,
      };

      if (profileData.profilePhoto) {
        updateData.profilePhoto = profileData.profilePhoto;
      } else {
        // Explicitly set to empty string to remove the photo
        updateData.profilePhoto = "";
      }

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
        updateData.currentPassword = profileData.currentPassword;
      }

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
        showSnackbar("Profile updated successfully!", "success");
        setEditing(false);
        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        scrollToTop();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showSnackbar(
        error.response?.data?.error ||
          "Error updating profile. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadUserProfile();
    scrollToTop();
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%)",
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            color: "#FFD700",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            mb: 1,
            background: "linear-gradient(45deg, #FFD700 30%, #FFED4E 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Profile
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Manage your personal and professional information
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 1200,
          mx: "auto",
          background: "rgba(26, 26, 46, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          mb: 8,
        }}
      >
        {/* Action Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            p: 3,
            background:
              "linear-gradient(135deg, rgba(76, 201, 240, 0.1) 0%, rgba(76, 201, 240, 0.05) 100%)",
            borderRadius: "12px",
            border: "1px solid rgba(76, 201, 240, 0.2)",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "#4CC9F0", fontWeight: "bold" }}
            >
              Profile Information
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {editing
                ? "Edit your profile details"
                : "View and manage your profile"}
            </Typography>
          </Box>
          <Button
            variant={editing ? "outlined" : "contained"}
            startIcon={editing ? <Save /> : <Edit />}
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
            sx={{
              background: editing
                ? "transparent"
                : "linear-gradient(135deg, #4CC9F0 0%, #2A9ED8 100%)",
              borderColor: "#4CC9F0",
              color: editing ? "#4CC9F0" : "white",
              "&:hover": {
                background: editing
                  ? "rgba(76, 201, 240, 0.1)"
                  : "linear-gradient(135deg, #2A9ED8 0%, #4CC9F0 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(76, 201, 240, 0.3)",
              },
              transition: "all 0.3s ease",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : editing ? (
              "Save Changes"
            ) : (
              "Edit Profile"
            )}
          </Button>
        </Box>

        {/* Profile Picture Section - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 500,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Person sx={{ fontSize: 48, color: "#4CC9F0", mb: 2 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#FFD700", mb: 3 }}
              >
                Profile Picture
              </Typography>
              <ProfilePictureUpload
                currentPhoto={profileData.profilePhoto}
                onPhotoChange={handlePhotoChange}
                onPhotoRemove={handlePhotoRemove}
              />
            </CardContent>
          </Card>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Left Column - Personal Information */}
          <Grid item xs={12} md={6} lg={5}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 215, 0, 0.02) 100%)",
                border: "1px solid rgba(255, 215, 0, 0.2)",
                borderRadius: "16px",
                height: "fit-content",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Person sx={{ color: "#FFD700", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#FFD700" }}>
                    Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(255, 215, 0, 0.3)" }} />

                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.name}
                  onChange={handleInputChange("name")}
                  disabled={!editing}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  disabled
                  margin="normal"
                  helperText="Email cannot be changed"
                  sx={{
                    "& .MuiInputBase-input": { color: "rgba(255,255,255,0.7)" },
                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Contact Information */}
          <Grid item xs={12} md={6} lg={5} height={309.1}>
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, rgba(76, 201, 240, 0.05) 0%, rgba(76, 201, 240, 0.02) 100%)",
                border: "1px solid rgba(76, 201, 240, 0.2)",
                borderRadius: "16px",
                height: 309.1,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ContactPhone sx={{ color: "#4CC9F0", mr: 1 }} />
                  <Typography variant="h6" sx={{ color: "#4CC9F0" }}>
                    Contact Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, bgcolor: "rgba(76, 201, 240, 0.3)" }} />

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <CountryCodeSelector
                    value={profileData.countryCode}
                    onChange={handleInputChange("countryCode")}
                    disabled={!editing}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange("phoneNumber")}
                    disabled={!editing}
                    placeholder="1234567890"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="LinkedIn Profile URL"
                  value={profileData.linkedInUrl}
                  onChange={handleInputChange("linkedInUrl")}
                  disabled={!editing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Professional Information Section - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 800,
              background:
                "linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(67, 233, 123, 0.02) 100%)",
              border: "1px solid rgba(67, 233, 123, 0.2)",
              borderRadius: "16px",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  justifyContent: "center",
                }}
              >
                <Work sx={{ color: "#43e97b", mr: 2 }} />
                <Typography variant="h5" sx={{ color: "#43e97b" }}>
                  Professional Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 4, bgcolor: "rgba(67, 233, 123, 0.3)" }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Skills (comma separated)"
                    value={profileData.skills}
                    onChange={handleInputChange("skills")}
                    disabled={!editing}
                    placeholder="JavaScript, React, Node.js, Blockchain"
                    helperText="Separate multiple skills with commas"
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current/Desired Position"
                    value={profileData.title}
                    onChange={handleInputChange("title")}
                    disabled={!editing}
                    placeholder="Senior Software Engineer | Full Stack Developer"
                    helperText="Separate multiple titles with ' | '"
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Experience"
                    value={profileData.experience}
                    onChange={handleInputChange("experience")}
                    disabled={!editing}
                    placeholder="5 years in software development"
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Education"
                    value={profileData.education}
                    onChange={handleInputChange("education")}
                    disabled={!editing}
                    placeholder="Bachelor's in Computer Science"
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Password Change Section - Centered (Only when editing) */}
        {editing && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 800,
                background:
                  "linear-gradient(135deg, rgba(157, 80, 187, 0.05) 0%, rgba(157, 80, 187, 0.02) 100%)",
                border: "1px solid rgba(157, 80, 187, 0.2)",
                borderRadius: "16px",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    justifyContent: "center",
                  }}
                >
                  <Security sx={{ color: "#9D50BB", mr: 2 }} />
                  <Typography variant="h5" sx={{ color: "#9D50BB" }}>
                    Change Password (Optional)
                  </Typography>
                </Box>
                <Divider sx={{ mb: 4, bgcolor: "rgba(157, 80, 187, 0.3)" }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      value={profileData.currentPassword}
                      onChange={handleInputChange("currentPassword")}
                      helperText="Required only if changing password"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={profileData.newPassword}
                      onChange={handleInputChange("newPassword")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      value={profileData.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Certificates Section - Centered (Only when editing) */}
        {editing && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 800,
                background:
                  "linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 107, 107, 0.02) 100%)",
                border: "1px solid rgba(255, 107, 107, 0.2)",
                borderRadius: "16px",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: "#FF6B6B", textAlign: "center", mb: 3 }}
                >
                  Course Certificates
                </Typography>
                <Divider sx={{ mb: 4, bgcolor: "rgba(255, 107, 107, 0.3)" }} />
                <CertificateUpload
                  certificates={profileData.certificates}
                  onCertificatesChange={handleCertificatesChange}
                />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Action Buttons */}
        {editing && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mt: 4,
              pt: 4,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{
                borderColor: "#FF6B6B",
                color: "#FF6B6B",
                "&:hover": {
                  borderColor: "#FF5252",
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                },
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                minWidth: 140,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              sx={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(67, 233, 123, 0.4)",
                },
                px: 4,
                py: 1.5,
                borderRadius: "8px",
                transition: "all 0.3s ease",
                minWidth: 140,
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default UserProfile;

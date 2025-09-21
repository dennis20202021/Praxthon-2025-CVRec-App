import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import PrivacyPolicyDialog from "./PrivacyPolicyDialog";
import TermsOfServiceDialog from "./TermsOfServiceDialog";

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  const handlePrivacyOpen = () => setPrivacyDialogOpen(true);
  const handlePrivacyClose = () => setPrivacyDialogOpen(false);
  const handleTermsOpen = () => setTermsDialogOpen(true);
  const handleTermsClose = () => setTermsDialogOpen(false);

  const handlePrivacyAccept = () => {
    // This is just to close the dialog when accepted from footer
    // No need to set any agreement state like in RegisterForm
    setPrivacyDialogOpen(false);
  };

  const handleTermsAccept = () => {
    // This is just to close the dialog when accepted from footer
    setTermsDialogOpen(false);
  };

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
        color: "white",
        py: 6,
        borderTop: "1px solid rgba(255, 215, 0, 0.2)",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src="/img/CV-App-Logo.jpeg"
                alt="CV App Blockchain Platform"
                sx={{
                  height: 40,
                  width: 40,
                  borderRadius: "8px",
                  mr: 2,
                  border: "2px solid #FFD700",
                }}
              />
              <Typography variant="h5" sx={{ color: "#FFD700" }}>
                World Master Technology IT - CV App
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Revolutionizing recruitment with Hyperledger Fabric blockchain
              technology. Secure, transparent, and efficient talent acquisition.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  color: "#FFD700",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "#FFD700",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "#FFD700",
                  border: "1px solid rgba(255, 215, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Home
              </Link>
              <Link
                href="/jobs"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Jobs
              </Link>
              <Link
                href="/about"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                About Us
              </Link>
              <Link
                href="/login"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Login
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Help Center
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                Tutorials
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1, color: "#FFD700" },
                }}
              >
                FAQs
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@cvapp.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <LocationIcon
                  sx={{ color: "#FFD700", fontSize: 20, mt: 0.5 }}
                />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Blockchain Avenue
                  <br />
                  Tech City, TC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 CV App Blockchain Platform. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              component="button"
              type="button"
              onClick={handlePrivacyOpen}
              color="inherit"
              sx={{ opacity: 0.7, "&:hover": { opacity: 1, color: "#FFD700" } }}
            >
              Privacy Policy
            </Link>
            <Link
              component="button"
              type="button"
              onClick={handleTermsOpen}
              color="inherit"
              sx={{ opacity: 0.7, "&:hover": { opacity: 1, color: "#FFD700" } }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ opacity: 0.7, "&:hover": { opacity: 1, color: "#FFD700" } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Dialog Components */}
      <PrivacyPolicyDialog
        open={privacyDialogOpen}
        onClose={handlePrivacyClose}
        onAccept={handlePrivacyAccept}
      />

      <TermsOfServiceDialog
        open={termsDialogOpen}
        onClose={handleTermsClose}
        onAccept={handleTermsAccept}
      />
    </Box>
  );
}

export default Footer;

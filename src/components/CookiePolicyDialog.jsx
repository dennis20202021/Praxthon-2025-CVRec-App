import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

// Custom styled dialog for consistent styling
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
    color: "white",
    border: "1px solid rgba(255, 215, 0, 0.2)",
    borderRadius: "16px",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(26, 26, 46, 0.3)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background:
        "linear-gradient(110deg, #ffd700 0%, #e94560 50%, #ffd700 100%)",
      borderRadius: "4px",
      boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
    },
  },
  "& .MuiDialogContent-root": {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(26, 26, 46, 0.3)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background:
        "linear-gradient(110deg, #ffd700 0%, #e94560 50%, #ffd700 100%)",
      borderRadius: "4px",
      boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
    },
  },
}));

function CookiePolicyDialog({ open, onClose, onAccept }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
        <Typography variant="h4" sx={{ color: "#FFD700" }}>
          Cookie Policy
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            1. Introduction
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            At CV App Blockchain Platform, we use cookies and similar
            technologies to enhance your experience, analyze our traffic, and
            for security and marketing purposes. This Cookie Policy explains
            what cookies are, how we use them, and your choices regarding
            cookies.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            2. What Are Cookies?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Cookies are small text files that are stored on your device when you
            visit our website. They help us provide you with a better experience
            by remembering your preferences, understanding how you use our site,
            and showing you relevant content.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            3. Types of Cookies We Use
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            - Essential Cookies: Required for the operation of our website
            <br />
            - Functionality Cookies: Remember your preferences and settings
            <br />
            - Analytics Cookies: Help us understand how visitors interact with
            our website
            <br />- Marketing Cookies: Used to track visitors across websites to
            display relevant ads
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            4. How We Use Cookies
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We use cookies to:
            <br />
            - Authenticate users and prevent fraudulent use of accounts
            <br />
            - Remember your preferences and settings
            <br />
            - Analyze how our services are used to improve them
            <br />
            - Personalize content and show you relevant recommendations
            <br />- Measure the effectiveness of our marketing campaigns
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            5. Third-Party Cookies
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            In addition to our own cookies, we may also use various third-party
            cookies to report usage statistics of the service, deliver
            advertisements, and provide other functionalities. These include:
            <br />
            - Google Analytics for website analytics
            <br />
            - Social media plugins for content sharing
            <br />- Advertising networks for relevant ads
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            6. Your Cookie Choices
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer and you can set most
            browsers to prevent them from being placed. However, if you do this,
            you may have to manually adjust some preferences every time you
            visit a site and some services and functionalities may not work.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            7. How to Manage Cookies
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Most web browsers allow you to control cookies through their
            settings preferences. However, if you limit the ability of websites
            to set cookies, you may worsen your overall user experience. You can
            usually find these settings in the "Options" or "Preferences" menu
            of your browser.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            8. Changes to This Cookie Policy
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legislation, or our operations. We will
            notify you of any material changes by posting the new policy on this
            page with a new "Last Updated" date.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            9. Contact Us
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            If you have any questions about our use of cookies, please contact
            us at:
            <br />
            Email: privacy@cvapp.com
            <br />
            Address: Oficina 123, Edificio World Master Technology, Bogotá D.C,
            Colombia
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ background: "rgba(26, 26, 46, 0.8)", p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="outlined"
          sx={{
            color: "#E94560",
            borderColor: "#E94560",
            "&:hover": {
              backgroundColor: "rgba(233, 69, 96, 0.1)",
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={onAccept}
          sx={{
            backgroundColor: "#00CC99",
            "&:hover": {
              backgroundColor: "#00B386",
            },
          }}
        >
          I Accept
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default CookiePolicyDialog;

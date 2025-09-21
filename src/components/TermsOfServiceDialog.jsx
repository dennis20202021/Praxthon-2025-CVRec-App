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

function TermsOfServiceDialog({ open, onClose, onAccept }) {
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
          Terms of Service
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            By accessing or using the CV App Blockchain Platform ("Service"),
            you agree to be bound by these Terms of Service. If you disagree
            with any part of the terms, you may not access the Service.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            2. User Accounts
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            When you create an account with us, you must provide accurate,
            complete, and current information. You are responsible for
            safeguarding your account credentials and for any activities or
            actions under your account.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            3. Blockchain Technology
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Our platform utilizes Hyperledger Fabric blockchain technology. You
            acknowledge that: - Blockchain transactions are immutable and
            permanent - Data stored on the blockchain cannot be deleted or
            modified - You are responsible for the accuracy of information you
            store on the blockchain
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            4. User Responsibilities
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            You agree not to: - Post false or misleading information - Use the
            Service for any illegal purpose - Violate any laws in your
            jurisdiction - Infringe upon intellectual property rights - Harass,
            abuse, or harm another person
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            5. Intellectual Property
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            The Service and its original content, features, and functionality
            are owned by CV App and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property
            laws.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            6. Termination
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms. Note that blockchain data cannot
            be deleted upon termination.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            7. Limitation of Liability
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            In no event shall CV App, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            8. Governing Law
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            These Terms shall be governed and construed in accordance with the
            laws of the State of Delaware, United States, without regard to its
            conflict of law provisions.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            9. Changes to Terms
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide notice of any changes by
            posting the new Terms on this page.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            10. Contact Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: legal@cvapp.com
            <br />
            Address: 123 Blockchain Avenue, Tech City, TC 12345
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

export default TermsOfServiceDialog;

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

function PrivacyPolicyDialog({ open, onClose, onAccept }) {
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
          Privacy Policy & Data Protection
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
            Welcome to CV App Blockchain Platform. We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, and share your personal
            information when you use our blockchain-based recruitment platform.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            2. Information We Collect
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We collect information that you provide directly to us, including: -
            Personal identification information (Name, email address, phone
            number) - Professional information (CV, work experience, education,
            skills) - Application data (Job applications, interview responses) -
            Blockchain transaction data
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We use the information we collect to: - Provide and maintain our
            services - Match candidates with job opportunities - Verify
            credentials using blockchain technology - Communicate with you about
            your account and our services - Improve our platform and develop new
            features
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            4. Blockchain Technology
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Our platform uses Hyperledger Fabric blockchain to ensure: -
            Immutable record of all transactions and applications - Transparent
            and tamper-proof hiring process - Secure storage of sensitive
            information - Verifiable credentials and work history
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            5. Your Rights (GDPR, CCPA, and other regulations)
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Depending on your location, you may have the following rights: -
            Right to access your personal data - Right to rectification of
            inaccurate data - Right to erasure ("right to be forgotten") - Right
            to restrict processing - Right to data portability - Right to object
            to processing - Rights related to automated decision-making
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            6. Data Retention
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law. Blockchain
            records are immutable and permanent as part of the distributed
            ledger technology.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            7. Security Measures
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            We implement appropriate technical and organizational security
            measures to protect your personal information, including encryption,
            access controls, and regular security assessments. Our blockchain
            infrastructure provides additional security through distributed
            consensus and cryptography.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            8. International Data Transfers
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Your information may be transferred to and processed in countries
            other than the country in which you reside. These countries may have
            data protection laws that are different from the laws of your
            country. We ensure appropriate safeguards are in place for
            international data transfers.
          </Typography>

          <Typography variant="h6" sx={{ color: "#4CC9F0", mb: 1 }}>
            9. Contact Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            If you have questions or concerns about this Privacy Policy or our
            data practices, please contact us at:
            <br />
            Email: privacy@cvapp.com
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

export default PrivacyPolicyDialog;

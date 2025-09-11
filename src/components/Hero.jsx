import React from "react";
import { Box, Typography, Button, Container, keyframes } from "@mui/material";
import { styled } from "@mui/system";

// Create keyframes for the shimmering effect
const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Create a styled component with the animation
const ShimmerTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(110deg, #ffd700 0%, #ffffff 25%, #ffd700 50%, #e94560 75%, #ffd700 100%)",
  backgroundSize: "200% auto",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmer} 10s linear infinite`,
  textShadow: "0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)",
  position: "relative",
  display: "inline-block",
  "&:after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `${shimmer} 2s linear infinite`,
    animationDelay: "0.5s",
    opacity: 0.7,
  }
}));

function Hero() {
  return (
    <Box 
      sx={{ 
        py: 8, 
        textAlign: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        color: "white"
      }}
    >
      <Container maxWidth="md">
        <ShimmerTypography 
        variant="h1" 
        gutterBottom
        sx={{
          mb: 3,
          fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
          fontSize: {
            xs: '1.8rem',
            sm: '2.2rem',
            md: '2.8rem',
            lg: '3.5rem'
          },
        }}>
          Revolutionizing Recruitment with Blockchain
        </ShimmerTypography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: "1.2rem", opacity: 0.8 }}>
          Experience the future of hiring with our Hyperledger Fabric-powered platform. 
          Secure, transparent, and efficient talent acquisition for candidates and recruiters.
        </Typography>
        <Button variant="contained" color="error" size="large">
          Get Started
        </Button>
      </Container>
    </Box>
  );
}

export default Hero;
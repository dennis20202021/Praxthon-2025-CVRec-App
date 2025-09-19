import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  useTheme,
  Button,
  keyframes,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  RocketLaunch as RocketLaunchIcon,
  Diamond as DiamondIcon,
  Groups as GroupsIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
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
  background:
    "linear-gradient(110deg, #ffd700 0%, #ffffff 25%, #ffd700 50%, #e94560 75%, #ffd700 100%)",
  backgroundSize: "200% auto",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmer} 10s linear infinite`,
  textShadow:
    "0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)",
  position: "relative",
  display: "inline-block",
  "&:after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `${shimmer} 2s linear infinite`,
    animationDelay: "0.5s",
    opacity: 0.7,
  },
}));

function AboutUs() {
  const theme = useTheme();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Blockchain Security",
      description:
        "All candidate data and job applications are stored on a secure Hyperledger Fabric blockchain network, ensuring tamper-proof records and complete transparency.",
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      title: "Complete Transparency",
      description:
        "Immutable audit trails provide complete visibility into the hiring process for both candidates and recruiters, eliminating bias and ensuring fairness.",
    },
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
      title: "Lightning Fast",
      description:
        "Streamlined hiring process powered by blockchain technology reduces time-to-hire by 60% and eliminates unnecessary intermediaries.",
    },
    {
      icon: <DiamondIcon sx={{ fontSize: 40 }} />,
      title: "Premium Quality",
      description:
        "AI-powered matching algorithm connects top talent with leading companies, ensuring high-quality matches and successful placements.",
    },
  ];

  const stats = [
    { icon: <GroupsIcon />, number: "10K+", label: "Active Candidates" },
    { icon: <WorkIcon />, number: "2.5K+", label: "Job Postings" },
    { icon: <TrendingUpIcon />, number: "95%", label: "Success Rate" },
  ];

  return (
    <Box
      sx={{
        py: 8,
        background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <ShimmerTypography
            variant="h1"
            gutterBottom
            sx={{
              mb: 3,
              fontFamily:
                '"Playfair Display", "Georgia", "Times New Roman", serif',
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
                lg: "3.5rem",
              },
            }}
          >
            About CV App Blockchain Platform
          </ShimmerTypography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 800,
              mx: "auto",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Revolutionizing the recruitment industry with cutting-edge
            Hyperledger Fabric blockchain technology. We're building a
            decentralized ecosystem where talent meets opportunity seamlessly.
          </Typography>

          <Button
            variant="contained"
            color="error"
            size="large"
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Join Our Network
          </Button>
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  background: "rgba(26, 26, 46, 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                    color: "#FFD700",
                  }}
                >
                  {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                </Box>
                <Typography variant="h3" sx={{ color: "#FFD700", mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Typography
          variant="h2"
          sx={{ textAlign: "center", mb: 6, color: "#FFD700" }}
        >
          Why Choose Our Platform?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  background: "rgba(26, 26, 46, 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "rgba(233, 69, 96, 0.2)",
                      mr: 2,
                      width: 60,
                      height: 60,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h4" sx={{ color: "#FFD700" }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Mission Section */}
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            background: "rgba(26, 26, 46, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
          }}
        >
          <Typography variant="h2" sx={{ color: "#FFD700", mb: 3 }}>
            Our Mission
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            To create a fair, transparent, and efficient hiring ecosystem where
            candidates have complete control over their data and recruiters can
            find the perfect talent without traditional barriers and biases.
            We're committed to building the future of recruitment on the solid
            foundation of blockchain technology.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button variant="contained" color="error" size="large">
              For Candidates
            </Button>
            <Button variant="outlined" color="warning" size="large">
              For Recruiters
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default AboutUs;

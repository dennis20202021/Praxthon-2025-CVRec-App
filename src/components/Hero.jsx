import {
  Box,
  Typography,
  Button,
  Container,
  keyframes,
  Grid,
  Card,
  Avatar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  ArrowDownward as ArrowDownwardIcon,
  LinkedIn as LinkedInIcon,
  Work as WorkIcon,
  Groups as GroupsIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";

// Create keyframes for the shimmering effect
const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// Create keyframes for floating animation
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

const FloatingCard = styled(Card)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-15px) scale(1.05)",
    animation: "none",
  },
}));

function Hero() {
  const theme = useTheme();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 30 }} />,
      title: "Blockchain Security",
      description: "Immutable records on Hyperledger Fabric",
    },
    {
      icon: <WorkIcon sx={{ fontSize: 30 }} />,
      title: "Smart Contracts",
      description: "Automated hiring processes",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 30 }} />,
      title: "Global Talent",
      description: "Connect with top professionals",
    },
    {
      icon: <LinkedInIcon sx={{ fontSize: 30 }} />,
      title: "Verified Profiles",
      description: "Authentic candidate credentials",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.1) 0%, transparent 50%)",
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Hero Content */}
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
              lineHeight: 1.1,
            }}
          >
            Revolutionizing Recruitment with Blockchain
          </ShimmerTypography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              maxWidth: 800,
              mx: "auto",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Experience the future of hiring with our Hyperledger Fabric-powered
            platform. Secure, transparent, and efficient talent acquisition
            powered by blockchain technology.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
              mb: 6,
            }}
          >
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            >
              Learn More
            </Button>
          </Box>

          {/* Scroll Indicator */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: 0.7,
              cursor: "pointer",
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              Scroll to explore
            </Typography>
            <ArrowDownwardIcon
              sx={{
                animation: `${float} 2s ease-in-out infinite`,
                color: "#FFD700",
                "&:hover": {
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FloatingCard
                sx={{
                  p: 3,
                  textAlign: "center",
                  background: "rgba(26, 26, 46, 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  height: "100%",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(233, 69, 96, 0.2)",
                    mx: "auto",
                    mb: 2,
                    width: 60,
                    height: 60,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" sx={{ color: "#FFD700", mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {feature.description}
                </Typography>
              </FloatingCard>
            </Grid>
          ))}
        </Grid>

        {/* Stats Banner */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            background: "rgba(26, 26, 46, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Typography
                variant="h3"
                sx={{ color: "#FFD700", fontWeight: 700 }}
              >
                10K+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Users
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="h3"
                sx={{ color: "#FFD700", fontWeight: 700 }}
              >
                2.5K+
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Job Postings
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="h3"
                sx={{ color: "#FFD700", fontWeight: 700 }}
              >
                95%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Success Rate
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography
                variant="h3"
                sx={{ color: "#FFD700", fontWeight: 700 }}
              >
                24/7
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Blockchain Security
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <br />
        <br />
      </Container>
    </Box>
  );
}

export default Hero;

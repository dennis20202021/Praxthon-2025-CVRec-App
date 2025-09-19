import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

function CandidateDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "#FFD700",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            }}
          >
            Candidate Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, color: "white" }}>
            Welcome, {user?.name || "John Doe"}!
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        {/* Browse Jobs - Blue Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(79, 172, 254, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "180px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<SearchIcon />}
          onClick={() => navigate("/jobs")}
        >
          Browse Jobs
        </Button>

        {/* Upload CV - Green Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(67, 233, 123, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "180px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate("/upload-cv")}
        >
          Upload CV
        </Button>

        {/* My Profile - Purple Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #9D50BB 0%, #6E48AA 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #6E48AA 0%, #9D50BB 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(157, 80, 187, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "180px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<PersonIcon />}
          onClick={() => navigate("/profile")}
        >
          My Profile
        </Button>
      </Box>

      {/* Quick Stats */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            textAlign: "center",
            flex: 1,
            background: "rgba(26, 26, 46, 0.5)",
            backdropFilter: "blur(10px)",
            minWidth: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography variant="h4" sx={{ color: "#4FACFE", mb: 1 }}>
            5
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Jobs Applied
          </Typography>
        </Box>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            textAlign: "center",
            flex: 1,
            background: "rgba(26, 26, 46, 0.5)",
            backdropFilter: "blur(10px)",
            minWidth: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography variant="h4" sx={{ color: "#43e97b", mb: 1 }}>
            2
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Interviews
          </Typography>
        </Box>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            textAlign: "center",
            flex: 1,
            background: "rgba(26, 26, 46, 0.5)",
            backdropFilter: "blur(10px)",
            minWidth: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography variant="h4" sx={{ color: "#9D50BB", mb: 1 }}>
            1
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Offers
          </Typography>
        </Box>
      </Box>

      {/* Recent Activity */}
      <Box>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: "#FFD700",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Recent Activity
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, color: "white" }}>
          You haven't applied to any jobs yet. Start browsing available
          positions!
        </Typography>
      </Box>
    </Box>
  );
}

export default CandidateDashboard;

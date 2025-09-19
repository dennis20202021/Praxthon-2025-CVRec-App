import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PostAdd as PostAddIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

function RecruiterDashboard({ user }) {
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
            Recruiter Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, color: "white" }}>
            Welcome, {user?.name || "Jane Smith"}!
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
        {/* Post New Job - Purple Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "200px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<PostAddIcon />}
          onClick={() => navigate("/post-job")}
        >
          Post New Job
        </Button>

        {/* View Candidates - Teal Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(17, 153, 142, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "200px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<PeopleIcon />}
          onClick={() => navigate("/candidates")}
        >
          View Candidates
        </Button>

        {/* Manage Jobs - Orange Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #f7931e 0%, #ff6b35 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(255, 107, 53, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "200px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<WorkIcon />}
          onClick={() => navigate("/jobs")}
        >
          Manage Jobs
        </Button>

        {/* Analytics - Pink Gradient */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #ec008c 0%, #fc6767 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #fc6767 0%, #ec008c 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(236, 0, 140, 0.4)",
            },
            py: 2,
            px: 3,
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "200px" },
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
          startIcon={<AnalyticsIcon />}
          onClick={() => navigate("/analytics")}
        >
          Analytics
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
          <Typography variant="h4" sx={{ color: "#667eea", mb: 1 }}>
            12
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Active Jobs
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
          <Typography variant="h4" sx={{ color: "#38ef7d", mb: 1 }}>
            45
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Applications
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
          <Typography variant="h4" sx={{ color: "#ff6b35", mb: 1 }}>
            8
          </Typography>
          <Typography variant="body2" sx={{ color: "white", opacity: 0.9 }}>
            Interviews
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
          5 new applications received in the last 24 hours.
        </Typography>
      </Box>
    </Box>
  );
}

export default RecruiterDashboard;

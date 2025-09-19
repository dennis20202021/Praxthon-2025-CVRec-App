import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Tabs,
  Tab,
  AppBar,
  TextField,
  CircularProgress,
  Alert,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import axios from "axios";

// Create styled Tab component with proper colors
const StyledTab = styled(Tab)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.7) !important",
  fontSize: "0.875rem",
  minWidth: "auto",
  padding: "8px 12px",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1rem",
    padding: "12px 16px",
  },
  "&.Mui-selected": {
    color: "#0A0A1A !important", // Dark text on gold background
    fontWeight: 600,
  },
}));

function CandidatesList({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, tabValue]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/candidates");
      if (response.data.success) {
        setCandidates(response.data.candidates);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to load candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates.filter((candidate) => {
      // Filter by search term with safety checks
      const matchesSearch =
        searchTerm === "" ||
        (candidate.name &&
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.title &&
          candidate.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.skills &&
          candidate.skills.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by tab selection
      let matchesTab = true;
      if (tabValue === 1) matchesTab = candidate.status === "New";
      if (tabValue === 2) matchesTab = candidate.status === "Reviewing";
      if (tabValue === 3) matchesTab = candidate.status === "Interview";

      return matchesSearch && matchesTab;
    });

    setFilteredCandidates(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchCandidates}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          color: "#FFD700",
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Candidates
      </Typography>

      {/* Search Box */}
      <TextField
        fullWidth
        placeholder="Search candidates by name, title, or skills..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiInputBase-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        }}
      />

      {/* Tabs */}
      <AppBar
        position="static"
        sx={{
          mb: 3,
          borderRadius: 1,
          backgroundColor: "rgba(0, 0, 0, 0.2) !important",
          "& .MuiTabs-indicator": {
            backgroundColor: "#FFD700",
            height: "100%",
            borderRadius: "8px",
          },
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered={!isMobile}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.7)",
              zIndex: 1, // Ensure text is above the indicator
              minWidth: "auto",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              px: { xs: 1, sm: 2 },
            },
            "& .Mui-selected": {
              color: "#0A0A1A !important", // Dark text on gold background
              fontWeight: 600,
            },
          }}
        >
          <StyledTab label={isMobile ? "All" : "All Candidates"} />
          <StyledTab label="New" />
          <StyledTab label={isMobile ? "Review" : "Reviewing"} />
          <StyledTab label={isMobile ? "Interview" : "Interview"} />
        </Tabs>
      </AppBar>

      {/* Candidate Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {filteredCandidates.length === 0 ? (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                p: 4,
                color: "white",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              No candidates found matching your criteria.
            </Typography>
          </Grid>
        ) : (
          filteredCandidates.map((candidate, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(26, 26, 46, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  color: "white",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      color: "#ffffffff",
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    {candidate.name || "Unnamed Candidate"}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#E94560",
                      mb: 1,
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    {candidate.title || "No title specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    <strong style={{ color: "#FFD700" }}>Experience:</strong>{" "}
                    {candidate.experience || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    <strong style={{ color: "#FFD700" }}>Skills:</strong>{" "}
                    {candidate.skills || "No skills listed"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    <strong style={{ color: "#FFD700" }}>Education:</strong>{" "}
                    {candidate.education || "Not specified"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {candidate.skills &&
                      candidate.skills
                        .split(", ")
                        .slice(0, isMobile ? 2 : 4) // Limit number of chips on mobile
                        .map((skill, i) => (
                          <Chip
                            key={i}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#FFD700",
                              borderColor: "rgba(255, 215, 0, 0.5)",
                              backgroundColor: "rgba(255, 215, 0, 0.1)",
                              fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              height: { xs: 24, sm: 28 },
                            }}
                          />
                        ))}
                    {candidate.skills &&
                      candidate.skills.split(", ").length >
                        (isMobile ? 2 : 4) && (
                        <Chip
                          label={`+${
                            candidate.skills.split(", ").length -
                            (isMobile ? 2 : 4)
                          }`}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "#4CC9F0",
                            borderColor: "rgba(76, 201, 240, 0.5)",
                            backgroundColor: "rgba(76, 201, 240, 0.1)",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                            height: { xs: 24, sm: 28 },
                          }}
                        />
                      )}
                  </Box>
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    p: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      color: "#FFD700",
                      borderColor: "#FFD700",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                        color: "#0A0A1A",
                      },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      minWidth: { xs: "100%", sm: "auto" },
                    }}
                    startIcon={
                      <DescriptionIcon
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      />
                    }
                  >
                    View CV
                  </Button>
                  {candidate.title && candidate.title.includes("Blockchain") ? (
                    <Button
                      variant="contained"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        backgroundColor: "#E94560",
                        "&:hover": {
                          backgroundColor: "#D42A45",
                        },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                      startIcon={
                        <CalendarIcon
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        />
                      }
                    >
                      {isMobile ? "Meet" : "Schedule Meeting"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        backgroundColor: "#E94560",
                        "&:hover": {
                          backgroundColor: "#D42A45",
                        },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                      startIcon={
                        <EmailIcon
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        />
                      }
                    >
                      {isMobile ? "Contact" : "Contact"}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default CandidatesList;

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Close as CloseIcon,
  Block as BlockIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Send as SendIcon,
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

// Status chip colors
const statusColors = {
  "Not Applied": { bg: "#757575", color: "white" }, // Gray - default state
  Applied: { bg: "#1976d2", color: "white" }, // Blue - automatic when applying
  Reviewing: { bg: "#ed6c02", color: "white" },
  Interview: { bg: "#9c27b0", color: "white" },
  Hired: { bg: "#2e7d32", color: "white" },
  Rejected: { bg: "#d32f2f", color: "white" },
};

// Helper function to safely get status colors
const getStatusColor = (status) => {
  return statusColors[status] || statusColors["Not Applied"];
};

function CandidatesList({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [cvDialogOpen, setCvDialogOpen] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedCandidateForStatus, setSelectedCandidateForStatus] =
    useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        const formattedCandidates = response.data.candidates.map(
          (candidate) => ({
            ...candidate,
            skills: Array.isArray(candidate.skills)
              ? candidate.skills.join(", ")
              : candidate.skills || "",
            name: candidate.name || "Unnamed Candidate",
            title: candidate.title || "No title specified",
            experience: candidate.experience || "Not specified",
            education: candidate.education || "Not specified",
            status: candidate.status || "Not Applied",
            cvData: candidate.cvData || null,
            profilePhoto: candidate.profilePhoto || "",
          })
        );
        setCandidates(formattedCandidates);
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
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        (candidate.name &&
          candidate.name.toLowerCase().includes(searchLower)) ||
        (candidate.title &&
          candidate.title.toLowerCase().includes(searchLower)) ||
        (candidate.skills &&
          candidate.skills.toLowerCase().includes(searchLower)) ||
        (candidate.experience &&
          candidate.experience.toLowerCase().includes(searchLower)) ||
        (candidate.education &&
          candidate.education.toLowerCase().includes(searchLower));

      let matchesTab = true;
      if (tabValue === 0) matchesTab = true; // All candidates
      if (tabValue === 1) matchesTab = candidate.status === "Applied";
      if (tabValue === 2) matchesTab = candidate.status === "Reviewing";
      if (tabValue === 3) matchesTab = candidate.status === "Interview";

      return matchesSearch && matchesTab;
    });

    setFilteredCandidates(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `/api/candidates/${candidateId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setCandidates((prev) =>
          prev.map((candidate) =>
            candidate.userId === candidateId
              ? { ...candidate, status: newStatus }
              : candidate
          )
        );

        setError("");
        handleStatusMenuClose();
      }
    } catch (error) {
      console.error("Error updating candidate status:", error);
      setError("Failed to update candidate status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusMenuOpen = (event, candidate) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedCandidateForStatus(candidate);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedCandidateForStatus(null);
  };

  const handleViewCV = (candidate) => {
    setSelectedCandidate(candidate);
    setCvDialogOpen(true);
  };

  const handleCloseCvDialog = () => {
    setCvDialogOpen(false);
    setSelectedCandidate(null);
  };

  const downloadCV = (candidate) => {
    if (candidate?.cvData?.data) {
      const link = document.createElement("a");
      link.href = candidate.cvData.data;
      link.download = candidate.cvData.fileName || `${candidate.name}_CV.pdf`;
      link.click();
    }
  };

  const handleContactCandidate = (candidate) => {
    window.open(
      `mailto:${candidate.email}?subject=Interest in your profile&body=Hello ${candidate.name},`,
      "_blank"
    );
  };

  const handleScheduleMeeting = (candidate) => {
    const meetingLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting with ${candidate.name}&details=Discussion about potential opportunity`;
    window.open(meetingLink, "_blank");
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      "Not Applied": [], // No manual actions for "Not Applied"
      Applied: ["Reviewing", "Rejected"], // Recruiter can start review or reject
      Reviewing: ["Interview", "Rejected"],
      Interview: ["Hired", "Rejected"],
      Hired: [],
      Rejected: ["Applied"], // Allow re-application
    };

    return statusFlow[currentStatus] || [];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Not Applied":
        return <PersonIcon sx={{ fontSize: 16 }} />;
      case "Applied":
        return <SendIcon sx={{ fontSize: 16 }} />;
      case "Reviewing":
        return <ScheduleIcon sx={{ fontSize: 16 }} />;
      case "Interview":
        return <CalendarIcon sx={{ fontSize: 16 }} />;
      case "Hired":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getSkillsArray = (candidate) => {
    if (!candidate.skills) return [];
    if (Array.isArray(candidate.skills)) return candidate.skills;
    if (typeof candidate.skills === "string") {
      return candidate.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }
    return [];
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
        placeholder="Search candidates by name, title, skills, experience, or education..."
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
              zIndex: 1,
              minWidth: "auto",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              px: { xs: 1, sm: 2 },
            },
            "& .Mui-selected": {
              color: "#0A0A1A !important",
              fontWeight: 600,
            },
          }}
        >
          <StyledTab label={isMobile ? "All" : "All Candidates"} />
          <StyledTab label={isMobile ? "New" : "New"} />
          <StyledTab label={isMobile ? "Review" : "Reviewing"} />
          <StyledTab label={isMobile ? "Interview" : "Interview"} />
        </Tabs>
      </AppBar>

      {/* Status Update Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
        PaperProps={{
          sx: {
            background: "rgba(26, 26, 46, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {selectedCandidateForStatus &&
          getNextStatusOptions(selectedCandidateForStatus.status).map(
            (status) => (
              <MenuItem
                key={status}
                onClick={() =>
                  handleStatusUpdate(selectedCandidateForStatus.userId, status)
                }
                disabled={updatingStatus}
                sx={{ color: "white" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusIcon(status)}
                  <Typography>Move to {status}</Typography>
                </Box>
              </MenuItem>
            )
          )}
        {selectedCandidateForStatus &&
          getNextStatusOptions(selectedCandidateForStatus.status).length ===
            0 && (
            <MenuItem disabled sx={{ color: "rgba(255,255,255,0.5)" }}>
              No further actions available
            </MenuItem>
          )}
      </Menu>

      {/* Candidate Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 8, mt: 8 }}>
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
          filteredCandidates.map((candidate, index) => {
            const skillsArray = getSkillsArray(candidate);
            const hasCV = candidate.cvData && candidate.cvData.data;
            const statusColor = getStatusColor(candidate.status);

            return (
              <Grid item xs={12} sm={6} lg={4} key={candidate.userId || index}>
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
                    {/* Status Chip and Menu */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={candidate.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                          fontWeight: "bold",
                          minWidth: 80,
                        }}
                        icon={getStatusIcon(candidate.status)}
                      />
                      {user?.role === "recruiter" && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleStatusMenuOpen(e, candidate)}
                          sx={{ color: "rgba(255,255,255,0.7)" }}
                          disabled={updatingStatus}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        color: "#ffffffff",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                      }}
                    >
                      {candidate.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#E94560",
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {candidate.title}
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
                      {candidate.experience}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      <strong style={{ color: "#FFD700" }}>Education:</strong>{" "}
                      {candidate.education}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      <strong style={{ color: "#FFD700" }}>Skills:</strong>{" "}
                      {candidate.skills || "No skills listed"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {skillsArray
                        .slice(0, isMobile ? 2 : 4)
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
                      {skillsArray.length > (isMobile ? 2 : 4) && (
                        <Chip
                          label={`+${skillsArray.length - (isMobile ? 2 : 4)}`}
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
                    {/* CV Button */}
                    {hasCV ? (
                      <Button
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleViewCV(candidate)}
                        sx={{
                          color: "#FFD700",
                          borderColor: "#FFD700",
                          "&:hover": {
                            backgroundColor: "#FFD700",
                            color: "#0A0A1A",
                          },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          minWidth: { xs: "100%", sm: "auto" },
                          fontWeight: 600,
                        }}
                        startIcon={
                          <DescriptionIcon
                            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                          />
                        }
                      >
                        View CV
                      </Button>
                    ) : (
                      <Tooltip
                        title="This candidate hasn't uploaded a CV yet"
                        arrow
                      >
                        <Button
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                          disabled
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            minWidth: { xs: "100%", sm: "auto" },
                            cursor: "not-allowed",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            },
                          }}
                          startIcon={
                            <BlockIcon
                              sx={{
                                fontSize: { xs: "1rem", sm: "1.25rem" },
                                color: "rgba(255, 255, 255, 0.5)",
                              }}
                            />
                          }
                        >
                          No CV
                        </Button>
                      </Tooltip>
                    )}

                    {/* Contact/Schedule Buttons */}
                    {candidate.title &&
                    candidate.title.includes("Blockchain") ? (
                      <Button
                        variant="contained"
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleScheduleMeeting(candidate)}
                        sx={{
                          backgroundColor: "#E94560",
                          "&:hover": {
                            backgroundColor: "#D42A45",
                          },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          minWidth: { xs: "100%", sm: "auto" },
                          fontWeight: 600,
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
                        onClick={() => handleContactCandidate(candidate)}
                        sx={{
                          backgroundColor: "#E94560",
                          "&:hover": {
                            backgroundColor: "#D42A45",
                          },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          minWidth: { xs: "100%", sm: "auto" },
                          fontWeight: 600,
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
            );
          })
        )}
      </Grid>

      {/* CV Viewer Dialog */}
      <Dialog
        open={cvDialogOpen}
        onClose={handleCloseCvDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
            border: "1px solid rgba(76, 201, 240, 0.3)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              "linear-gradient(135deg, rgba(76, 201, 240, 0.2) 0%, rgba(76, 201, 240, 0.1) 100%)",
            borderBottom: "1px solid rgba(76, 201, 240, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#4CC9F0", fontWeight: "bold" }}
          >
            CV - {selectedCandidate?.name}
          </Typography>
          <IconButton
            onClick={handleCloseCvDialog}
            sx={{
              color: "#4CC9F0",
              "&:hover": {
                backgroundColor: "rgba(76, 201, 240, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: "70vh" }}>
          {selectedCandidate?.cvData?.data ? (
            <iframe
              src={selectedCandidate.cvData.data}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "0 0 16px 16px" }}
              title={`CV Preview - ${selectedCandidate.name}`}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 2,
                p: 4,
                textAlign: "center",
              }}
            >
              <BlockIcon
                sx={{
                  fontSize: 64,
                  color: "rgba(255, 255, 255, 0.3)",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 1,
                }}
              >
                No CV Available
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  maxWidth: 400,
                }}
              >
                {selectedCandidate?.name} hasn't uploaded a CV yet. Please
                contact them directly for more information.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            background: "rgba(26, 26, 46, 0.8)",
            borderTop: "1px solid rgba(76, 201, 240, 0.3)",
            py: 2,
            px: 3,
          }}
        >
          <Button
            onClick={handleCloseCvDialog}
            sx={{
              color: "#4CC9F0",
              borderColor: "#4CC9F0",
              "&:hover": {
                backgroundColor: "rgba(76, 201, 240, 0.1)",
              },
            }}
          >
            Close
          </Button>
          {selectedCandidate?.cvData?.data && (
            <Button
              onClick={() => downloadCV(selectedCandidate)}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #4CC9F0 0%, #2A9ED8 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2A9ED8 0%, #4CC9F0 100%)",
                },
              }}
            >
              Download CV
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CandidatesList;

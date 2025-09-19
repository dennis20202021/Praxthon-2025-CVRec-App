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
  IconButton,
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import axios from "axios";
import AuthDialog from "./AuthDialog";
import { Close as CloseIcon } from "@mui/icons-material";

// Custom scrollbar styles
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "linear-gradient(135deg, #0A0A1A 0%, #16213E 100%)",
    color: "white",
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
    "&::-webkit-scrollbar-thumb:hover": {
      background:
        "linear-gradient(110deg, #e94560 0%, #ffd700 50%, #e94560 100%)",
    },
    // For Firefox
    scrollbarWidth: "thin",
    scrollbarColor: "#ffd700 rgba(26, 26, 46, 0.3)",
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
    "&::-webkit-scrollbar-thumb:hover": {
      background:
        "linear-gradient(110deg, #e94560 0%, #ffd700 50%, #e94560 100%)",
    },
    // For Firefox
    scrollbarWidth: "thin",
    scrollbarColor: "#ffd700 rgba(26, 26, 46, 0.3)",
  },
}));

function JobListings({ user }) {
  const [jobs, setJobs] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("all-levels");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("apply");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [progress, setProgress] = useState(100);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let timer;
    if (showMessage) {
      setProgress(100);
      timer = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - 100 / 25)); // 5 seconds = 25 intervals of 200ms
      }, 200);

      const timeout = setTimeout(() => {
        setShowMessage(false);
        clearInterval(timer);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        clearInterval(timer);
      };
    }
  }, [showMessage]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/jobs");
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showMessageWithType("Failed to load jobs", "error");
    }
  };

  const showMessageWithType = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
  };

  const hasUserApplied = (job) => {
    if (!user || !job.applicants) return false;

    // Check both email and name to ensure we catch the application
    // Blockchain might store data slightly differently
    const hasApplied = job.applicants.some(
      (applicant) =>
        applicant.applicantEmail === user.email ||
        applicant.email === user.email ||
        applicant.applicantName === user.name ||
        applicant.name === user.name
    );

    console.log("User applied check:", {
      userEmail: user.email,
      userName: user.name,
      applicants: job.applicants,
      hasApplied,
    });

    return hasApplied;
  };

  const handleApply = async (jobId, jobTitle) => {
    // Check if user is authenticated and is a candidate
    if (!user) {
      setDialogType("apply");
      setAuthDialogOpen(true);
      return;
    }

    if (user.role !== "candidate") {
      // Show auth dialog for recruiters trying to apply
      setDialogType("apply");
      setAuthDialogOpen(true);
      return;
    }

    try {
      // Check if user has already applied to this job
      const job = jobs.find((j) => j.jobId === jobId);
      if (hasUserApplied(job)) {
        showMessageWithType(
          `You have already applied to "${jobTitle}"`,
          "error"
        );
        return;
      }

      const applicantData = {
        applicantName: user.name,
        applicantEmail: user.email,
        coverLetter: `Application from ${user.name} for this position`,
      };

      const response = await axios.post(
        `/api/jobs/${jobId}/apply`,
        applicantData
      );

      if (response.data.success) {
        showMessageWithType(
          `Application submitted successfully for "${jobTitle}"!`,
          "success"
        );
        // Refresh jobs to show updated application status
        fetchJobs();
      } else {
        showMessageWithType(
          response.data.error || "Failed to apply for job",
          "error"
        );
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error.response?.data?.error?.includes("already applied")) {
        showMessageWithType(
          `You have already applied to "${jobTitle}"`,
          "error"
        );
        // Refresh to get updated application status
        fetchJobs();
      } else {
        showMessageWithType(
          "Failed to apply for job. Please try again.",
          "error"
        );
      }
    }
  };

  // Function to strip HTML tags from rich text
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const plainText = stripHtmlTags(text);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const handleJobCardClick = (job) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const handleJobDialogClose = () => {
    setJobDialogOpen(false);
    setSelectedJob(null);
  };

  const getWorkLocationChip = (job) => {
    console.log("Job work location data:", {
      workLocationType: job.workLocationType,
      remote: job.remote,
      hybrid: job.hybrid,
      jobId: job.jobId,
      title: job.title,
    });

    // First check for the new workLocationType field (various possible formats)
    if (job.workLocationType) {
      const locationType = job.workLocationType.toLowerCase();

      if (locationType.includes("remote")) {
        return (
          <Chip
            label="Remote"
            size="small"
            sx={{
              ml: 1,
              color: "#4CC9F0",
              borderColor: "#4CC9F0",
              backgroundColor: "rgba(76, 201, 240, 0.1)",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        );
      }

      if (locationType.includes("hybrid")) {
        return (
          <Chip
            label="Hybrid"
            size="small"
            sx={{
              ml: 1,
              color: "#FFD700",
              borderColor: "#FFD700",
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        );
      }

      if (
        locationType.includes("on-site") ||
        locationType.includes("onsite") ||
        locationType.includes("on_site")
      ) {
        return (
          <Chip
            label="On-site"
            size="small"
            sx={{
              ml: 1,
              color: "#E94560",
              borderColor: "#E94560",
              backgroundColor: "rgba(233, 69, 96, 0.1)",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
        );
      }
    }

    // Fallback to check for individual boolean fields
    if (job.remote) {
      return (
        <Chip
          label="Remote"
          size="small"
          sx={{
            ml: 1,
            color: "#4CC9F0",
            borderColor: "#4CC9F0",
            backgroundColor: "rgba(76, 201, 240, 0.1)",
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }

    if (job.hybrid) {
      return (
        <Chip
          label="Hybrid"
          size="small"
          sx={{
            ml: 1,
            color: "#FFD700",
            borderColor: "#FFD700",
            backgroundColor: "rgba(255, 215, 0, 0.1)",
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }

    // If no location type is specified, assume it's on-site
    return (
      <Chip
        label="On-site"
        size="small"
        sx={{
          ml: 1,
          color: "#E94560",
          borderColor: "#E94560",
          backgroundColor: "rgba(233, 69, 96, 0.1)",
          fontSize: "0.7rem",
          height: "20px",
        }}
      />
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom sx={{ color: "#FFD700" }}>
        Available Jobs
      </Typography>

      {/* Message Snackbar */}
      <Snackbar
        open={showMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ width: "100%" }}>
          <Alert
            severity={message.type}
            sx={{
              width: "100%",
              alignItems: "center",
              "& .MuiAlert-message": {
                flexGrow: 1,
              },
            }}
          >
            {message.text}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 1,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "rgba(255,255,255,0.7)",
                },
              }}
            />
          </Alert>
        </Box>
      </Snackbar>

      {/* Search Section */}
      <Card
        sx={{
          mb: 4,
          p: 3,
          background: "rgba(26, 26, 46, 0.8)",
          color: "white",
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: "#FFD700" }}>
          Find Your Dream Job
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Job title, keywords"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              variant="outlined"
              label="Experience Level"
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              <MenuItem value="all-levels">All Levels</MenuItem>
              <MenuItem value="entry">Entry Level</MenuItem>
              <MenuItem value="mid">Mid Level</MenuItem>
              <MenuItem value="senior">Senior Level</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: "56px",
                backgroundColor: "#E94560",
                "&:hover": {
                  backgroundColor: "#D42A45",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Job Listings */}
      <Grid container spacing={3}>
        {filteredJobs.map((job, index) => {
          const userApplied = hasUserApplied(job);
          const totalApplicants = job.applicants ? job.applicants.length : 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  width: "335px", // Fixed width
                  minHeight: "360px", // Fixed minimum height
                  maxHeight: "400px", // Maximum height to prevent overflow
                  overflow: "hidden", // Hide overflow
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                  },
                }}
                onClick={() => handleJobCardClick(job)}
              >
                <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        color: "#4CC9F0",
                        flex: 1,
                        fontSize: "1.25rem",
                        lineHeight: "1.4",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {job.title}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#FFD700",
                        "&:hover": {
                          backgroundColor: "rgba(255, 215, 0, 0.1)",
                        },
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#E94560",
                      mb: 1,
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {job.company} • {job.location}
                    {getWorkLocationChip(job)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      mb: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      minHeight: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {truncateText(job.description, 80)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      minHeight: "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    <strong style={{ color: "#FFD700" }}>Requirements:</strong>{" "}
                    {truncateText(job.requirements, 60)}
                  </Typography>

                  {/* Application Status Section */}
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {user ? (
                      <>
                        {userApplied ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#00CC99", fontSize: "1.2rem" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#00CC99",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                              }}
                            >
                              Applied ✓
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CancelIcon
                              sx={{ color: "#E94560", fontSize: "1.2rem" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#E94560",
                                opacity: 0.8,
                                fontSize: "0.8rem",
                              }}
                            >
                              Not Applied
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            ml: 1,
                            fontSize: "0.7rem",
                          }}
                        >
                          ({totalApplicants} total applicant
                          {totalApplicants !== 1 ? "s" : ""})
                        </Typography>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {totalApplicants} applicant
                        {totalApplicants !== 1 ? "s" : ""}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#0077B5",
                        backgroundColor: "rgba(0, 119, 181, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(0, 119, 181, 0.2)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add LinkedIn functionality here if needed
                        console.log("LinkedIn icon clicked");
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#FF6B35",
                        backgroundColor: "rgba(255, 107, 53, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 107, 53, 0.2)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add website functionality here if needed
                        console.log("Website icon clicked");
                      }}
                    >
                      <LanguageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#9D50BB",
                        backgroundColor: "rgba(157, 80, 187, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(157, 80, 187, 0.2)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add work functionality here if needed
                        console.log("Work icon clicked");
                      }}
                    >
                      <WorkIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#FFD700", fontSize: "1rem" }}
                  >
                    {job.salary}
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={userApplied}
                    sx={{
                      backgroundColor: userApplied ? "#00CC99" : "#E94560",
                      fontSize: "0.8rem",
                      px: 1.5,
                      py: 0.5,
                      "&:hover": {
                        backgroundColor: userApplied ? "#00B386" : "#D42A45",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "rgba(0, 204, 153, 0.3)",
                        color: "white",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job.jobId, job.title);
                    }}
                  >
                    {userApplied ? "Applied" : "Apply Now"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Job Detail Dialog */}
      <StyledDialog
        open={jobDialogOpen}
        onClose={handleJobDialogClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedJob && (
          <>
            <DialogTitle sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
              <Typography variant="h4" sx={{ color: "#4CC9F0" }}>
                {selectedJob.title}
              </Typography>
              <Typography variant="h6" sx={{ color: "#E94560", mt: 1 }}>
                {selectedJob.company} • {selectedJob.location}
                {getWorkLocationChip(selectedJob)}
              </Typography>
              <Typography variant="h5" sx={{ color: "#FFD700", mt: 2 }}>
                {selectedJob.salary}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4" sx={{ color: "#FFD700", mb: 1 }}>
                  Job Description
                </Typography>
                <Box
                  sx={{
                    mb: 3,
                    "& p": { marginBottom: "1rem" },
                    "& ul, & ol": {
                      paddingLeft: "1.5rem",
                      marginBottom: "1rem",
                    },
                    "& li": { marginBottom: "0.5rem" },
                    "& strong": { color: "#FFD700" },
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />

                <Typography variant="h4" sx={{ color: "#FFD700", mb: 1 }}>
                  Requirements
                </Typography>
                <Box
                  sx={{
                    mb: 3,
                    "& p": { marginBottom: "1rem" },
                    "& ul, & ol": {
                      paddingLeft: "1.5rem",
                      marginBottom: "1rem",
                    },
                    "& li": { marginBottom: "0.5rem" },
                    "& strong": { color: "#FFD700" },
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedJob.requirements }}
                />

                {selectedJob.applicants && (
                  <>
                    <Typography variant="h6" sx={{ color: "#FFD700", mb: 1 }}>
                      Applicants
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedJob.applicants.length} applicant
                      {selectedJob.applicants.length !== 1 ? "s" : ""}
                    </Typography>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
              <Button
                onClick={handleJobDialogClose}
                startIcon={<CloseIcon />}
                variant="outlined"
                sx={{
                  color: "#E94560",
                  borderColor: "#E94560",
                  "&:hover": {
                    backgroundColor: "rgba(233, 69, 96, 0.1)",
                    borderColor: "#D42A45",
                    color: "#D42A45",
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                disabled={user && hasUserApplied(selectedJob)}
                sx={{
                  backgroundColor:
                    user && hasUserApplied(selectedJob) ? "#00CC99" : "#E94560",
                  "&:hover": {
                    backgroundColor:
                      user && hasUserApplied(selectedJob)
                        ? "#00B386"
                        : "#D42A45",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(0, 204, 153, 0.3)",
                    color: "white",
                  },
                }}
                onClick={() =>
                  handleApply(selectedJob.jobId, selectedJob.title)
                }
              >
                {user && hasUserApplied(selectedJob)
                  ? "Already Applied"
                  : "Apply Now"}
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        type={dialogType}
      />
    </Box>
  );
}

export default JobListings;

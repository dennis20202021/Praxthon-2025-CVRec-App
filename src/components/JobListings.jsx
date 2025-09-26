import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
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
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import axios from "axios";
import AuthDialog from "./AuthDialog";
import JobCard from "./JobCard";
import JobForm from "./JobForm";

// Your exact custom scrollbar styles
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
  const [editingJob, setEditingJob] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
        setProgress((prev) => Math.max(0, prev - 100 / 25));
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

    const hasApplied = job.applicants.some(
      (applicant) =>
        applicant.applicantEmail === user.email ||
        applicant.email === user.email ||
        applicant.applicantName === user.name ||
        applicant.name === user.name
    );

    return hasApplied;
  };

  const handleApply = async (jobId, jobTitle) => {
    if (!user) {
      setDialogType("apply");
      setAuthDialogOpen(true);
      return;
    }

    if (user.role !== "candidate") {
      setDialogType("apply");
      setAuthDialogOpen(true);
      return;
    }

    try {
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
        status: "Applied", // Ensure status is set when applying
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
        fetchJobs();

        // Also update candidate status in the system
        try {
          await axios.put(`/api/candidates/${user.userId}/status`, {
            status: "Applied",
          });
        } catch (statusError) {
          console.error("Error updating candidate status:", statusError);
        }
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      if (error.response?.data?.error?.includes("already applied")) {
        showMessageWithType(
          `You have already applied to "${jobTitle}"`,
          "error"
        );
        fetchJobs();
      } else {
        showMessageWithType(
          "Failed to apply for job. Please try again.",
          "error"
        );
      }
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setEditDialogOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await axios.delete(`/api/jobs/${jobId}`);
      if (response.data.success) {
        showMessageWithType("Job deleted successfully!", "success");
        fetchJobs();
      }
    } catch (error) {
      showMessageWithType(
        error.response?.data?.error || "Failed to delete job",
        "error"
      );
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      const response = await axios.put(
        `/api/jobs/${editingJob.jobId}`,
        jobData
      );
      if (response.data.success) {
        showMessageWithType("Job updated successfully!", "success");
        setEditDialogOpen(false);
        setEditingJob(null);
        fetchJobs();
      }
    } catch (error) {
      showMessageWithType(
        error.response?.data?.error || "Failed to update job",
        "error"
      );
    }
  };

  const handleJobCardClick = (job) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const handleJobDialogClose = () => {
    setJobDialogOpen(false);
    setSelectedJob(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.description &&
        job.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <Box sx={{ p: 3, mb: 8 }}>
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

      {/* Your exact search section */}
      <Card
        sx={{
          mb: 8,
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
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Job Listings using reusable JobCard */}
      <Grid container spacing={3}>
        {filteredJobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={job.jobId || index}>
            <JobCard
              job={job}
              user={user}
              onApply={handleApply}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              hasUserApplied={hasUserApplied}
              onCardClick={handleJobCardClick}
            />
          </Grid>
        ))}
      </Grid>

      {/* Your exact job detail dialog */}
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
              </Typography>
              <Typography variant="h5" sx={{ color: "#FFD700", mt: 2 }}>
                {selectedJob.salary}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" sx={{ color: "#FFD700", mb: 1 }}>
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

                <Typography variant="h5" sx={{ color: "#FFD700", mb: 1 }}>
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

      {/* Edit Job Dialog */}
      <StyledDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(26, 26, 46, 0.8)",
          }}
        >
          <Typography variant="h4" sx={{ color: "#4CC9F0" }}>
            Edit Job
          </Typography>
          <IconButton onClick={handleEditDialogClose} sx={{ color: "#E94560" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ background: "rgba(26, 26, 46, 0.8)" }}>
          {editingJob && (
            <JobForm
              user={user}
              jobData={editingJob}
              onSubmit={handleUpdateJob}
              loading={false}
              submitText="Update Job"
            />
          )}
        </DialogContent>
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

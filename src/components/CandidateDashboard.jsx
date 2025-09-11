import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  Tabs,
  Tab,
  AppBar,
  IconButton,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

function CandidateDashboard({ onLogout, user }) {
  const [tabValue, setTabValue] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const jobListings = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "New York, NY",
      description: "We are looking for an experienced frontend developer with React expertise to join our growing team.",
      requirements: "5+ years experience, React, JavaScript, HTML/CSS",
      salary: "$120k - $150k",
      remote: false,
    },
    {
      title: "UX/UI Designer",
      company: "DesignHub",
      location: "Remote",
      description: "Join our design team to create beautiful and functional user interfaces for our clients.",
      requirements: "3+ years experience, Figma, Sketch, Adobe XD",
      salary: "$80k - $110k",
      remote: true,
    },
    {
      title: "Blockchain Developer",
      company: "CryptoInnovations",
      location: "San Francisco, CA",
      description: "Seeking a blockchain developer with Hyperledger Fabric experience to build enterprise solutions.",
      requirements: "4+ years experience, Hyperledger, Node.js, Go",
      salary: "$140k - $180k",
      remote: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Candidate Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Welcome, {user?.name || "John Doe"}! Here are your job matches.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Search Section */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Find Your Dream Job
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Job title, keywords"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Location"
              variant="outlined"
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
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="entry">Entry Level</MenuItem>
              <MenuItem value="mid">Mid Level</MenuItem>
              <MenuItem value="senior">Senior Level</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="contained" color="error" sx={{ height: "56px" }}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <AppBar position="static" sx={{ mb: 3, borderRadius: 1 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="All Jobs" />
          <Tab label="Recent" />
          <Tab label="Saved" />
        </Tabs>
      </AppBar>

      {/* Job Listings */}
      <Grid container spacing={3}>
        {jobListings.map((job, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  {job.company} • {job.location}
                  {job.remote && <Chip label="Remote" size="small" sx={{ ml: 1 }} />}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {job.description}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  <strong>Requirements:</strong> {job.requirements}
                </Typography>
                <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                  <IconButton size="small">
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton size="small">
                    <LanguageIcon />
                  </IconButton>
                  <IconButton size="small">
                    <WorkIcon />
                  </IconButton>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Typography variant="h6" color="warning.main">
                  {job.salary}
                </Typography>
                <Button variant="contained" color="error">
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CandidateDashboard;
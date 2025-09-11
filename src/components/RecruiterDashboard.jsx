import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  AppBar,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

function RecruiterDashboard({ onLogout, user }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const candidates = [
    {
      name: "Michael Johnson",
      title: "Senior Software Engineer",
      experience: "7 years",
      skills: "JavaScript, React, Node.js, AWS",
      education: "MIT, Computer Science",
    },
    {
      name: "Sarah Williams",
      title: "UX Designer",
      experience: "5 years",
      skills: "Figma, User Research, Prototyping",
      education: "RISD, Design",
    },
    {
      name: "David Chen",
      title: "Blockchain Developer",
      experience: "4 years",
      skills: "Hyperledger, Solidity, Smart Contracts",
      education: "Stanford, Computer Science",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Recruiter Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Welcome, {user?.name || "Jane Smith"}! Manage your job postings and candidates.
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

      {/* Tabs */}
      <AppBar position="static" sx={{ mb: 3, borderRadius: 1 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Job Postings" />
          <Tab label="Candidates" />
          <Tab label="Analytics" />
        </Tabs>
      </AppBar>

      {/* Action Button */}
      <Button
        variant="contained"
        color="error"
        startIcon={<AddIcon />}
        sx={{ mb: 3 }}
      >
        Post New Job
      </Button>

      {/* Candidate Cards */}
      <Grid container spacing={3}>
        {candidates.map((candidate, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  {candidate.name}
                </Typography>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  {candidate.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Experience:</strong> {candidate.experience}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Skills:</strong> {candidate.skills}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Education:</strong> {candidate.education}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {candidate.skills.split(", ").map((skill, i) => (
                    <Chip key={i} label={skill} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button variant="outlined" color="warning" startIcon={<DescriptionIcon />}>
                  View CV
                </Button>
                {candidate.title === "Blockchain Developer" ? (
                  <Button variant="contained" color="error" startIcon={<CalendarIcon />}>
                    Schedule Meeting
                  </Button>
                ) : (
                  <Button variant="contained" color="error" startIcon={<EmailIcon />}>
                    Contact
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecruiterDashboard;
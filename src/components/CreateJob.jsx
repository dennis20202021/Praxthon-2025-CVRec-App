import { useState, useEffect } from "react";
import { Snackbar, Alert, LinearProgress, Box } from "@mui/material";
import axios from "axios";
import JobForm from "./JobForm";

function CreateJob({ user }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [progress, setProgress] = useState(100);
  const [formKey, setFormKey] = useState(0); // Add this to reset the form

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

  const showMessageWithType = (text, type) => {
    setMessage({ text, type });
    setShowMessage(true);
  };

  const handleSubmit = async (jobData) => {
    setLoading(true);
    setShowMessage(false);

    try {
      const response = await axios.post("/api/jobs", jobData);
      if (response.data.success) {
        showMessageWithType("Job posted successfully!", "success");
        // Reset the form by changing the key
        setFormKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      showMessageWithType(
        error.response?.data?.error || "Failed to create job",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
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

      <JobForm
        key={formKey} // This will reset the form when key changes
        user={user}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Post Job"
      />
    </Box>
  );
}

export default CreateJob;

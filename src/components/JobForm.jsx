import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  School as RequirementsIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import countriesCurrencyData from "../countriesCurrencyData";

function JobForm({
  user,
  jobData,
  onSubmit,
  loading,
  submitText = "Post Job",
}) {
  const [salaryFrequency, setSalaryFrequency] = useState("month");
  const [currency, setCurrency] = useState("USD");
  const [workLocationType, setWorkLocationType] = useState("on-site");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  const getAvailableCurrencies = () => {
    const uniqueCurrencies = [];
    const seenCurrencies = new Set();

    countriesCurrencyData.forEach((country) => {
      if (!seenCurrencies.has(country.currency)) {
        seenCurrencies.add(country.currency);
        uniqueCurrencies.push({
          code: country.currency,
          symbol: country.symbol,
          name: country.name,
          flag: country.flag,
        });
      }
    });

    return uniqueCurrencies.sort((a, b) => a.code.localeCompare(b.code));
  };

  const availableCurrencies = getAvailableCurrencies();

  // Get current currency symbol
  const getCurrentCurrencySymbol = () => {
    const currentCurrency = availableCurrencies.find(
      (curr) => curr.code === currency
    );
    return currentCurrency ? currentCurrency.symbol : currency;
  };

  // Get current currency name
  const getCurrency = () => {
    const currentCurrency = availableCurrencies.find(
      (curr) => curr.code === currency
    );
    return currentCurrency ? currentCurrency.code : currency;
  };

  // React Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  // Initialize form with job data if provided (for editing)
  useEffect(() => {
    if (jobData) {
      // Parse salary if it exists (format: "USD 5000/month")
      if (jobData.salary) {
        const salaryMatch = jobData.salary.match(/([A-Z]{3}) (\d+)\/(\w+)/);
        if (salaryMatch) {
          setCurrency(salaryMatch[1]);
          setSalaryAmount(salaryMatch[2]);
          setSalaryFrequency(salaryMatch[3]);
        }
      }

      setWorkLocationType(jobData.workLocationType || "on-site");
      setDescription(jobData.description || "");
      setRequirements(jobData.requirements || "");
    }
  }, [jobData]);

  const handleWorkLocationChange = (type) => {
    setWorkLocationType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the salary with currency and frequency for display
    const salary = `${currency} ${salaryAmount}/${salaryFrequency}`;

    const formData = {
      title: e.target.title.value,
      company: e.target.company.value,
      location: e.target.location.value,
      description: description,
      requirements: requirements,
      salary: salary,
      workLocationType: workLocationType,
      salaryAmount: salaryAmount,
      salaryCurrency: currency,
      salaryFrequency: salaryFrequency,
    };

    await onSubmit(formData);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto", mb: 8 }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          color: "#FFD700",
          mb: 4,
          textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        <WorkIcon sx={{ mr: 2, fontSize: 40, verticalAlign: "bottom" }} />
        {jobData ? "Edit Job Posting" : "Create Job Posting"}
      </Typography>

      <Card
        sx={{
          background: "rgba(26, 26, 46, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 215, 0, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* ==================== BASIC INFORMATION SECTION ==================== */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#4CC9F0",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WorkIcon sx={{ mr: 1 }} /> Basic Information
              </Typography>
              <Divider
                sx={{ backgroundColor: "rgba(76, 201, 240, 0.3)", mb: 3 }}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Job Title"
                    required
                    defaultValue={jobData?.title || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ color: "#4CC9F0" }}
                        >
                          <WorkIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": { borderColor: "#4CC9F0" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="company"
                    label="Company"
                    required
                    defaultValue={jobData?.company || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ color: "#4CC9F0" }}
                        >
                          <BusinessIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": { borderColor: "#4CC9F0" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    required
                    defaultValue={jobData?.location || ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ color: "#4CC9F0" }}
                        >
                          <LocationIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": { borderColor: "#4CC9F0" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={workLocationType === "remote"}
                          onChange={(e) => handleWorkLocationChange("remote")}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#4CC9F0",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#4CC9F0",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                          Remote Position
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={workLocationType === "hybrid"}
                          onChange={(e) => handleWorkLocationChange("hybrid")}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#FFD700",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#FFD700",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                          Hybrid Position
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={workLocationType === "on-site"}
                          onChange={(e) => handleWorkLocationChange("on-site")}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#E94560",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#E94560",
                              },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                          On-site Position
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* ==================== SALARY SECTION ==================== */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#FFD700",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MoneyIcon sx={{ mr: 1 }} /> Salary Details
              </Typography>
              <Divider
                sx={{ backgroundColor: "rgba(255, 215, 0, 0.3)", mb: 3 }}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="salaryAmount"
                    label="Salary Amount"
                    type="number"
                    required
                    value={salaryAmount || ""}
                    onChange={(e) => setSalaryAmount(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ color: "#FFD700" }}
                        >
                          {`${getCurrency()} ${getCurrentCurrencySymbol()}`}{" "}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": { color: "white" },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover fieldset": { borderColor: "#FFD700" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Currency
                    </InputLabel>
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      label="Currency"
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FFD700",
                        },
                      }}
                    >
                      {availableCurrencies.map((curr) => (
                        <MenuItem key={curr.code} value={curr.code}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={curr.flag}
                              alt={curr.name}
                              style={{
                                width: "20px",
                                height: "15px",
                                marginRight: "8px",
                                borderRadius: "2px",
                              }}
                            />
                            {curr.code} ({curr.symbol}) - {curr.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Frequency
                    </InputLabel>
                    <Select
                      value={salaryFrequency}
                      onChange={(e) => setSalaryFrequency(e.target.value)}
                      label="Frequency"
                      sx={{
                        color: "white",
                        "& .MuiSvgIcon-root": { color: "white" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#FFD700",
                        },
                      }}
                    >
                      <MenuItem value="hour">Per Hour</MenuItem>
                      <MenuItem value="day">Per Day</MenuItem>
                      <MenuItem value="week">Per Week</MenuItem>
                      <MenuItem value="month">Per Month</MenuItem>
                      <MenuItem value="year">Per Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* ==================== JOB DESCRIPTION SECTION ==================== */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#E94560",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DescriptionIcon sx={{ mr: 1 }} /> Job Description
              </Typography>
              <Divider
                sx={{ backgroundColor: "rgba(233, 69, 96, 0.3)", mb: 3 }}
              />

              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "4px",
                  "& .ql-toolbar": {
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3) !important",
                  },
                  "& .ql-container": {
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                    borderColor: "rgba(255, 255, 255, 0.3) !important",
                    minHeight: "200px",
                    color: "white",
                    fontFamily: "inherit",
                  },
                  "& .ql-editor": {
                    minHeight: "200px",
                  },
                  "& .ql-stroke": {
                    stroke: "white !important",
                  },
                  "& .ql-fill": {
                    fill: "white !important",
                  },
                  "& .ql-picker": {
                    color: "white !important",
                  },
                  "& .ql-picker-options": {
                    backgroundColor: "#1a1a2e",
                  },
                }}
              >
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
              </Box>
            </Box>

            {/* ==================== REQUIREMENTS SECTION ==================== */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#00CC99",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RequirementsIcon sx={{ mr: 1 }} /> Requirements
              </Typography>
              <Divider
                sx={{ backgroundColor: "rgba(0, 204, 153, 0.3)", mb: 3 }}
              />

              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "4px",
                  "& .ql-toolbar": {
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.3) !important",
                  },
                  "& .ql-container": {
                    borderBottomLeftRadius: "4px",
                    borderBottomRightRadius: "4px",
                    borderColor: "rgba(255, 255, 255, 0.3) !important",
                    minHeight: "200px",
                    color: "white",
                    fontFamily: "inherit",
                  },
                  "& .ql-editor": {
                    minHeight: "200px",
                  },
                  "& .ql-stroke": {
                    stroke: "white !important",
                  },
                  "& .ql-fill": {
                    fill: "white !important",
                  },
                  "& .ql-picker": {
                    color: "white !important",
                  },
                  "& .ql-picker-options": {
                    backgroundColor: "#1a1a2e",
                  },
                }}
              >
                <ReactQuill
                  value={requirements}
                  onChange={setRequirements}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 2,
                height: "50px",
                fontSize: "1.1rem",
                backgroundColor: "#E94560",
                "&:hover": {
                  backgroundColor: "#D42A45",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 12px rgba(233, 69, 96, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : submitText}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default JobForm;

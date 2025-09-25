import { useState } from "react";
import {
  TextField,
  MenuItem,
  Avatar,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import countries from "../countriesData";

function CountryCodeSelector({ value, onChange, disabled = false, sx = {} }) {
  const [open, setOpen] = useState(false);

  const selectedCountry =
    countries.find((country) => country.code === value) || countries[0];

  return (
    <TextField
      select
      label="Country Code"
      value={value}
      onChange={onChange}
      onFocus={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled}
      sx={{
        minWidth: 140,
        "& .MuiInputBase-input": { color: "white" },
        "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.3)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.5)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#4CC9F0",
        },
        ...sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                src={selectedCountry.flag}
                sx={{ width: 24, height: 24 }}
                alt={selectedCountry.name}
              />
              <Typography
                sx={{
                  color: "white",
                  fontSize: "14px",
                  minWidth: "35px",
                }}
              >
                {selectedCountry.dialCode}
              </Typography>
            </Box>
          </InputAdornment>
        ),
      }}
      SelectProps={{
        renderValue: () => "", // Hide the default rendered value since we're using the adornment
      }}
    >
      {countries.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          <ListItemIcon>
            <Avatar
              src={country.flag}
              sx={{ width: 20, height: 20 }}
              alt={country.name}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ color: "white", minWidth: "45px" }}>
                  {country.dialCode}
                </Typography>
                <Typography sx={{ color: "white" }}>{country.name}</Typography>
              </Box>
            }
          />
        </MenuItem>
      ))}
    </TextField>
  );
}

export default CountryCodeSelector;

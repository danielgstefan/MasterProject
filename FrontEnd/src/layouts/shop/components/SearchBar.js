import { useState } from "react";

// @mui material components
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

function SearchBar({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <VuiBox>
      <TextField
        fullWidth
        placeholder="Search for BMW parts..."
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                sx={{
                  color: isFocused ? "info.main" : "white",
                  transition: "color 0.2s ease-in-out",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 19L14.65 14.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "8px",
            "& fieldset": {
              borderColor: isFocused ? "info.main" : "rgba(255, 255, 255, 0.2)",
              transition: "border-color 0.2s ease-in-out",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "info.main",
            },
          },
          "& .MuiInputBase-input": {
            color: "white",
            "&::placeholder": {
              color: "rgba(255, 255, 255, 0.5)",
              opacity: 1,
            },
          },
        }}
      />
    </VuiBox>
  );
}

export default SearchBar; 
import { useState } from "react";

// @mui material components
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "engine", label: "Engine Parts" },
    { value: "exhaust", label: "Exhaust Systems" },
    { value: "suspension", label: "Suspension" },
    { value: "brakes", label: "Brakes" },
    { value: "interior", label: "Interior" },
    { value: "exterior", label: "Exterior" },
    { value: "electronics", label: "Electronics" },
    { value: "maintenance", label: "Maintenance" },
  ];

  return (
    <VuiBox>
      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value)}
          sx={{
            "& .MuiSelect-select": {
              color: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "info.main",
            },
          }}
        >
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              <VuiTypography variant="button" color="white">
                {category.label}
              </VuiTypography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </VuiBox>
  );
}

export default CategoryFilter; 
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiSelect from "components/VuiSelect";
import VuiButton from "components/VuiButton";
import { Card } from "@mui/material";

const commonFields = [
  { name: "model", label: "BMW Model", type: "text", required: true },
  { name: "year", label: "Year", type: "number", required: true },
  { name: "engine", label: "Engine (e.g., B58, N54)", type: "text", required: true },
  {
    name: "fuelType",
    label: "Fuel Type",
    type: "select",
    required: true,
    options: ["Petrol", "Diesel"],
  },
];

const engineFields = [
  {
    name: "currentPower",
    label: "Current Power (HP)",
    type: "text",
    required: true,
  },
  {
    name: "desiredPower",
    label: "Desired Power (HP)",
    type: "text",
    required: true,
  },
  {
    name: "removeEmissionControl",
    label: "Remove Emission Control",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  },
];

const exhaustFields = [
  {
    name: "exhaustType",
    label: "Exhaust Type",
    type: "select",
    options: ["Straight Pipe", "Performance Muffler", "Valved Exhaust"],
    required: true,
  },
  {
    name: "downpipeType",
    label: "Downpipe Type",
    type: "select",
    options: ["Catted", "Catless"],
    required: true,
  },
  {
    name: "wantsSoundClip",
    label: "Want Sound Clip Demo",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  },
];

const suspensionFields = [
  {
    name: "suspensionType",
    label: "Suspension Type",
    type: "select",
    options: ["Coilovers", "Lowering Springs", "Air Suspension"],
    required: true,
  },
  {
    name: "currentHeight",
    label: "Current Ride Height (mm)",
    type: "text",
    required: true,
  },
  {
    name: "desiredHeight",
    label: "Desired Ride Height (mm)",
    type: "text",
    required: true,
  },
  {
    name: "needsAlignment",
    label: "Needs Alignment",
    type: "select",
    options: ["Yes", "No"],
    required: true,
  },
];

function TuningServiceForm({ open, onClose, type = "", onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, tuningType: type });
    onClose();
  };

  const getSpecificFields = () => {
    switch (type) {
      case "ENGINE":
        return engineFields;
      case "EXHAUST":
        return exhaustFields;
      case "SUSPENSION":
        return suspensionFields;
      default:
        return [];
    }
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <VuiBox mb={2}>
          <VuiSelect
            fullWidth
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            sx={{ minHeight: "37px" }}
          >
            {field.options.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                }}
              >
                {option}
              </MenuItem>
            ))}
          </VuiSelect>
        </VuiBox>
      );
    }
    return (
      <VuiBox mb={2}>
        <VuiInput
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          required={field.required}
          fullWidth
        />
      </VuiBox>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Card sx={{
        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)",
        borderRadius: '15px'
      }}>
        <DialogTitle>
          <VuiTypography variant="h4" color="white">
            {type ? `${type.charAt(0)}${type.slice(1).toLowerCase()} Tuning Request` : "Tuning Request"}
          </VuiTypography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {commonFields.concat(getSpecificFields()).map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                    {field.label}
                  </VuiTypography>
                  {renderField(field)}
                </Grid>
              ))}
              <Grid item xs={12}>
                <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                  Additional Notes
                </VuiTypography>
                <VuiBox mb={2}>
                  <VuiInput
                    multiline
                    rows={4}
                    name="additionalNotes"
                    value={formData.additionalNotes || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                </VuiBox>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <VuiButton color="error" variant="contained" onClick={onClose}>
            Cancel
          </VuiButton>
          <VuiButton color="info" variant="contained" onClick={handleSubmit}>
            Submit Request
          </VuiButton>
        </DialogActions>
      </Card>
    </Dialog>
  );
}

export default TuningServiceForm;

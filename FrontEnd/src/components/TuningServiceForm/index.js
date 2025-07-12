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
  }
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (!value && value !== 0) {
      return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }

    switch (name) {
      case 'year':
        if (value < 1980 || value > new Date().getFullYear()) {
          return 'Please enter a valid year between 1980 and current year';
        }
        break;
      case 'currentPower':
      case 'desiredPower':
        if (isNaN(value) || value < 0 || value > 2000) {
          return 'Please enter a valid power value between 0 and 2000 HP';
        }
        break;
      case 'currentHeight':
      case 'desiredHeight':
        if (isNaN(value) || value < 0 || value > 500) {
          return 'Please enter a valid height between 0 and 500 mm';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field on change if it's been touched
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched({
      ...touched,
      [name]: true
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const fields = [...commonFields, ...getSpecificFields()];
    const newErrors = {};
    const newTouched = {};

    fields.forEach(field => {
      newTouched[field.name] = true;
      newErrors[field.name] = validateField(field.name, formData[field.name]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

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
          <VuiTypography
            component="label"
            variant="caption"
            fontWeight="bold"
            color="white"
          >
            {field.label}{field.required ? ' *' : ''}
          </VuiTypography>
          <VuiSelect
            fullWidth
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            required={field.required}
            error={touched[field.name] && Boolean(errors[field.name])}
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
          {touched[field.name] && errors[field.name] && (
            <VuiTypography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: 'block' }}
            >
              {errors[field.name]}
            </VuiTypography>
          )}
        </VuiBox>
      );
    }
    return (
      <VuiBox mb={2}>
        <VuiTypography
          component="label"
          variant="caption"
          fontWeight="bold"
          color="white"
        >
          {field.label}{field.required ? ' *' : ''}
        </VuiTypography>
        <VuiInput
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          required={field.required}
          error={touched[field.name] && Boolean(errors[field.name])}
          fullWidth
        />
        {touched[field.name] && errors[field.name] && (
          <VuiTypography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: 'block' }}
          >
            {errors[field.name]}
          </VuiTypography>
        )}
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
              {/* Common Fields */}
              <Grid item xs={12}>
                <VuiTypography variant="h6" color="white" mb={2}>
                  Vehicle Information
                </VuiTypography>
              </Grid>
              {commonFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}

              {/* Specific Fields */}
              <Grid item xs={12}>
                <VuiTypography variant="h6" color="white" mb={2}>
                  {type} Specifications
                </VuiTypography>
              </Grid>
              {getSpecificFields().map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  {renderField(field)}
                </Grid>
              ))}
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <VuiButton color="error" onClick={onClose}>
            Cancel
          </VuiButton>
          <VuiButton
            color="info"
            onClick={handleSubmit}
            disabled={Object.keys(touched).length === 0}
          >
            Submit Request
          </VuiButton>
        </DialogActions>
      </Card>
    </Dialog>
  );
}

export default TuningServiceForm;

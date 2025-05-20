/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// prop-types is library for typechecking of props
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

// Auth service
import AuthService from "services/AuthService";

function EditableProfileInfoCard({ title, description, info, social, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: info.username || "",
    email: info.email || "",
    firstName: info.firstName || "",
    lastName: info.lastName || "",
    phoneNumber: info.phoneNumber || "",
    location: info.location || ""
  });
  const { size } = typography;

  // Update formData when info prop changes or when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        username: info.username || "",
        email: info.email || "",
        firstName: info.firstName || "",
        lastName: info.lastName || "",
        phoneNumber: info.phoneNumber || "",
        location: info.location || ""
      });
    }
  }, [info, isEditing]);

  // Enter edit mode - formData will be updated by the useEffect hook
  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  // Exit edit mode - formData will be reset by the useEffect hook
  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      await AuthService.updateProfile(
        formData.username, 
        formData.email, 
        formData.firstName, 
        formData.lastName, 
        formData.phoneNumber, 
        formData.location
      );
      setIsEditing(false);
      setIsLoading(false);

      // Call the callback to update the parent component
      if (onProfileUpdate) {
        onProfileUpdate({
          ...info,
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          location: formData.location
        });
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Failed to update profile");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    }
  };

  // Render the card info items
  const renderItems = () => {
    if (isEditing) {
      return (
        <VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Username
            </VuiTypography>
            <TextField
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Email
            </VuiTypography>
            <TextField
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              First Name
            </VuiTypography>
            <TextField
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Last Name
            </VuiTypography>
            <TextField
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Phone Number
            </VuiTypography>
            <TextField
              fullWidth
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Location
            </VuiTypography>
            <TextField
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.info.main,
                  },
                },
              }}
            />
          </VuiBox>
          {error && (
            <VuiBox mb={2}>
              <VuiTypography variant="button" color="error" fontWeight="regular">
                {error}
              </VuiTypography>
            </VuiBox>
          )}
          <VuiBox display="flex" justifyContent="flex-end" mt={3}>
            <VuiBox mr={1}>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </VuiBox>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
          </VuiBox>
        </VuiBox>
      );
    }

    return Object.keys(info).map((key) => {
      // Skip username, email, firstName, lastName, phoneNumber, and location in display mode as they're handled separately
      if (key === "username" || key === "email" || key === "firstName" || key === "lastName" || key === "phoneNumber" || key === "location") return null;

      // Format the label
      let label = key;
      if (key.match(/[A-Z\s]+/)) {
        const uppercaseLetter = Array.from(key).find((i) => i.match(/[A-Z]+/));
        label = key.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
      }

      return (
        <VuiBox key={key} display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            {label}: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info[key]}
          </VuiTypography>
        </VuiBox>
      );
    }).filter(Boolean);
  };

  // Render the username and email separately in display mode
  const renderUsernameEmail = () => {
    if (isEditing) return null;

    return (
      <>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            username: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.username || ""}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            email: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.email || ""}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            first name: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.firstName || ""}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            last name: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.lastName || ""}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            phone number: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.phoneNumber || ""}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" py={1} pr={2}>
          <VuiTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            location: &nbsp;
          </VuiTypography>
          <VuiTypography variant="button" fontWeight="regular" color="white">
            &nbsp;{info.location || ""}
          </VuiTypography>
        </VuiBox>
      </>
    );
  };

  // Render the card social media icons
  const renderSocial = social.map(({ link, icon, color }) => (
    <VuiBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color="white"
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </VuiBox>
  ));

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <VuiBox display="flex" mb="14px" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
          {title}
        </VuiTypography>
        {!isEditing && (
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </VuiBox>
      <VuiBox>
        <VuiBox mb={2} lineHeight={1}>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {description}
          </VuiTypography>
        </VuiBox>
        <VuiBox opacity={0.3}>
          <Divider />
        </VuiBox>
        <VuiBox>
          {renderUsernameEmail()}
          {renderItems()}
          {!isEditing && (
            <VuiBox display="flex" py={1} pr={2} color="white">
              <VuiTypography
                variant="button"
                fontWeight="regular"
                color="text"
                textTransform="capitalize"
              >
                social: &nbsp;
              </VuiTypography>
              {renderSocial}
            </VuiBox>
          )}
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Typechecking props for the EditableProfileInfoCard
EditableProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
  onProfileUpdate: PropTypes.func,
};

export default EditableProfileInfoCard;

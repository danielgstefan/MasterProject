import { useState } from "react";

// react-router-dom components
import { Link, useHistory } from "react-router-dom";

// Authentication service
import AuthService from "services/AuthService";

// @mui material components

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

// Vision UI Dashboard assets
import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgSignIn from "assets/images/register.jpg";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: ""
  });
  const history = useHistory();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("handleRegister called");

    setMessage("");
    setSuccessful(false);
    setLoading(true);

    // Reset field errors
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      location: ""
    };

    let hasErrors = false;

    // Validate each field
    if (!username) {
      errors.username = "Username is required";
      hasErrors = true;
    }
    if (!email) {
      errors.email = "Email is required";
      hasErrors = true;
    }
    if (!password) {
      errors.password = "Password is required";
      hasErrors = true;
    } else if (!validatePassword(password)) {
      errors.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      hasErrors = true;
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      hasErrors = true;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }
    if (!firstName) {
      errors.firstName = "First name is required";
      hasErrors = true;
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
      hasErrors = true;
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
      hasErrors = true;
    }
    if (!location) {
      errors.location = "Location is required";
      hasErrors = true;
    }

    setFieldErrors(errors);

    if (hasErrors) {
      setLoading(false);
      return;
    }

    console.log("Sending registration request with:", { username, email, password, firstName, lastName, phoneNumber, location });

    try {
      // Add a timeout to ensure the UI updates before making the API call
      setTimeout(() => {
        AuthService.register(username, email, password, firstName, lastName, phoneNumber, location)
          .then(response => {
            console.log("Registration successful:", response);
            setMessage(response.data.message);
            setSuccessful(true);
            setLoading(false);

            // Redirect to sign-in page after successful registration
            setTimeout(() => {
              history.push("/authentication/sign-in");
            }, 2000);
          })
          .catch(error => {
            console.error("Registration failed:", error);
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

            setMessage(resMessage || "Network error. Please check if the backend server is running.");
            setSuccessful(false);
            setLoading(false);
          });
      }, 100);
    } catch (error) {
      console.error("Exception during registration:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setSuccessful(false);
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      color="white"
      image={bgSignIn}
      premotto="JOY"
      motto="Are you ready to take part of the best dedicated BMW community?"
      cardContent
    >
      <GradientBorder borderRadius={borders.borderRadius.form} minWidth="100%" maxWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          onSubmit={(e) => {
            console.log("Form submitted");
            handleRegister(e);
          }}
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiTypography
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            Register
          </VuiTypography>
          <VuiBox
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}
          >
            {/* Left Column */}
            <VuiBox>
              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Username
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="Your username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.username && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.username}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Email
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    type="email"
                    placeholder="Your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.email && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.email}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Password
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    type="password"
                    placeholder="Your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.password && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.password}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Confirm Password
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    type="password"
                    placeholder="Confirm your password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.confirmPassword && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.confirmPassword}
                  </VuiTypography>
                )}
              </VuiBox>
            </VuiBox>

            {/* Right Column */}
            <VuiBox>
              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    First Name
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="Your first name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.firstName && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.firstName}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Last Name
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="Your last name..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.lastName && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.lastName}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Phone Number
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="Your phone number..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.phoneNumber && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.phoneNumber}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox mb={2}>
                <VuiBox mb={1} ml={0.5}>
                  <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
                    Location
                  </VuiTypography>
                </VuiBox>
                <GradientBorder
                  minWidth="100%"
                  borderRadius={borders.borderRadius.lg}
                  padding="1px"
                  backgroundImage={radialGradient(
                    palette.gradients.borderLight.main,
                    palette.gradients.borderLight.state,
                    palette.gradients.borderLight.angle
                  )}
                >
                  <VuiInput
                    placeholder="Your location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={({ typography: { size } }) => ({
                      fontSize: size.sm,
                    })}
                  />
                </GradientBorder>
                {fieldErrors.location && (
                  <VuiTypography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fieldErrors.location}
                  </VuiTypography>
                )}
              </VuiBox>

              <VuiBox display="flex" alignItems="center">
                <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} />
                <VuiTypography
                  variant="caption"
                  color="white"
                  fontWeight="medium"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  &nbsp;&nbsp;Remember me
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          </VuiBox>

          {message && (
            <VuiTypography
              color={successful ? "success" : "error"}
              textAlign="center"
              sx={{ mt: 2 }}
            >
              {message}
            </VuiTypography>
          )}

          <VuiBox mt={4}>
            <VuiButton
              color="info"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </VuiButton>
          </VuiBox>
          <VuiBox mt={3} textAlign="center">
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Already have an account?{" "}
              <VuiTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Sign in
              </VuiTypography>
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </GradientBorder>
    </CoverLayout>
  );
}

export default SignUp;



// React imports
import { useState, useEffect } from "react";
// @mui material components
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import EditableProfileInfoCard from "examples/Cards/InfoCards/EditableProfileInfoCard";
import Footer from "examples/Footer";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/profile/components/Header";
import CarInformations from "./components/CarInformations";
// Auth service
import AuthService from "services/AuthService";

function Overview() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: ""
  });

  useEffect(() => {
    // Get user data from AuthService
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        location: user.location || ""
      });
    }
  }, []);

  const handleProfileUpdate = (updatedInfo) => {
    setUserData({
      ...userData,
      username: updatedInfo.username,
      email: updatedInfo.email,
      firstName: updatedInfo.firstName,
      lastName: updatedInfo.lastName,
      phoneNumber: updatedInfo.phoneNumber,
      location: updatedInfo.location
    });
  };

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid
          container
          spacing={3}
          sx={({ breakpoints }) => ({
            [breakpoints.only("xl")]: {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
          })}
        >
          <Grid
            item
            xs={12}
            xl={4}
            xxl={3}
            sx={({ breakpoints }) => ({
              minHeight: "400px",
              [breakpoints.only("xl")]: {
                gridArea: "1 / 1 / 2 / 2",
              },
            })}
          >
            <EditableProfileInfoCard
              title="profile information"
              description="Update your profile information below.."
              info={{
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                location: userData.location,
              }}
              social={[
                {
                  link: "https://www.facebook.com/CreativeTim/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/creativetim",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/creativetimofficial/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              onProfileUpdate={handleProfileUpdate}
            />
          </Grid>
          <Grid
            item
            xs={12}
            xl={8}
            xxl={9}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridArea: "2 / 1 / 3 / 3",
              },
            })}
          >
            <CarInformations />
          </Grid>
        </Grid>
      </VuiBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;

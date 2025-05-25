

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Images
import burceMars from "assets/images/bmwlogoblack.png";
// Vision UI Dashboard React base styles
import VuiAvatar from "components/VuiAvatar";
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
// Vision UI Dashboard React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
// Auth service
import AuthService from "services/AuthService";
import colors from "assets/theme/base/colors";

function Header() {
  const { info, transparent } = colors;
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || ""
      });
    }
  }, []);

  return (
      <VuiBox position="relative">
        <DashboardNavbar light />
        <Card
            sx={{
              px: 3,
              mt: 2,
            }}
        >
          <Grid
              container
              alignItems="center"
              justifyContent="flex-start"
              sx={({ breakpoints }) => ({
                [breakpoints.up("xs")]: {
                  gap: "16px",
                  backgroundColor: transparent?.main || "rgba(0,0,0,0)",
                  color: info?.main || "#0075ff"
                }
              })}
          >
            <Grid
                item
                xs={12}
                md={1.7}
                lg={1.5}
                xl={1.2}
                xxl={0.8}
                display="flex"
                sx={({ breakpoints }) => ({
                  justifyContent: "flex-start",
                  alignItems: "center",
                  [breakpoints.only("sm")]: {
                    justifyContent: "center",
                  },
                })}
            >
              <VuiAvatar
                  src={burceMars}
                  alt="profile-image"
                  variant="rounded"
                  size="xl"
                  shadow="sm"
              />
            </Grid>

            <Grid item xs={12} md={4.3} lg={4} xl={3.8} xxl={7}>
              <VuiBox
                  height="100%"
                  mt={0.5}
                  lineHeight={1}
                  display="flex"
                  flexDirection="column"
                  sx={({ breakpoints }) => ({
                    [breakpoints.only("sm")]: {
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  })}
              >
                <VuiTypography variant="lg" color="white" fontWeight="bold">
                  {userData.firstName} {userData.lastName}
                </VuiTypography>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  {userData.email}
                </VuiTypography>
              </VuiBox>
            </Grid>

          </Grid>
        </Card>
      </VuiBox>
  );
}

export default Header;

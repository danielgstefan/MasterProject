import React, { useState, useEffect } from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import AuthService from "services/AuthService";

import gif from "assets/images/8series.jpg";

const WelcomeMark = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: ""
  });

  useEffect(() => {
    // Get user data from AuthService
    const user = AuthService.getCurrentUser();
    if (user) {
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      });
    }
  }, []);
  return (
    <Card sx={() => ({
      height: "340px",
      py: "32px",
      backgroundImage: `url(${gif})`,
      backgroundSize: "cover",
      backgroundPosition: "50%"
    })}>
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px">
            Welcome back,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            {userData.lastName} {userData.firstName}
          </VuiTypography>
          <VuiTypography color="white" variant="h6" fontWeight="regular" mb="auto">
            Glad to see you again!
            <br />
          </VuiTypography>
        </VuiBox>
        <VuiTypography
          component="a"
          href="/chat"
          variant="button"
          color="white"
          fontWeight="regular"
          sx={{
            mr: "5px",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",

            "& .material-icons-round": {
              fontSize: "1.125rem",
              transform: `translate(2px, -0.5px)`,
              transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
            },

            "&:hover .material-icons-round, &:focus  .material-icons-round": {
              transform: `translate(6px, -0.5px)`,
            },
          }}
        >
            Let's hear what the other enthuziasts has to say.
          <Icon sx={{ fontWeight: "bold", ml: "5px" }}>arrow_forward</Icon>
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;

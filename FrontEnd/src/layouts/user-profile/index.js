import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Grid } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { getUserByUsername } from "services/userService";

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserByUsername(username);
        setUserData(response);
      } catch (err) {
        setError("User not found");
      }
    };

    fetchUserData();
  }, [username]);

  if (error) {
    return (
      <DashboardLayout>
        <VuiBox py={3}>
          <VuiTypography variant="h3" color="error">
            {error}
          </VuiTypography>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <VuiBox py={3}>
          <VuiTypography variant="h3">Loading...</VuiTypography>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <VuiBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <VuiBox p={3}>
                <VuiTypography variant="h4" gutterBottom>
                  User Profile
                </VuiTypography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="h6">Username:</VuiTypography>
                    <VuiTypography>{userData.username}</VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="h6">Name:</VuiTypography>
                    <VuiTypography>{`${userData.firstName} ${userData.lastName}`}</VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="h6">Location:</VuiTypography>
                    <VuiTypography>{userData.location || "Not specified"}</VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="h6">Phone:</VuiTypography>
                    <VuiTypography>{userData.phoneNumber || "Not specified"}</VuiTypography>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>
          {userData.cars && userData.cars.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <VuiBox p={3}>
                  <VuiTypography variant="h4" gutterBottom>
                    Cars
                  </VuiTypography>
                  {userData.cars.map((car, index) => (
                    <Grid container spacing={2} key={index} sx={{ mt: index > 0 ? 2 : 0 }}>
                      <Grid item xs={12}>
                        <VuiTypography variant="h5">{car.alias}</VuiTypography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <VuiTypography variant="h6">Brand:</VuiTypography>
                        <VuiTypography>{car.brand}</VuiTypography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <VuiTypography variant="h6">Model:</VuiTypography>
                        <VuiTypography>{car.model}</VuiTypography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <VuiTypography variant="h6">Horsepower:</VuiTypography>
                        <VuiTypography>{car.horsePower || 'N/A'}</VuiTypography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <VuiTypography variant="h6">Torque:</VuiTypography>
                        <VuiTypography>{car.torque || 'N/A'}</VuiTypography>
                      </Grid>
                      {car.bio && (
                        <Grid item xs={12}>
                          <VuiTypography variant="h6">Bio:</VuiTypography>
                          <VuiTypography>{car.bio}</VuiTypography>
                        </Grid>
                      )}
                      {car.photoUrl && (
                        <Grid item xs={12}>
                          <img
                            src={car.photoUrl}
                            alt={`${car.brand} ${car.model}`}
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  ))}
                </VuiBox>
              </Card>
            </Grid>
          )}
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UserProfile;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Grid } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { getUserByUsername } from "services/userService";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css';

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
              <VuiBox
                p={3}
                sx={{
                  background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
                  borderRadius: "15px"
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <VuiBox
                      sx={{
                        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)",
                        borderRadius: "12px",
                        p: 2
                      }}
                    >
                      <VuiTypography variant="h6" color="white" fontWeight="bold">
                        User Information
                      </VuiTypography>
                      <VuiBox mt={2}>
                        <VuiBox display="flex" alignItems="center" mb={2}>
                          <VuiTypography variant="button" color="text" fontWeight="medium">
                            Username:
                          </VuiTypography>
                          <VuiTypography variant="button" color="white" fontWeight="medium" ml={1}>
                            {userData.username}
                          </VuiTypography>
                        </VuiBox>
                        <VuiBox display="flex" alignItems="center" mb={2}>
                          <VuiTypography variant="button" color="text" fontWeight="medium">
                            Full Name:
                          </VuiTypography>
                          <VuiTypography variant="button" color="white" fontWeight="medium" ml={1}>
                            {`${userData.firstName} ${userData.lastName}`}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <VuiBox
                      sx={{
                        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)",
                        borderRadius: "12px",
                        p: 2
                      }}
                    >
                      <VuiTypography variant="h6" color="white" fontWeight="bold">
                        Contact Details
                      </VuiTypography>
                      <VuiBox mt={2}>
                        <VuiBox display="flex" alignItems="center" mb={2}>
                          <VuiTypography variant="button" color="text" fontWeight="medium">
                            Location:
                          </VuiTypography>
                          <VuiTypography variant="button" color="white" fontWeight="medium" ml={1}>
                            {userData.location || "Not specified"}
                          </VuiTypography>
                        </VuiBox>
                        <VuiBox display="flex" alignItems="center">
                          <VuiTypography variant="button" color="text" fontWeight="medium">
                            Phone:
                          </VuiTypography>
                          <VuiTypography variant="button" color="white" fontWeight="medium" ml={1}>
                            {userData.phoneNumber || "Not specified"}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </VuiBox>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <VuiBox
                      sx={{
                        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)",
                        borderRadius: "12px",
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <VuiTypography variant="h6" color="white" fontWeight="bold" textAlign="center">
                        {`${userData.cars?.length || 0} Cars`}
                      </VuiTypography>
                      <VuiTypography variant="button" color="text" fontWeight="regular" textAlign="center">
                        in collection
                      </VuiTypography>
                    </VuiBox>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>
          {userData.cars && userData.cars.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <VuiBox p={3}>
                  <VuiTypography variant="h4" color="white" mb={3}>
                    Car Collection
                  </VuiTypography>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                      height: "750px" // Increased height to show all content
                    }}
                  >
                    {userData.cars.map((car, index) => (
                      <SwiperSlide key={index}>
                        <Card sx={{
                          height: '100%',
                          background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%) !important",
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'auto'
                        }}>
                          <VuiBox p={2} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {car.photoUrl && (
                              <VuiBox mb={2} sx={{
                                height: '350px',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                              }}>
                                <img
                                  src={car.photoUrl}
                                  alt={`${car.brand} ${car.model}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    backgroundColor: 'rgba(0,0,0,0.2)'
                                  }}
                                />
                              </VuiBox>
                            )}
                            <VuiBox mb={3}>
                              <VuiTypography variant="h4" color="white" fontWeight="bold">
                                {car.alias}
                              </VuiTypography>
                              <VuiTypography variant="h6" color="text" fontWeight="regular">
                                {`${car.brand} ${car.model}`}
                              </VuiTypography>
                            </VuiBox>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <VuiBox
                                  sx={{
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '10px',
                                    p: 1.5,
                                    textAlign: 'center',
                                    height: '100%'
                                  }}
                                >
                                  <VuiTypography variant="button" color="text" fontWeight="medium">
                                    Brand
                                  </VuiTypography>
                                  <VuiTypography variant="h6" color="white">
                                    {car.brand}
                                  </VuiTypography>
                                </VuiBox>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <VuiBox
                                  sx={{
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '10px',
                                    p: 1.5,
                                    textAlign: 'center',
                                    height: '100%'
                                  }}
                                >
                                  <VuiTypography variant="button" color="text" fontWeight="medium">
                                    Model
                                  </VuiTypography>
                                  <VuiTypography variant="h6" color="white">
                                    {car.model}
                                  </VuiTypography>
                                </VuiBox>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <VuiBox
                                  sx={{
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '10px',
                                    p: 1.5,
                                    textAlign: 'center',
                                    height: '100%'
                                  }}
                                >
                                  <VuiTypography variant="button" color="text" fontWeight="medium">
                                    Horsepower
                                  </VuiTypography>
                                  <VuiTypography variant="h6" color="white">
                                    {car.horsePower || 'N/A'}
                                  </VuiTypography>
                                </VuiBox>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <VuiBox
                                  sx={{
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '10px',
                                    p: 1.5,
                                    textAlign: 'center',
                                    height: '100%'
                                  }}
                                >
                                  <VuiTypography variant="button" color="text" fontWeight="medium">
                                    Torque
                                  </VuiTypography>
                                  <VuiTypography variant="h6" color="white">
                                    {car.torque || 'N/A'}
                                  </VuiTypography>
                                </VuiBox>
                              </Grid>
                            </Grid>
                            {car.bio && (
                              <VuiBox mt={2} sx={{
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '10px',
                                p: 2
                              }}>
                                <VuiTypography variant="button" color="text" fontWeight="medium" mb={1} display="block">
                                  Bio
                                </VuiTypography>
                                <VuiTypography variant="button" color="white" fontWeight="regular">
                                  {car.bio}
                                </VuiTypography>
                              </VuiBox>
                            )}
                          </VuiBox>
                        </Card>
                      </SwiperSlide>
                    ))}
                  </Swiper>
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

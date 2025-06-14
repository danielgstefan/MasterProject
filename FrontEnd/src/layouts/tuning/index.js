import { useState } from "react";
import { useHistory } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import TuningServiceForm from "components/TuningServiceForm";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Service for creating tuning requests
import { createTuningRequest } from "services/tuningService";
import { useAuth } from "context/AuthContext";
import { handleTokenExpiration } from "utils/handleTokenExpiration";

function Tuning() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const { user } = useAuth();
  const history = useHistory();

  const handleNewRequest = (type) => {
    if (!user) {
      history.push('/authentication/sign-in');
      return;
    }
    setSelectedType(type);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedType("");
  };

  const handleSubmitRequest = async (formData) => {
    if (!user) return;
    try {
      await createTuningRequest(user.id, formData);
      setOpenForm(false);
      alert('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      if (!handleTokenExpiration(error, history)) {
        alert('Error submitting request. Please try again.');
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <VuiBox mb={3}>
              <VuiTypography variant="h2" fontWeight="bold" color="white">
                BMW Tuning Services
              </VuiTypography>
              <VuiTypography variant="body2" color="text">
                Professional tuning services for your BMW
              </VuiTypography>
            </VuiBox>
          </Grid>

          {}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card
                  onClick={() => handleNewRequest('ENGINE')}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' },
                    background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
                    height: '100%'
                  }}
                >
                  <VuiBox p={3} textAlign="center">
                    <Icon sx={{ fontSize: 60 }} color="info">build</Icon>
                    <VuiTypography variant="h4" color="white" mt={2} mb={2}>
                      Engine Tuning
                    </VuiTypography>
                    <VuiTypography variant="body2" color="text" mb={2}>
                      Professional ECU remapping and engine optimization for maximum performance
                    </VuiTypography>
                    <VuiTypography variant="h6" color="info">
                      Features:
                    </VuiTypography>
                    <VuiBox component="ul" sx={{ pl: 2, textAlign: 'left' }}>
                      <li><VuiTypography variant="button" color="text">Custom ECU remapping</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Performance optimization</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Fuel efficiency improvement</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Power increase up to 30%</VuiTypography></li>
                    </VuiBox>
                  </VuiBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  onClick={() => handleNewRequest('EXHAUST')}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' },
                    background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
                    height: '100%'
                  }}
                >
                  <VuiBox p={3} textAlign="center">
                    <Icon sx={{ fontSize: 60 }} color="info">speed</Icon>
                    <VuiTypography variant="h4" color="white" mt={2} mb={2}>
                      Exhaust Tuning
                    </VuiTypography>
                    <VuiTypography variant="body2" color="text" mb={2}>
                      Custom exhaust system design and installation for optimal performance and sound
                    </VuiTypography>
                    <VuiTypography variant="h6" color="info">
                      Features:
                    </VuiTypography>
                    <VuiBox component="ul" sx={{ pl: 2, textAlign: 'left' }}>
                      <li><VuiTypography variant="button" color="text">Custom exhaust systems</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Performance downpipes</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Sound customization</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">High-flow catalytic converters</VuiTypography></li>
                    </VuiBox>
                  </VuiBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  onClick={() => handleNewRequest('SUSPENSION')}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' },
                    background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
                    height: '100%'
                  }}
                >
                  <VuiBox p={3} textAlign="center">
                    <Icon sx={{ fontSize: 60 }} color="info">height</Icon>
                    <VuiTypography variant="h4" color="white" mt={2} mb={2}>
                      Suspension Tuning
                    </VuiTypography>
                    <VuiTypography variant="body2" color="text" mb={2}>
                      Custom suspension setup and alignment for optimal handling and comfort
                    </VuiTypography>
                    <VuiTypography variant="h6" color="info">
                      Features:
                    </VuiTypography>
                    <VuiBox component="ul" sx={{ pl: 2, textAlign: 'left' }}>
                      <li><VuiTypography variant="button" color="text">Custom spring rates</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Damper adjustment</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Alignment optimization</VuiTypography></li>
                      <li><VuiTypography variant="button" color="text">Ride height adjustment</VuiTypography></li>
                    </VuiBox>
                  </VuiBox>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </VuiBox>

      <TuningServiceForm
        open={openForm}
        onClose={handleCloseForm}
        type={selectedType}
        onSubmit={handleSubmitRequest}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default Tuning;

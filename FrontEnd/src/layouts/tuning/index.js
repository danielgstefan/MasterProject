import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Tuning() {
  const [selectedService, setSelectedService] = useState(null);

  const tuningServices = [
    {
      id: 1,
      name: "Engine Tuning",
      description: "Professional ECU remapping and engine optimization for maximum performance",
      price: "From $499",
      image: "https://example.com/engine-tuning.jpg",
      features: [
        "Custom ECU remapping",
        "Performance optimization",
        "Fuel efficiency improvement",
        "Power increase up to 30%"
      ]
    },
    {
      id: 2,
      name: "Suspension Setup",
      description: "Custom suspension tuning and alignment for optimal handling",
      price: "From $299",
      image: "https://example.com/suspension.jpg",
      features: [
        "Custom spring rates",
        "Damper adjustment",
        "Alignment optimization",
        "Ride height adjustment"
      ]
    },
    {
      id: 3,
      name: "Exhaust Tuning",
      description: "Custom exhaust system design and installation",
      price: "From $799",
      image: "https://example.com/exhaust.jpg",
      features: [
        "Custom exhaust design",
        "Performance headers",
        "Sound optimization",
        "Catalytic converter options"
      ]
    }
  ];

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
              {tuningServices.map((service) => (
                <Grid item xs={12} md={4} key={service.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                    onClick={() => setSelectedService(service)}
                  >
                    <VuiBox
                      sx={{
                        position: "relative",
                        paddingTop: "56.25%", // 16:9 aspect ratio
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </VuiBox>
                    <VuiBox p={3}>
                      <VuiTypography variant="h5" fontWeight="bold" color="white" mb={1}>
                        {service.name}
                      </VuiTypography>
                      <VuiTypography variant="body2" color="text" mb={2}>
                        {service.description}
                      </VuiTypography>
                      <VuiTypography variant="h6" fontWeight="bold" color="white" mb={2}>
                        {service.price}
                      </VuiTypography>
                      <VuiButton
                        variant="contained"
                        color="info"
                        fullWidth
                      >
                        Book Service
                      </VuiButton>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tuning; 
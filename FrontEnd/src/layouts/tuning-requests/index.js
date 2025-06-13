import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  Grid,
  Collapse,
  Tab,
  Tabs,
} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useAuth } from "context/AuthContext";
import { getTuningRequests, getTuningRequestsByType } from "services/tuningService";
import { handleTokenExpiration } from "utils/handleTokenExpiration";

function TuningRequests() {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      let fetchedRequests;
      if (currentTab === 0) {
        fetchedRequests = await getTuningRequests(user.id);
      } else {
        const types = ['ENGINE', 'EXHAUST', 'SUSPENSION'];
        fetchedRequests = await getTuningRequestsByType(user.id, types[currentTab - 1]);
      }
      setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (!handleTokenExpiration(error, history)) {
        // Handle other errors here
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentTab]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRequestClick = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'info';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'text';
    }
  };

  const renderRequestCard = (request) => (
    <Card
      key={request.id}
      sx={{
        mb: 2,
        cursor: 'pointer',
        background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)"
      }}
      onClick={() => handleRequestClick(request.id)}
    >
      <VuiBox p={2}>
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <VuiTypography variant="button" color="white" fontWeight="medium">
              {request.model} - {request.year}
            </VuiTypography>
          </Grid>
          <Grid item xs={12} md={3}>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              {new Date(request.createdAt).toLocaleDateString()}
            </VuiTypography>
          </Grid>
          <Grid item xs={12} md={3}>
            <VuiTypography
              variant="button"
              color={getStatusColor(request.status)}
              fontWeight="medium"
            >
              {request.status}
            </VuiTypography>
          </Grid>
        </Grid>

        <Collapse in={expandedRequest === request.id}>
          <VuiBox mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <VuiTypography variant="button" color="text" fontWeight="medium">
                  Engine: {request.engine}
                </VuiTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <VuiTypography variant="button" color="text" fontWeight="medium">
                  Fuel Type: {request.fuelType}
                </VuiTypography>
              </Grid>

              {request.tuningType === 'ENGINE' && (
                <>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Current Power: {request.currentPower} HP
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Desired Power: {request.desiredPower} HP
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Remove Emission Control: {request.removeEmissionControl}
                    </VuiTypography>
                  </Grid>
                </>
              )}

              {request.tuningType === 'EXHAUST' && (
                <>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Exhaust Type: {request.exhaustType}
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Downpipe: {request.downpipeType}
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Sound Clip Demo: {request.wantsSoundClip}
                    </VuiTypography>
                  </Grid>
                </>
              )}

              {request.tuningType === 'SUSPENSION' && (
                <>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Type: {request.suspensionType}
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Current Height: {request.currentHeight}
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Desired Height: {request.desiredHeight}
                    </VuiTypography>
                  </Grid>
                  <Grid item xs={12}>
                    <VuiTypography variant="button" color="text" fontWeight="medium">
                      Needs Alignment: {request.needsAlignment}
                    </VuiTypography>
                  </Grid>
                </>
              )}

              {request.additionalNotes && (
                <Grid item xs={12}>
                  <VuiTypography variant="button" color="text" fontWeight="medium">
                    Notes: {request.additionalNotes}
                  </VuiTypography>
                </Grid>
              )}
            </Grid>
          </VuiBox>
        </Collapse>
      </VuiBox>
    </Card>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Card sx={{ background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)" }}>
          <VuiBox p={3}>
            <VuiBox mb={3}>
              <VuiTypography variant="h4" color="white">
                My Tuning Requests
              </VuiTypography>
            </VuiBox>

            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: '#050a25' },
                mb: 3,
                display: 'flex',
                textAlign: 'center'
              }}
            >
              <Tab label="All Requests" sx={{ color: 'info.main'}} />
              <Tab label="Engine" sx={{ color: 'info.main'}} />
              <Tab label="Exhaust" sx={{ color: 'info.main'}} />
              <Tab label="Suspension" sx={{ color: 'info.main'}} />
            </Tabs>

            {requests.length === 0 ? (
              <VuiTypography variant="button" color="text" fontWeight="regular">
                No requests found. Visit our Tuning Services page to create a new request.
              </VuiTypography>
            ) : (
              requests
                .filter(request => {
                  switch (currentTab) {
                    case 0: return true;
                    case 1: return request.tuningType === 'ENGINE';
                    case 2: return request.tuningType === 'EXHAUST';
                    case 3: return request.tuningType === 'SUSPENSION';
                    default: return true;
                  }
                })
                .map(request => renderRequestCard(request))
            )}
          </VuiBox>
        </Card>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TuningRequests;

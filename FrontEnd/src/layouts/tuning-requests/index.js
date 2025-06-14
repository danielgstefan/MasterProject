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
import VuiButton from "components/VuiButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useAuth } from "context/AuthContext";
import { getAllTuningRequests, updateRequestStatus } from "services/tuningService";
import { handleTokenExpiration } from "utils/handleTokenExpiration";

function TuningRequests() {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const history = useHistory();

  const fetchRequests = async () => {
    try {
      const fetchedRequests = await getAllTuningRequests();
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
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRequestClick = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await updateRequestStatus(requestId, newStatus);
      // After successful update, refresh the requests list
      await fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      if (!handleTokenExpiration(error, history)) {
        alert('Error updating request status. Please try again.');
      }
    }
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
    <Grid item xs={12} key={request.id}>
      <Card
        onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
        sx={{ cursor: 'pointer', mb: 3 }}
      >
        <VuiBox p={2}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <VuiTypography variant="h6" color="white">
                {request.model} - {request.tuningType}
              </VuiTypography>
              <VuiTypography variant="button" fontWeight="regular" color="text">
                Requested by: {request.user.username}
              </VuiTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                <Grid item>
                  <VuiTypography variant="button" color="text" align="right">
                    Status: {request.status}
                  </VuiTypography>
                </Grid>
                {request.status === 'PENDING' && (
                  <>
                    <Grid item>
                      <VuiButton
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(request.id, 'APPROVED');
                        }}
                      >
                        Approve
                      </VuiButton>
                    </Grid>
                    <Grid item>
                      <VuiButton
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(request.id, 'DECLINED');
                        }}
                      >
                        Decline
                      </VuiButton>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Collapse in={expandedRequest === request.id}>
            <VuiBox mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="medium">
                    BMW Model: {request.model}
                  </VuiTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <VuiTypography variant="button" color="text" fontWeight="medium">
                    Year: {request.year}
                  </VuiTypography>
                </Grid>
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
                        Remove Emission Control: {request.removeEmissionControl ? 'Yes' : 'No'}
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
                        Needs Alignment: {request.needsAlignment ? 'Yes' : 'No'}
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
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Card sx={{ background: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)" }}>
          <VuiBox p={3}>
            <VuiBox mb={3}>
              <VuiTypography variant="h4" color="white">
                All Tuning Requests
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
              <Tab label="Pending Requests" sx={{ color: 'info.main'}} />
              <Tab label="Approved Requests" sx={{ color: 'info.main'}} />
              <Tab label="Declined Requests" sx={{ color: 'info.main'}} />
              <Tab label="Engine" sx={{ color: 'info.main'}} />
              <Tab label="Exhaust" sx={{ color: 'info.main'}} />
              <Tab label="Suspension" sx={{ color: 'info.main'}} />
            </Tabs>

            {requests.length === 0 ? (
              <VuiTypography variant="button" color="text" fontWeight="regular">
                No requests found. Visit our Tuning Services page to create a new request.
              </VuiTypography>
            ) : (
              <Grid container spacing={3}>
                {requests
                  .filter(request => {
                    switch (currentTab) {
                      case 0: return request.status === 'PENDING';
                      case 1: return request.status === 'APPROVED';
                      case 2: return request.status === 'DECLINED';
                      case 3: return request.tuningType === 'ENGINE';
                      case 4: return request.tuningType === 'EXHAUST';
                      case 5: return request.tuningType === 'SUSPENSION';
                      default: return true;
                    }
                  })
                  .map(request => renderRequestCard(request))
                }
              </Grid>
            )}
          </VuiBox>
        </Card>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TuningRequests;

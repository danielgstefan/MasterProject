import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Switch,
  Grid,
} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import UserManagementService from "services/UserManagementService";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    UserManagementService.getAllUsers()
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error loading users:", error);
      });
  };

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 2 ? 1 : 2; // Toggle between admin (2) and user (1)
    UserManagementService.updateUserRole(userId, newRole)
      .then(() => {
        loadUsers(); // Reload users after update
      })
      .catch(error => {
        console.error("Error updating user role:", error);
      });
  };

  return (
    <DashboardLayout>
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <VuiBox display="flex" flexDirection="column" height="100%">
                  <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="24px">
                    <VuiTypography variant="lg" color="white">
                      User Management
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox>
                    {users.map((user) => (
                      <VuiBox
                        key={user.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb="12px"
                        py={1}
                        px={2}
                        sx={{
                          background: "linear-gradient(90deg, rgba(36,37,56,0.5) 0%, rgba(48,49,69,0.5) 100%)",
                          borderRadius: "12px",
                        }}
                      >
                        <Stack spacing={2} direction="row" alignItems="center">
                          <VuiTypography variant="button" color="white">
                            {user.username}
                          </VuiTypography>
                          <VuiTypography variant="caption" color="text">
                            ({user.email})
                          </VuiTypography>
                        </Stack>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <VuiTypography variant="button" color="text">
                            Admin
                          </VuiTypography>
                          <Switch
                            checked={user.roles === 2}
                            onChange={() => handleRoleChange(user.id, user.roles)}
                            color="info"
                          />
                        </Stack>
                      </VuiBox>
                    ))}
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;

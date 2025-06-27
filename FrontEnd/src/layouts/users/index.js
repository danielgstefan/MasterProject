import { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Switch,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import UserManagementService from "services/UserManagementService";
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";

function Users() {
  const [users, setUsers] = useState([]);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanning, setIsBanning] = useState(true); // true for ban, false for unban

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

  const handleBanClick = (user, ban) => {
    setSelectedUser(user);
    setIsBanning(ban);
    setBanDialogOpen(true);
  };

  const handleBanConfirm = () => {
    if (selectedUser) {
      const action = isBanning ?
        UserManagementService.banUser(selectedUser.id) :
        UserManagementService.unbanUser(selectedUser.id);

      action.then(() => {
          loadUsers(); // Reload users after ban/unban
          setBanDialogOpen(false);
        })
        .catch(error => {
          console.error(`Error ${isBanning ? 'banning' : 'unbanning'} user:`, error);
        });
    }
  };

  const isAdmin = (user) => user.roles === 2;

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
                            {user.email}
                          </VuiTypography>
                          {user.banned && (
                            <VuiTypography variant="caption" color="error">
                              BANNED
                            </VuiTypography>
                          )}
                        </Stack>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <VuiTypography variant="button" color="text">
                            Admin Access
                          </VuiTypography>
                          <Switch
                            checked={isAdmin(user)}
                            onChange={() => handleRoleChange(user.id, user.roles)}
                            color="success"
                          />
                          <IconButton
                            onClick={() => handleBanClick(user, !user.banned)}
                            sx={{ color: user.banned ? 'success.main' : 'error.main' }}
                          >
                            {user.banned ? <IoLockOpenOutline /> : <IoLockClosedOutline />}
                          </IconButton>
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

      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <DialogTitle>
          {isBanning ? "Ban User" : "Unban User"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {isBanning ? "ban" : "unban"} {selectedUser?.username}?
          {isBanning && (
            <VuiTypography variant="caption" color="text">
              This will prevent the user from logging in to their account.
            </VuiTypography>
          )}
        </DialogContent>
        <DialogActions>
          <VuiButton onClick={() => setBanDialogOpen(false)} color="primary">
            Cancel
          </VuiButton>
          <VuiButton onClick={handleBanConfirm} color={isBanning ? "error" : "success"}>
            {isBanning ? "Ban" : "Unban"}
          </VuiButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Users;

import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "./../../services/axiosInstance";
import ForumService from "services/ForumService";

function UsersActivity() {
  const [usersActivity, setUsersActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersActivity = async () => {
      try {
        const response = await axios.get("/users/all");
        const users = response.data;

        const activitiesPromises = users.map(async (user) => {
          const forumPosts = await ForumService.getAllPosts(0, 1000, "createdAt", "desc");
          const userForumPosts = forumPosts.data.content.filter(
              (post) => post.author && post.author.id === user.id
          );

          const carsResponse = await axios.get(`/cars/admin/user/${user.id}`);
          const cars = Array.isArray(carsResponse.data) ? carsResponse.data : [];

          let tuningRequests = [];
          try {
            const tuningResponse = await axios.get(`/tuning/requests/${user.id}`);
            tuningRequests = Array.isArray(tuningResponse.data) ? tuningResponse.data : [];
          } catch (err) {
            console.error(err);
          }

          return {
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
            email: user.email,
            forumPosts: userForumPosts.length,
            cars: cars.length,
            tuningRequests: tuningRequests.length,
          };
        });

        const activities = await Promise.all(activitiesPromises);
        setUsersActivity(activities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersActivity();
  }, []);

  const columns = [
    { id: "name", label: "User Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "forumPosts", label: "Forum Posts", align: "center" },
    { id: "cars", label: "Cars", align: "center" },
    { id: "tuningRequests", label: "Tuning Requests", align: "center" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ background: "transparent", boxShadow: "none" }}>
              <Box
                mx={2}
                mt={-3}
                py={3}
                px={2}
                sx={{
                  background: "linear-gradient(90deg, rgba(36,37,56,0.8) 0%, rgba(48,49,69,0.8) 100%)",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="h6" color="white">
                  Users Activity Overview
                </Typography>
              </Box>
              <Box p={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '0 8px',
                        color: 'white',
                        background: 'transparent'
                      }}
                    >
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th
                              key={col.id}
                              style={{
                                padding: '16px 32px',
                                textAlign: col.align,
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                background: 'transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                width: col.id === 'name' ? '20%' :
                                       col.id === 'email' ? '30%' : '16.66%',
                                backdropFilter: 'blur(4px)'
                              }}
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {usersActivity.map((row, idx) => (
                          <tr
                            key={idx}
                            style={{
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{
                              padding: '16px 32px',
                              textAlign: 'left',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              width: '20%'
                            }}>
                              {row.name}
                            </td>
                            <td style={{
                              padding: '16px 32px',
                              textAlign: 'left',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              width: '30%'
                            }}>
                              {row.email}
                            </td>
                            <td style={{
                              padding: '16px 32px',
                              textAlign: 'center',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              width: '16.66%'
                            }}>
                              {row.forumPosts}
                            </td>
                            <td style={{
                              padding: '16px 32px',
                              textAlign: 'center',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              width: '16.66%'
                            }}>
                              {row.cars}
                            </td>
                            <td style={{
                              padding: '16px 32px',
                              textAlign: 'center',
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              width: '16.66%'
                            }}>
                              {row.tuningRequests}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default UsersActivity;

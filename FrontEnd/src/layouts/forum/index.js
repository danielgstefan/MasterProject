import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Icons
import { IoCreateOutline } from "react-icons/io5";
import { IoThumbsUpOutline } from "react-icons/io5";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";

function Forum() {
  const [newPost, setNewPost] = useState("");

  const forumCategories = [
    {
      id: 1,
      name: "General Discussion",
      description: "General topics about BMW cars and ownership",
      postCount: 1234,
      lastPost: "2 hours ago"
    },
    {
      id: 2,
      name: "Technical Support",
      description: "Technical questions and solutions",
      postCount: 856,
      lastPost: "1 hour ago"
    },
    {
      id: 3,
      name: "Modifications & Tuning",
      description: "Discuss modifications and tuning projects",
      postCount: 567,
      lastPost: "30 minutes ago"
    },
    {
      id: 4,
      name: "Show & Shine",
      description: "Share photos of your BMW",
      postCount: 432,
      lastPost: "15 minutes ago"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      title: "New M4 Competition - First Impressions",
      author: "JohnDoe",
      category: "General Discussion",
      likes: 45,
      comments: 12,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "ECU Tuning Question for E92 M3",
      author: "BMWFan",
      category: "Technical Support",
      likes: 23,
      comments: 8,
      timeAgo: "3 hours ago"
    },
    {
      id: 3,
      title: "My M2 Competition Build Thread",
      author: "TunerPro",
      category: "Modifications & Tuning",
      likes: 67,
      comments: 15,
      timeAgo: "5 hours ago"
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <VuiBox mb={3}>
              <VuiTypography variant="h2" fontWeight="bold" color="white">
                BMW Forum
              </VuiTypography>
              <VuiTypography variant="body2" color="text">
                Join the discussion with fellow BMW enthusiasts
              </VuiTypography>
            </VuiBox>
          </Grid>

          {/* Create New Post */}
          <Grid item xs={12}>
            <Card>
              <VuiBox p={3}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Share your thoughts..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.4)",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <VuiButton
                      variant="contained"
                      color="info"
                      startIcon={<IoCreateOutline />}
                    >
                      Create Post
                    </VuiButton>
                  </Grid>
                </Grid>
              </VuiBox>
            </Card>
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <VuiTypography variant="h5" fontWeight="bold" color="white" mb={2}>
              Categories
            </VuiTypography>
            <Grid container spacing={3}>
              {forumCategories.map((category) => (
                <Grid item xs={12} md={6} key={category.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <VuiBox p={3}>
                      <VuiTypography variant="h6" fontWeight="bold" color="white">
                        {category.name}
                      </VuiTypography>
                      <VuiTypography variant="body2" color="text" mb={2}>
                        {category.description}
                      </VuiTypography>
                      <VuiBox display="flex" justifyContent="space-between">
                        <VuiTypography variant="caption" color="text">
                          {category.postCount} posts
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text">
                          Last post: {category.lastPost}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recent Posts */}
          <Grid item xs={12}>
            <VuiTypography variant="h5" fontWeight="bold" color="white" mb={2}>
              Recent Posts
            </VuiTypography>
            <Grid container spacing={3}>
              {recentPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
                    <VuiBox p={3}>
                      <VuiTypography variant="h6" fontWeight="bold" color="white" mb={1}>
                        {post.title}
                      </VuiTypography>
                      <VuiBox display="flex" alignItems="center" mb={2}>
                        <VuiTypography variant="caption" color="text" mr={2}>
                          Posted by {post.author}
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" mr={2}>
                          in {post.category}
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text">
                          {post.timeAgo}
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox display="flex" gap={2}>
                        <IconButton size="small" sx={{ color: "white" }}>
                          <IoThumbsUpOutline />
                          <VuiTypography variant="caption" color="text" ml={0.5}>
                            {post.likes}
                          </VuiTypography>
                        </IconButton>
                        <IconButton size="small" sx={{ color: "white" }}>
                          <IoChatbubbleOutline />
                          <VuiTypography variant="caption" color="text" ml={0.5}>
                            {post.comments}
                          </VuiTypography>
                        </IconButton>
                        <IconButton size="small" sx={{ color: "white" }}>
                          <IoShareOutline />
                        </IconButton>
                      </VuiBox>
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

export default Forum; 
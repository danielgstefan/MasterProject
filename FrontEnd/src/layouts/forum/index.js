import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
import { IoThumbsUpOutline, IoThumbsUp } from "react-icons/io5";
import { IoThumbsDownOutline, IoThumbsDown } from "react-icons/io5";
import { IoChatbubbleOutline } from "react-icons/io5";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";

// Services
import ForumService from "services/ForumService";
import AuthService from "services/AuthService";

function Forum() {
  // State for posts and UI
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [postLikes, setPostLikes] = useState({});

  // State for creating/editing posts
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // State for notifications
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  // Fetch like information for a post
  const fetchLikeInfo = async (postId) => {
    try {
      const response = await ForumService.getLikeInfo(postId);
      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          likeCount: response.data.likeCount,
          userLikeStatus: response.data.userLikeStatus
        }
      }));
    } catch (err) {
      console.error(`Error fetching like info for post ${postId}:`, err);
    }
  };

  // Fetch posts from the backend
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCategory) {
        response = await ForumService.getPostsByCategory(selectedCategory, currentPage, 10);
      } else {
        response = await ForumService.getAllPosts(currentPage, 10);
      }
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);

      // Fetch like information for each post
      response.data.content.forEach(post => {
        fetchLikeInfo(post.id);
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch categories (in a real app, this would come from the backend)
  const fetchCategories = () => {
    // For now, we'll use static categories
    const forumCategories = [
      {
        id: 1,
        name: "General Discussion",
        description: "General topics about BMW cars and ownership",
      },
      {
        id: 2,
        name: "Technical Support",
        description: "Technical questions and solutions",
      },
      {
        id: 3,
        name: "Modifications & Tuning",
        description: "Discuss modifications and tuning projects",
      },
      {
        id: 4,
        name: "Show & Shine",
        description: "Share photos of your BMW",
      }
    ];
    setCategories(forumCategories);
  };

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory.trim()) {
      setNotification({
        open: true,
        message: "Please fill in all fields",
        severity: "error"
      });
      return;
    }

    try {
      if (editingPost) {
        // Update existing post
        await ForumService.updatePost(
          editingPost.id,
          newPostTitle,
          newPostContent,
          newPostCategory
        );
        setNotification({
          open: true,
          message: "Post updated successfully",
          severity: "success"
        });
      } else {
        // Create new post
        await ForumService.createPost(
          newPostTitle,
          newPostContent,
          newPostCategory
        );
        setNotification({
          open: true,
          message: "Post created successfully",
          severity: "success"
        });
      }

      // Reset form and refresh posts
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("");
      setOpenPostDialog(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating/updating post:", err);
      setNotification({
        open: true,
        message: "Failed to save post. Please try again.",
        severity: "error"
      });
    }
  };

  // Handle opening the post dialog
  const handleOpenPostDialog = (post = null) => {
    if (post) {
      // Editing existing post
      setEditingPost(post);
      setNewPostTitle(post.title);
      setNewPostContent(post.content);
      setNewPostCategory(post.category);
    } else {
      // Creating new post
      setEditingPost(null);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory(categories[0]?.name || "");
    }
    setOpenPostDialog(true);
  };

  // Handle closing the post dialog
  const handleClosePostDialog = () => {
    setOpenPostDialog(false);
    setEditingPost(null);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await ForumService.deletePost(postId);
        setNotification({
          open: true,
          message: "Post deleted successfully",
          severity: "success"
        });
        fetchPosts();
      } catch (err) {
        console.error("Error deleting post:", err);
        setNotification({
          open: true,
          message: "Failed to delete post. Please try again.",
          severity: "error"
        });
      }
    }
  };

  // Handle liking/disliking a post
  const handleLikePost = async (postId, isLike) => {
    if (!isAuthenticated) {
      setNotification({
        open: true,
        message: "Please log in to like posts",
        severity: "info"
      });
      return;
    }

    try {
      const currentLikeStatus = postLikes[postId]?.userLikeStatus;

      // If user already liked/disliked and clicks the same button, remove the like
      if ((isLike && currentLikeStatus === true) || (!isLike && currentLikeStatus === false)) {
        await ForumService.removeLike(postId);
        setNotification({
          open: true,
          message: "Reaction removed",
          severity: "success"
        });
      } else {
        // Otherwise, set the new like/dislike
        if (isLike) {
          await ForumService.likePost(postId);
          setNotification({
            open: true,
            message: "Post liked",
            severity: "success"
          });
        } else {
          await ForumService.dislikePost(postId);
          setNotification({
            open: true,
            message: "Post disliked",
            severity: "success"
          });
        }
      }

      // Refresh like info for this post
      fetchLikeInfo(postId);
    } catch (err) {
      console.error("Error liking/disliking post:", err);
      setNotification({
        open: true,
        message: "Failed to process your reaction. Please try again.",
        severity: "error"
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Check if user can edit/delete a post
  const canEditPost = (post) => {
    if (!isAuthenticated || !currentUser) return false;
    return post.author.id === currentUser.id || 
           (currentUser.roles && currentUser.roles.includes("ROLE_ADMIN"));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <VuiBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
              <VuiBox>
                <VuiTypography variant="h2" fontWeight="bold" color="white">
                  BMW Forum
                </VuiTypography>
                <VuiTypography variant="body2" color="text">
                  Join the discussion with fellow BMW enthusiasts
                </VuiTypography>
              </VuiBox>

              {/* Category Filter */}
              <VuiBox>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="category-select-label" sx={{ color: "white" }}>
                    Filter by Category
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.4)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </VuiBox>
            </VuiBox>
          </Grid>

          {/* Create New Post Button (only for authenticated users) */}
          {isAuthenticated && (
            <Grid item xs={12}>
              <Card>
                <VuiBox p={3}>
                  <VuiButton
                    variant="contained"
                    color="info"
                    startIcon={<IoCreateOutline />}
                    onClick={() => handleOpenPostDialog()}
                    fullWidth
                  >
                    Create New Post
                  </VuiButton>
                </VuiBox>
              </Card>
            </Grid>
          )}

          {/* Categories */}
          <Grid item xs={12}>
            <VuiTypography variant="h5" fontWeight="bold" color="white" mb={2}>
              Categories
            </VuiTypography>
            <Grid container spacing={3}>
              {categories.map((category) => (
                <Grid item xs={12} md={6} key={category.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <VuiBox p={3}>
                      <VuiTypography variant="h6" fontWeight="bold" color="white">
                        {category.name}
                      </VuiTypography>
                      <VuiTypography variant="body2" color="text" mb={2}>
                        {category.description}
                      </VuiTypography>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Posts */}
          <Grid item xs={12}>
            <VuiTypography variant="h5" fontWeight="bold" color="white" mb={2}>
              {selectedCategory ? `Posts in ${selectedCategory}` : "All Posts"}
            </VuiTypography>

            {/* Loading indicator */}
            {loading && (
              <VuiBox display="flex" justifyContent="center" p={5}>
                <CircularProgress color="info" />
              </VuiBox>
            )}

            {/* Error message */}
            {error && (
              <Card>
                <VuiBox p={3} textAlign="center">
                  <VuiTypography color="error" variant="body2">
                    {error}
                  </VuiTypography>
                  <VuiButton 
                    variant="contained" 
                    color="info" 
                    onClick={fetchPosts}
                    sx={{ mt: 2 }}
                  >
                    Try Again
                  </VuiButton>
                </VuiBox>
              </Card>
            )}

            {/* No posts message */}
            {!loading && !error && posts.length === 0 && (
              <Card>
                <VuiBox p={3} textAlign="center">
                  <VuiTypography color="text" variant="body2">
                    No posts found. {isAuthenticated ? "Be the first to create a post!" : "Please log in to create a post."}
                  </VuiTypography>
                </VuiBox>
              </Card>
            )}

            {/* Posts list */}
            <Grid container spacing={3}>
              {!loading && !error && posts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
                    <VuiBox p={3}>
                      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <VuiTypography variant="h6" fontWeight="bold" color="white">
                          {post.title}
                        </VuiTypography>

                        {/* Edit/Delete buttons for post owner */}
                        {canEditPost(post) && (
                          <VuiBox>
                            <IconButton 
                              size="small" 
                              sx={{ color: "white" }}
                              onClick={() => handleOpenPostDialog(post)}
                            >
                              <IoPencilOutline />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ color: "white" }}
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <IoTrashOutline />
                            </IconButton>
                          </VuiBox>
                        )}
                      </VuiBox>

                      <VuiBox display="flex" alignItems="center" mb={2}>
                        <VuiTypography variant="caption" color="text" mr={2}>
                          Posted by {post.author.username}
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" mr={2}>
                          in {post.category}
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text">
                          {formatDate(post.createdAt)}
                        </VuiTypography>
                      </VuiBox>

                      <VuiTypography variant="body2" color="text" mb={2}>
                        {post.content}
                      </VuiTypography>

                      <VuiBox display="flex" gap={2} alignItems="center">
                        {/* Like button */}
                        <VuiBox display="flex" alignItems="center">
                          <IconButton 
                            size="small" 
                            sx={{ color: postLikes[post.id]?.userLikeStatus === true ? "info.main" : "white" }}
                            onClick={() => handleLikePost(post.id, true)}
                            disabled={!isAuthenticated}
                          >
                            {postLikes[post.id]?.userLikeStatus === true ? <IoThumbsUp /> : <IoThumbsUpOutline />}
                          </IconButton>
                          <VuiTypography variant="caption" color="text">
                            {postLikes[post.id]?.likeCount || 0}
                          </VuiTypography>
                        </VuiBox>

                        {/* Dislike button */}
                        <VuiBox display="flex" alignItems="center">
                          <IconButton 
                            size="small" 
                            sx={{ color: postLikes[post.id]?.userLikeStatus === false ? "error.main" : "white" }}
                            onClick={() => handleLikePost(post.id, false)}
                            disabled={!isAuthenticated}
                          >
                            {postLikes[post.id]?.userLikeStatus === false ? <IoThumbsDown /> : <IoThumbsDownOutline />}
                          </IconButton>
                        </VuiBox>

                        {/* Comment button */}
                        <IconButton size="small" sx={{ color: "white" }}>
                          <IoChatbubbleOutline />
                        </IconButton>
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <VuiBox display="flex" justifyContent="center" mt={3}>
                <VuiButton
                  variant="outlined"
                  color="white"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  sx={{ mx: 1 }}
                >
                  Previous
                </VuiButton>
                <VuiTypography variant="body2" color="white" sx={{ alignSelf: "center", mx: 2 }}>
                  Page {currentPage + 1} of {totalPages}
                </VuiTypography>
                <VuiButton
                  variant="outlined"
                  color="white"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  sx={{ mx: 1 }}
                >
                  Next
                </VuiButton>
              </VuiBox>
            )}
          </Grid>
        </Grid>
      </VuiBox>

      {/* Create/Edit Post Dialog */}
      <Dialog 
        open={openPostDialog} 
        onClose={handleClosePostDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#1a1f37",
            color: "white",
          },
        }}
      >
        <DialogTitle>
          {editingPost ? "Edit Post" : "Create New Post"}
        </DialogTitle>
        <DialogContent>
          <VuiBox mb={2} mt={1}>
            <TextField
              fullWidth
              label="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
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
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </VuiBox>
          <VuiBox mb={2}>
            <FormControl fullWidth>
              <InputLabel id="category-label" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </VuiBox>
        </DialogContent>
        <DialogActions>
          <VuiButton onClick={handleClosePostDialog} color="white" variant="outlined">
            Cancel
          </VuiButton>
          <VuiButton onClick={handleCreatePost} color="info" variant="contained">
            {editingPost ? "Update" : "Create"}
          </VuiButton>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Forum; 

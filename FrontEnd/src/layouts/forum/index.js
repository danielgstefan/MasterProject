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
import LinearProgress from "@mui/material/LinearProgress";

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

  // State for comments
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentListVersion, setCommentListVersion] = useState({});

  // State for creating/editing posts
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [touched, setTouched] = useState({
    title: false,
    content: false,
    category: false
  });

  // State for photos
  const [postPhotos, setPostPhotos] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

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

  // Fetch photos for a post
  const fetchPostPhotos = async (postId) => {
    try {
      const response = await ForumService.getPostPhotos(postId);
      setPostPhotos(prev => ({
        ...prev,
        [postId]: response.data
      }));

      // If editing a post, we want to show the existing photos
      if (editingPost && editingPost.id === postId) {
        // Clear any previously selected files
        setSelectedFiles([]);
        setPreviewImages([]);

        // We don't actually load the files here since we can't get them back from the server
        // But we can show the existing photos in the UI if needed
        // This would require additional UI in the dialog to show existing photos
      }
    } catch (err) {
      console.error(`Error fetching photos for post ${postId}:`, err);
    }
  };

  // Fetch like information for a post
  const fetchLikeInfo = async (postId) => {
    try {
      const response = await ForumService.getLikeInfo(postId);
      setPostLikes(prev => ({
        ...prev,
        [postId]: {
          likeCount: response.data.likeCount,
          likesCount: response.data.likesCount,
          dislikesCount: response.data.dislikesCount,
          userLikeStatus: response.data.userLikeStatus
        }
      }));
    } catch (err) {
      console.error(`Error fetching like info for post ${postId}:`, err);
    }
  };

  // Fetch comment count for a post
  const fetchCommentCount = async (postId) => {
    try {
      const response = await ForumService.getCommentsByPostId(postId);
      setCommentCounts(prev => ({ 
        ...prev, 
        [postId]: response.data.content.length 
      }));
    } catch (err) {
      console.error(`Error fetching comment count for post ${postId}:`, err);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    if (loadingComments[postId]) return;

    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await ForumService.getCommentsByPostId(postId);
      setComments(prev => ({ ...prev, [postId]: response.data.content }));
      setExpandedComments(prev => ({ ...prev, [postId]: true }));

      // Update comment count as well
      setCommentCounts(prev => ({ 
        ...prev, 
        [postId]: response.data.content.length 
      }));
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      setNotification({
        open: true,
        message: "Failed to load comments. Please try again.",
        severity: "error"
      });
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Create a new comment
  const handleCreateComment = async (postId) => {
    const commentText = newComments[postId] || "";

    if (!commentText.trim()) {
      setNotification({
        open: true,
        message: "Comment cannot be empty",
        severity: "error"
      });
      return;
    }

    try {
      await ForumService.createComment(postId, commentText);
      setNewComments(prev => ({ ...prev, [postId]: "" }));
      setNotification({
        open: true,
        message: "Comment added successfully",
        severity: "success"
      });
      fetchComments(postId);
    } catch (err) {
      console.error(`Error creating comment for post ${postId}:`, err);
      setNotification({
        open: true,
        message: "Failed to add comment. Please try again.",
        severity: "error"
      });
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    if (expandedComments[postId]) {
      // If comments are already expanded, collapse them
      setExpandedComments(prev => ({ ...prev, [postId]: false }));
    } else {
      // If comments are collapsed, fetch and expand them
      fetchComments(postId);
    }
  };

  // Handle starting to edit a comment
  const startEditComment = (comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  };

  // Handle saving the edited comment
  const handleEditComment = async (comment) => {
    if (!editCommentContent.trim()) {
      setNotification({
        open: true,
        message: "Comment cannot be empty",
        severity: "error"
      });
      return;
    }

    try {
      // Find which post this comment belongs to by searching through all posts' comments
      let foundPostId = null;
      Object.entries(comments).forEach(([postId, postComments]) => {
        if (postComments.some(c => c.id === comment.id)) {
          foundPostId = postId;
        }
      });

      if (!foundPostId) {
        throw new Error("Could not find the post for this comment");
      }

      await ForumService.updateComment(comment.id, editCommentContent);

      // Update the comments state with the new content
      setComments(prev => ({
        ...prev,
        [foundPostId]: prev[foundPostId].map(c =>
          c.id === comment.id ? { ...c, content: editCommentContent } : c
        )
      }));

      // Force re-render of comments
      setCommentListVersion(prev => ({
        ...prev,
        [foundPostId]: (prev[foundPostId] || 0) + 1
      }));

      // Reset editing state
      setEditingComment(null);
      setEditCommentContent("");

      setNotification({
        open: true,
        message: "Comment updated successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Error updating comment:", err);
      setNotification({
        open: true,
        message: "Failed to update comment. Please try again.",
        severity: "error"
      });
    }
  };

  const handleDeleteComment = async (comment) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        // Find which post this comment belongs to
        let foundPostId = null;
        Object.entries(comments).forEach(([postId, postComments]) => {
          if (postComments.some(c => c.id === comment.id)) {
            foundPostId = postId;
          }
        });

        if (!foundPostId) {
          throw new Error("Could not find the post for this comment");
        }

        await ForumService.deleteComment(comment.id);

        // Update local state immediately
        setComments(prev => ({
          ...prev,
          [foundPostId]: prev[foundPostId].filter(c => c.id !== comment.id)
        }));

        // Update comment count
        setCommentCounts(prev => ({
          ...prev,
          [foundPostId]: Math.max(0, (prev[foundPostId] || 1) - 1)
        }));

        // Force re-render of comments
        setCommentListVersion(prev => ({
          ...prev,
          [foundPostId]: (prev[foundPostId] || 0) + 1
        }));

      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  // Handle canceling comment edit
  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent("");
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

      // Fetch like information, comment counts, and photos for each post
      response.data.content.forEach(post => {
        fetchLikeInfo(post.id);
        fetchCommentCount(post.id);
        fetchPostPhotos(post.id);
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please log in.");
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

  // Handle file selection for post creation
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    // Create preview URLs for the selected files
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle removing a selected file
  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]); // Free up memory
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return 'Title is required';
        }
        if (value.length < 5) {
          return 'Title must be at least 5 characters long';
        }
        if (value.length > 100) {
          return 'Title must not exceed 100 characters';
        }
        break;
      case 'content':
        if (!value.trim()) {
          return 'Content is required';
        }
        if (value.length < 10) {
          return 'Content must be at least 10 characters long';
        }
        if (value.length > 2000) {
          return 'Content must not exceed 2000 characters';
        }
        break;
      case 'category':
        if (!value) {
          return 'Please select a category';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleFieldChange = (event, field) => {
    const value = event.target.value;

    // Update the field value
    switch (field) {
      case 'title':
        setNewPostTitle(value);
        break;
      case 'content':
        setNewPostContent(value);
        break;
      case 'category':
        setNewPostCategory(value);
        break;
      default:
        break;
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    // Validate field
    setFormErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const value = field === 'title' ? newPostTitle :
                 field === 'content' ? newPostContent :
                 field === 'category' ? newPostCategory : '';

    setFormErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  const validateForm = () => {
    const errors = {
      title: validateField('title', newPostTitle),
      content: validateField('content', newPostContent),
      category: validateField('category', newPostCategory)
    };

    setFormErrors(errors);
    setTouched({
      title: true,
      content: true,
      category: true
    });

    return !Object.values(errors).some(error => error !== '');
  };

  const handleCreateOrUpdatePost = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let postId;

      if (editingPost) {
        // Update existing post
        const response = await ForumService.updatePost(
          editingPost.id,
          newPostTitle,
          newPostContent,
          newPostCategory
        );
        postId = editingPost.id;
        setNotification({
          open: true,
          message: "Post updated successfully",
          severity: "success"
        });
      } else {
        // Create new post
        const response = await ForumService.createPost(
          newPostTitle,
          newPostContent,
          newPostCategory
        );
        postId = response.data.id;
        setNotification({
          open: true,
          message: "Post created successfully",
          severity: "success"
        });
      }

      // Upload photos if any are selected
      if (selectedFiles.length > 0) {
        setUploadProgress(0);
        for (let i = 0; i < selectedFiles.length; i++) {
          try {
            await ForumService.uploadPhoto(postId, selectedFiles[i]);
            setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
          } catch (error) {
            console.error("Error uploading photo:", error);
            setNotification({
              open: true,
              message: `Error uploading photo ${i + 1}. Post was created but some photos may be missing.`,
              severity: "warning"
            });
          }
        }
      }

      // Reset form and refresh posts
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("");
      setSelectedFiles([]);
      setPreviewImages([]);
      setUploadProgress(0);
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

      // Fetch photos for the post if editing
      fetchPostPhotos(post.id);
    } else {
      // Creating new post
      setEditingPost(null);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory(categories[0]?.name || "");
      setSelectedFiles([]);
      setPreviewImages([]);
    }
    setOpenPostDialog(true);
  };

  // Reset form state when dialog closes
  const handleClosePostDialog = () => {
    setOpenPostDialog(false);
    setEditingPost(null);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("");
    setSelectedFiles([]);
    setPreviewImages([]);
    setFormErrors({
      title: "",
      content: "",
      category: ""
    });
    setTouched({
      title: false,
      content: false,
      category: false
    });
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

  // Check if user can edit/delete a comment
  const canEditComment = (comment) => {
    if (!isAuthenticated || !currentUser) return false;
    return comment.author.id === currentUser.id || 
           (currentUser.roles && currentUser.roles.includes("ROLE_ADMIN"));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          {}
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

              {}
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

          {}
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

          {}
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

          {}
          <Grid item xs={12}>
            <VuiTypography variant="h5" fontWeight="bold" color="white" mb={2}>
              {selectedCategory ? `Posts in ${selectedCategory}` : "All Posts"}
            </VuiTypography>

            {}
            {!isAuthenticated && (
              <Card>
                <VuiBox p={3} textAlign="center">
                  <VuiTypography color="white" variant="body2">
                    Please log in to view and interact with forum posts.
                  </VuiTypography>
                  <VuiButton
                    variant="contained"
                    color="info"
                    onClick={() => window.location.href = '/authentication/sign-in'}
                    sx={{ mt: 2 }}
                  >
                    Log in
                  </VuiButton>
                </VuiBox>
              </Card>
            )}

            {isAuthenticated && (
              <>
                {loading && (
                  <VuiBox display="flex" justifyContent="center" p={5}>
                    <CircularProgress color="info" />
                  </VuiBox>
                )}

                {!loading && posts.length === 0 && (
                  <Card>
                    <VuiBox p={3} textAlign="center">
                      <VuiTypography color="text" variant="body2">
                        No posts found. Be the first to create a post!
                      </VuiTypography>
                    </VuiBox>
                  </Card>
                )}

                {!loading && posts.map((post) => (
                  <Grid item xs={12} key={post.id}>
                    <Card>
                      <VuiBox p={3}>
                        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <VuiTypography variant="h6" fontWeight="bold" color="white">
                            {post.title}
                          </VuiTypography>

                          {}
                          {canEditPost(post) && (
                            <VuiBox>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#0f1535",
                                  backgroundColor: "white",
                                  "&:hover": {
                                    backgroundColor: "white"
                                  },
                                  mx: 0.5
                                }}
                                onClick={() => handleOpenPostDialog(post)}
                              >
                                <IoPencilOutline size={18} />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "#0f1535",
                                  backgroundColor: "white",
                                  "&:hover": {
                                    backgroundColor: "white"
                                  },
                                  mx: 0.5
                                }}
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <IoTrashOutline size={18} />
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

                        {/* Display post photos if available */}
                        {postPhotos[post.id] && postPhotos[post.id].length > 0 && (
                          <VuiBox mb={2}>
                            <VuiBox
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                maxHeight: '300px',
                                overflowY: 'auto',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                                p: 1
                              }}
                            >
                              {postPhotos[post.id].map((photo) => (
                                <VuiBox
                                  key={photo.id}
                                  sx={{
                                    width: '120px',
                                    height: '120px'
                                  }}
                                >
                                  <img
                                    src={`http://localhost:8081${photo.url}`}
                                    alt={photo.title || "Post image"}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                      setSelectedPhoto(photo);
                                      setPhotoDialogOpen(true);
                                    }}
                                  />
                                </VuiBox>
                              ))}
                            </VuiBox>
                          </VuiBox>
                        )}

                        <VuiBox display="flex" gap={2} alignItems="center">
                          {}
                          <VuiBox display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              sx={{ color: postLikes[post.id]?.userLikeStatus === true ? "info.main" : "white" }}
                              onClick={() => handleLikePost(post.id, true)}
                              disabled={!isAuthenticated}
                            >
                              {postLikes[post.id]?.userLikeStatus === true ? <IoThumbsUp /> : <IoThumbsUpOutline />}
                            </IconButton>
                            <VuiTypography variant="caption" color="info.main">
                              {postLikes[post.id]?.likesCount || 0}
                            </VuiTypography>
                          </VuiBox>

                          {}
                          <VuiBox display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              sx={{ color: postLikes[post.id]?.userLikeStatus === false ? "error.main" : "white" }}
                              onClick={() => handleLikePost(post.id, false)}
                              disabled={!isAuthenticated}
                            >
                              {postLikes[post.id]?.userLikeStatus === false ? <IoThumbsDown /> : <IoThumbsDownOutline />}
                            </IconButton>
                            <VuiTypography variant="caption" color="error.main">
                              {postLikes[post.id]?.dislikesCount || 0}
                            </VuiTypography>
                          </VuiBox>

                          {}
                          <VuiBox display="flex" alignItems="center">
                            <IconButton
                              size="small"
                              sx={{ color: expandedComments[post.id] ? "info.main" : "white" }}
                              onClick={() => toggleComments(post.id)}
                            >
                              <IoChatbubbleOutline />
                            </IconButton>
                            <VuiTypography variant="caption" color="text">
                              {commentCounts[post.id] || 0}
                            </VuiTypography>
                          </VuiBox>
                        </VuiBox>

                        {}
                        {expandedComments[post.id] && (
                            <VuiBox
                                key={`comments-${commentListVersion[post.id] || 0}`}
                                mt={3}
                                pl={2}
                                pr={2}
                                pb={2}
                            >
                            <VuiTypography variant="subtitle2" color="white" mb={2}>
                              Comments
                            </VuiTypography>

                            {}
                            {loadingComments[post.id] && (
                              <VuiBox display="flex" justifyContent="center" p={2}>
                                <CircularProgress color="info" size={20} />
                              </VuiBox>
                            )}

                            {}
                            {!loadingComments[post.id] && comments[post.id] && comments[post.id].length > 0 ? (
                              <VuiBox>
                                {comments[post.id].map((comment) => (
                                  <Card key={comment.id} sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
                                    <VuiBox p={2}>
                                      <VuiBox display="flex" justifyContent="space-between" mb={1}>
                                        <VuiTypography variant="caption" color="info.main">
                                          {comment.author.username}
                                        </VuiTypography>
                                        <VuiBox display="flex" alignItems="center">
                                          <VuiTypography variant="caption" color="text" mr={2}>
                                            {formatDate(comment.createdAt)}
                                          </VuiTypography>
                                          {}
                                          {canEditComment(comment) && (
                                            <VuiBox>
                                              <IconButton
                                                size="small"
                                                sx={{
                                                  color: "#0f1535",
                                                  p: 0.5,
                                                  backgroundColor: "white",
                                                  "&:hover": {
                                                    backgroundColor: "white"
                                                  },
                                                  mx: 0.5
                                                }}
                                                onClick={() => startEditComment(comment)}
                                              >
                                                <IoPencilOutline size={16} />
                                              </IconButton>
                                              <IconButton
                                                size="small"
                                                sx={{
                                                  color: "#0f1535",
                                                  p: 0.5,
                                                  backgroundColor: "white",
                                                  "&:hover": {
                                                    backgroundColor: "white"
                                                  },
                                                  mx: 0.5
                                                }}
                                                onClick={() => handleDeleteComment(comment)}
                                              >
                                                <IoTrashOutline size={16} />
                                              </IconButton>
                                            </VuiBox>
                                          )}
                                        </VuiBox>
                                      </VuiBox>
                                      {editingComment && editingComment.id === comment.id ? (
                                        // Edit form
                                        <VuiBox>
                                          <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={editCommentContent}
                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                            sx={{
                                              "& .MuiOutlinedInput-root": {
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                                              mb: 1
                                            }}
                                          />
                                          <VuiBox display="flex" justifyContent="flex-end" gap={1}>
                                            <VuiButton
                                              variant="outlined"
                                              color="white"
                                              size="small"
                                              onClick={handleCancelEditComment}
                                            >
                                              Cancel
                                            </VuiButton>
                                            <VuiButton
                                              variant="contained"
                                              color="info"
                                              size="small"
                                              onClick={() => handleEditComment(comment)}
                                            >
                                              Update
                                            </VuiButton>
                                          </VuiBox>
                                        </VuiBox>
                                      ) : (
                                        // Comment content
                                        <VuiTypography variant="body2" color="white">
                                          {comment.content}
                                        </VuiTypography>
                                      )}
                                    </VuiBox>
                                  </Card>
                                ))}
                              </VuiBox>
                            ) : (
                              !loadingComments[post.id] && (
                                <VuiBox p={2} textAlign="center">
                                  <VuiTypography variant="body2" color="text">
                                    No comments yet. Be the first to comment!
                                  </VuiTypography>
                                </VuiBox>
                              )
                            )}

                            {}
                            {isAuthenticated && (
                              <VuiBox mt={2}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  placeholder="Write a comment..."
                                  value={newComments[post.id] || ""}
                                  onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
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
                                <VuiBox display="flex" justifyContent="flex-end" mt={1}>
                                  <VuiButton
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    onClick={() => handleCreateComment(post.id)}
                                  >
                                    Post Comment
                                  </VuiButton>
                                </VuiBox>
                              </VuiBox>
                            )}
                          </VuiBox>
                        )}
                      </VuiBox>
                    </Card>
                  </Grid>
                ))}

                {}
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
              </>
            )}
          </Grid>
        </Grid>
      </VuiBox>

      {}
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
              onBlur={() => handleFieldBlur('title')}
              error={touched.title && Boolean(formErrors.title)}
              helperText={touched.title && formErrors.title}
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
              onBlur={() => handleFieldBlur('content')}
              error={touched.content && Boolean(formErrors.content)}
              helperText={touched.content && formErrors.content}
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
                onBlur={() => handleFieldBlur('category')}
                error={touched.category && Boolean(formErrors.category)}
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

          {/* Photo upload section */}
          <VuiBox mb={2}>
            <VuiTypography variant="subtitle2" color="white" mb={1}>
              Add Photos (Optional)
            </VuiTypography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                display: 'none'
              }}
              id="post-photo-input"
            />
            <label htmlFor="post-photo-input">
              <VuiButton
                component="span"
                variant="outlined"
                color="white"
                fullWidth
                sx={{ mb: 2 }}
              >
                Select Photos
              </VuiButton>
            </label>

            {/* Preview of selected images */}
            {previewImages.length > 0 && (
              <VuiBox>
                <VuiTypography variant="caption" color="white" mb={1}>
                  Selected Photos ({previewImages.length})
                </VuiTypography>
                <VuiBox
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    p: 1
                  }}
                >
                  {previewImages.map((preview, index) => (
                    <VuiBox
                      key={index}
                      sx={{
                        position: 'relative',
                        width: '80px',
                        height: '80px'
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(index)}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          p: '4px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          }
                        }}
                      >
                        <IoTrashOutline size={14} />
                      </IconButton>
                    </VuiBox>
                  ))}
                </VuiBox>
              </VuiBox>
            )}

            {/* Upload progress indicator */}
            {uploadProgress > 0 && (
              <VuiBox mt={2}>
                <VuiTypography variant="caption" color="white" mb={1}>
                  Uploading: {uploadProgress}%
                </VuiTypography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'info.main'
                    }
                  }}
                />
              </VuiBox>
            )}
          </VuiBox>
        </DialogContent>
        <DialogActions>
          <VuiButton onClick={handleClosePostDialog} color="white" variant="outlined">
            Cancel
          </VuiButton>
          <VuiButton onClick={handleCreateOrUpdatePost} color="info" variant="contained">
            {editingPost ? "Update" : "Create"}
          </VuiButton>
        </DialogActions>
      </Dialog>

      {}
      {/* Photo Dialog */}
      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="lg"
        PaperProps={{
          style: {
            backgroundColor: "#1a1f37",
            color: "white",
            maxWidth: "90vw",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogContent>
          {selectedPhoto && (
            <VuiBox
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`http://localhost:8081${selectedPhoto.url}`}
                alt={selectedPhoto.title || "Post image"}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}
              />
              {selectedPhoto.title && (
                <VuiTypography variant="h6" color="white" textAlign="center">
                  {selectedPhoto.title}
                </VuiTypography>
              )}
              {selectedPhoto.description && (
                <VuiTypography variant="body2" color="text" textAlign="center">
                  {selectedPhoto.description}
                </VuiTypography>
              )}
            </VuiBox>
          )}
        </DialogContent>
        <DialogActions>
          <VuiButton onClick={() => setPhotoDialogOpen(false)} color="white" variant="outlined">
            Close
          </VuiButton>
        </DialogActions>
      </Dialog>

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

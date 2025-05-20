import { useState, useEffect, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
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
import { IoSend } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";

// Services
import ChatService from "services/ChatService";
import AuthService from "services/AuthService";

function Chat() {
  // State for messages and UI
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const messagesEndRef = useRef(null);

  // State for notifications
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  // Fetch messages on component mount and set up refresh interval
  useEffect(() => {
    fetchMessages();
    
    // Set up interval to refresh messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages(false); // Don't show loading indicator for refreshes
    }, 5000);
    
    setRefreshInterval(interval);
    
    // Clean up interval on component unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [currentPage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages from the backend
  const fetchMessages = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      const response = await ChatService.getChatHistory(currentPage, 50);
      setMessages(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again later.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setNotification({
        open: true,
        message: "Message cannot be empty",
        severity: "error"
      });
      return;
    }

    try {
      await ChatService.sendMessage(newMessage);
      setNewMessage("");
      fetchMessages(false);
      setNotification({
        open: true,
        message: "Message sent successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setNotification({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error"
      });
    }
  };

  // Handle deleting a message (admin only)
  const handleDeleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await ChatService.deleteMessage(id);
        fetchMessages(false);
        setNotification({
          open: true,
          message: "Message deleted successfully",
          severity: "success"
        });
      } catch (err) {
        console.error("Error deleting message:", err);
        setNotification({
          open: true,
          message: "Failed to delete message. Please try again.",
          severity: "error"
        });
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <VuiBox mb={3}>
              <VuiTypography variant="h2" fontWeight="bold" color="white">
                Live Chat
              </VuiTypography>
              <VuiTypography variant="body2" color="text">
                Chat with other members in real-time
              </VuiTypography>
            </VuiBox>
          </Grid>

          {/* Chat Container */}
          <Grid item xs={12}>
            <Card sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
              {/* Messages Area */}
              <VuiBox 
                p={3} 
                sx={{ 
                  flexGrow: 1, 
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Loading indicator */}
                {loading && (
                  <VuiBox display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <CircularProgress color="info" />
                  </VuiBox>
                )}

                {/* Error message */}
                {error && !loading && (
                  <VuiBox textAlign="center" sx={{ height: "100%" }}>
                    <VuiTypography color="error" variant="body2">
                      {error}
                    </VuiTypography>
                    <VuiButton 
                      variant="contained" 
                      color="info" 
                      onClick={() => fetchMessages()}
                      sx={{ mt: 2 }}
                    >
                      Try Again
                    </VuiButton>
                  </VuiBox>
                )}

                {/* No messages */}
                {!loading && !error && messages.length === 0 && (
                  <VuiBox 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    sx={{ height: "100%" }}
                  >
                    <VuiTypography color="text" variant="body2">
                      No messages yet. Be the first to send a message!
                    </VuiTypography>
                  </VuiBox>
                )}

                {/* Messages list */}
                {!loading && !error && messages.length > 0 && (
                  <VuiBox>
                    {messages.map((message) => (
                      <VuiBox 
                        key={message.id} 
                        mb={2}
                        display="flex"
                        flexDirection="column"
                        sx={{
                          alignSelf: message.sender.username === currentUser?.username ? "flex-end" : "flex-start",
                          maxWidth: "80%",
                        }}
                      >
                        <Card 
                          sx={{ 
                            backgroundColor: message.sender.username === currentUser?.username 
                              ? "info.main" 
                              : "rgba(255, 255, 255, 0.05)",
                            p: 2,
                            borderRadius: "15px",
                            borderTopRightRadius: message.sender.username === currentUser?.username ? "0" : "15px",
                            borderTopLeftRadius: message.sender.username === currentUser?.username ? "15px" : "0",
                          }}
                        >
                          <VuiBox display="flex" justifyContent="space-between" mb={1}>
                            <VuiTypography 
                              variant="caption" 
                              color={message.sender.username === currentUser?.username ? "white" : "info.main"}
                              fontWeight="bold"
                            >
                              {message.sender.username}
                            </VuiTypography>
                            {isAdmin && (
                              <IconButton 
                                size="small" 
                                sx={{ color: "white", p: 0, ml: 1 }}
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <IoTrashOutline size={14} />
                              </IconButton>
                            )}
                          </VuiBox>
                          <VuiTypography variant="body2" color="white">
                            {message.message}
                          </VuiTypography>
                        </Card>
                        <VuiTypography 
                          variant="caption" 
                          color="text"
                          sx={{ 
                            alignSelf: message.sender.username === currentUser?.username ? "flex-end" : "flex-start",
                            mt: 0.5
                          }}
                        >
                          {formatDate(message.timestamp)}
                        </VuiTypography>
                      </VuiBox>
                    ))}
                    <div ref={messagesEndRef} />
                  </VuiBox>
                )}
              </VuiBox>

              {/* Input Area */}
              {isAuthenticated ? (
                <VuiBox p={3} display="flex" alignItems="center">
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "15px",
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
                  <VuiButton
                    variant="contained"
                    color="info"
                    sx={{ ml: 2, minWidth: "auto", borderRadius: "50%" }}
                    onClick={handleSendMessage}
                  >
                    <IoSend />
                  </VuiButton>
                </VuiBox>
              ) : (
                <VuiBox p={3} textAlign="center">
                  <VuiTypography color="text" variant="body2">
                    Please log in to participate in the chat.
                  </VuiTypography>
                </VuiBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </VuiBox>

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

export default Chat;
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

  // Check if user is authenticated (using state to ensure reactivity)
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN");

  // Listen for authentication changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setCurrentUser(AuthService.getCurrentUser());
    };

    // Check auth status initially and set up interval to check periodically
    checkAuth();
    const authCheckInterval = setInterval(checkAuth, 2000);

    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  // Connect to WebSocket and fetch initial messages on component mount
  useEffect(() => {
    // Only connect to WebSocket and fetch messages if user is authenticated
    if (isAuthenticated) {
      // Fetch initial messages
      fetchMessages();

      // Connect to WebSocket
      const handleNewMessage = (message) => {
        // Add the new message to the messages array if it's not already there
        setMessages(prevMessages => {
          // Check if the message is already in the array
          const messageExists = prevMessages.some(m => m.id === message.id);
          if (messageExists) {
            return prevMessages;
          }

          // Add the new message and sort by timestamp
          const updatedMessages = [...prevMessages, message].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );

          return updatedMessages;
        });
      };

      // Connect to WebSocket
      ChatService.connect(handleNewMessage)
        .catch(err => {
          console.error("Error connecting to WebSocket:", err);

          // Fall back to polling if WebSocket connection fails
          const interval = setInterval(() => {
            fetchMessages(false); // Don't show loading indicator for refreshes
          }, 5000);

          setRefreshInterval(interval);
        });
    } else {
      // If not authenticated, clear any existing messages and set loading to false
      setMessages([]);
      setLoading(false);
    }

    // Clean up on component unmount
    return () => {
      // Disconnect from WebSocket
      ChatService.disconnect();

      // Clear any polling interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [currentPage, isAuthenticated]);

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
    // Don't fetch if user is not authenticated
    if (!isAuthenticated) {
      setMessages([]);
      setLoading(false);
      return;
    }

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
      // Trimiți mesajul (fără să îl adaugi în state direct)
      await ChatService.sendMessageWs(newMessage);
      setNewMessage("");

      // Nu mai adaugi manual în `setMessages`!
      // Vei primi mesajul în `handleNewMessage()` prin WebSocket

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

        // No need to fetch messages as the deletion notification will come through the WebSocket
        // But we'll keep this as a fallback in case the WebSocket is not working
        if (!ChatService.connected) {
          fetchMessages(false);
        }

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
          {}
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

          {}
          <Grid item xs={12}>
            <Card sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
              {}
              <VuiBox 
                p={3} 
                sx={{ 
                  flexGrow: 1, 
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {}
                {loading && (
                  <VuiBox display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <CircularProgress color="primary" />
                  </VuiBox>
                )}

                {}
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

                {}
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

                {}
                {!loading && !error && messages.length > 0 && (
                  <VuiBox>
                    {messages.map((message) => (
                      <VuiBox 
                        key={message.id} 
                        mb={2}
                        display="flex"
                        flexDirection="column"
                        sx={{
                          alignSelf: message.senderUsername === currentUser?.username ? "flex-end" : "flex-start",
                          maxWidth: "80%",
                        }}
                      >
                        <Card 
                          sx={{
                            backgroundColor: message.senderUsername === currentUser?.username
                                ? "#1A73E8"
                              : "rgba(255, 255, 255, 0.05)",
                            p: 2,
                            borderRadius: "15px",
                            borderTopRightRadius: message.senderUsername === currentUser?.username ? "0" : "15px",
                            borderTopLeftRadius: message.senderUsername === currentUser?.username ? "15px" : "0",
                          }}
                        >
                          <VuiBox display="flex" justifyContent="space-between" mb={1}>
                            <VuiTypography
                                variant="caption"
                                color={message.senderUsername === currentUser?.username ? "white" : "info"}
                                fontWeight="bold"
                            >
                              {message.senderUsername}
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
                            alignSelf: message.senderUsername === currentUser?.username ? "flex-end" : "flex-start",
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

              {}
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

      {}
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

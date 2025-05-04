import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await AuthService.login(username, password);
      if (data && data.token) {
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles
        };
        
        if (userData.username) { // Make sure we have at least a username
          login(userData);
          history.push("/dashboard");
        } else {
          setError("Invalid user data received");
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Sign In
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SignIn; 
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, CssBaseline, Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const response = await fetch('https://api.natemarcellus.com/sso/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token, username } = await response.json();
      Cookies.set('authToken', token, { domain: '.natemarcellus.com' }); 
      Cookies.set('username', username, { domain: '.natemarcellus.com' });
      
      setError('');
      setSuccess('Login successful! Redirecting...');
      const redirectTo = location.state?.from || 'https://support.natemarcellus.com';
      setTimeout(() => navigate(redirectTo), 2000);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('All fields are required for registration.');
      return;
    }

    const response = await fetch('https://api.natemarcellus.com/sso/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      setError('');
      setSuccess('Registration successful, please log in.');
      setIsLoginMode(true); 
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            {isLoginMode ? 'Login' : 'Register'}
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isLoginMode && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1 }}>
              {isLoginMode ? 'Login' : 'Register'}
            </Button>
          </form>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="text"
              onClick={() => {
                setError('');
                setSuccess('');
                setIsLoginMode(!isLoginMode);
              }}
            >
              {isLoginMode ? 'Create one' : 'Login'}
            </Button>
          </Typography>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => setIsDarkMode(!isDarkMode)}>
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;

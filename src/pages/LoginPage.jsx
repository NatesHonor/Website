import React, { useState } from 'react';
import { Container, TextField, Button, Typography, CssBaseline, Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const api_base_url = process.env.REACT_APP_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const location = useLocation();

  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl) {
      if (redirectUrl.startsWith('http')) return redirectUrl;
      return `${window.location.origin}${redirectUrl}`;
    }
    return window.location.origin;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResendMessage('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const response = await fetch(`${api_base_url}/sso/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid credentials.');
        if (data.resend) {
          setResendMessage('Your email is not verified.');
        }
        return;
      }
      const { token, user } = data;
      const cookieDomain = api_base_url.replace(/^https?:\/\//, '');
      Cookies.set('token', token, { domain: cookieDomain, secure: true, sameSite: 'Strict', expires: 7 });
      Cookies.set('username', user.username, { domain: cookieDomain, secure: true, sameSite: 'Strict', expires: 7 });
      Cookies.set('userId', user.id, { domain: cookieDomain, secure: true, sameSite: 'Strict', expires: 7 });
      Cookies.set('email', user.email, { domain: cookieDomain, secure: true, sameSite: 'Strict', expires: 7 });
      Cookies.set('role', user.role, { domain: cookieDomain, secure: true, sameSite: 'Strict', expires: 7 });
      setSuccess('Login successful! Redirecting...');
      const redirectTo = getRedirectUrl();
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    } catch {
      setError('An error occurred while logging in.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResendMessage('');
    if (!email || !username || !password) {
      setError('All fields are required for registration.');
      return;
    }
    try {
      const response = await fetch(`${api_base_url}/sso/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }
      setSuccess('Registration successful. Please verify your email to log in.');
      setIsLoginMode(true);
    } catch {
      setError('An error occurred while registering.');
    }
  };

  const handleResendVerification = async () => {
    setResendMessage('');
    try {
      const response = await fetch(`${api_base_url}/email/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setResendMessage(data.message || 'Failed to resend verification email.');
        return;
      }
      setResendMessage(data.message || 'Verification email resent successfully.');
    } catch {
      setResendMessage('An error occurred while resending the email.');
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
          {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mt: 1 }}>{success}</Alert>}
          {resendMessage && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <Alert severity="warning">{resendMessage}</Alert>
              <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={handleResendVerification}>
                Resend Verification Email
              </Button>
            </Box>
          )}
          <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
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
                setResendMessage('');
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

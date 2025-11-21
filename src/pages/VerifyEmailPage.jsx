import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Alert, CircularProgress } from '@mui/material';

const api_base_url = process.env.REACT_APP_API_BASE_URL;

const VerifyEmailPage = () => {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${api_base_url}/email/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification link expired or invalid.');
        }
      } catch {
        setStatus('error');
        setMessage('Server error. Please try again later.');
      }
    };

    verifyEmail();
  }, [location.search]);

  useEffect(() => {
    if (status === 'success') {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        window.close();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Verifying your email...</Typography>
        </>
      )}
      {status === 'success' && (
        <>
          <Alert severity="success">{message}</Alert>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Closing page in {countdown} seconds...
          </Typography>
        </>
      )}
      {status === 'error' && <Alert severity="error">{message}</Alert>}
    </Container>
  );
};

export default VerifyEmailPage;

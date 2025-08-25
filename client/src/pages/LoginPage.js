import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        username,
        password,
      });

      login(response.data.access_token);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/new-bg2.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{marginLeft: '57%'}}>
        <Box
          sx={{
            width: '80%',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <input type="text" style={{ display: 'none' }} autoComplete="off" />
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{
              marginTop: '12px',
              padding: '12px 10px', // Adds vertical padding for a taller button
              fontSize: '16px', // Optional: Adjust text size if needed
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;

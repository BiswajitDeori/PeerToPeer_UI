import React, { useState } from 'react';
import "./App.css";
import { Button, Box, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Home } from './components/Home';
import { Room } from './components/Room';

const Auth = () => {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      window.location.href = "/home";
    },
    onError: error => console.error(error),
  });


  return (
    <div className="App">
    <Box 
      className="Auth" 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', 
        justifyContent: 'center',
        height: '30vh',
        paddingRight: '50px'
      }}
    >
      <Typography variant="h4" gutterBottom>
      Google Authenticator
      </Typography>
      <Button variant="contained" color="primary" onClick={() => login()}>
        Login with Google
      </Button>
    </Box>
    </div>
  );
}


function App() {
  return (
    <GoogleOAuthProvider clientId="323394747830-irdv4dsrs2j27hk30nfevfcg23hm077s.apps.googleusercontent.com">
      <Router>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/room/:roomID' element={<Room/>}/>
        <Route path='/room/:roomID' element={<Room/>}/>
      </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

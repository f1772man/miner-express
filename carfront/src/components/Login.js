import React, {  useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Carlist from './Carlist.js';
import Snackbar from '@mui/material/Snackbar';

import { SERVER_URL } from '../constants.js';

function Login() {
  const [user, setUser] = useState({
    username: '', 
    password: ''
  });
  const [isAuthenticated, setAuth] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleChange = (event) => {
    setUser({...user, [event.target.name] : event.target.value});
  }

  useEffect(() => {
    // 페이지가 새로 로드되거나 새로고침될 때 sessionStorage에서 토큰을 확인
    const token = sessionStorage.getItem("jwt");
    if (token) {
      setAuth(true);  // 토큰이 있으면 로그인 상태로 설정
    }
  }, []);
  
  const login = () => {
    fetch(SERVER_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(user)
    })
    .then(res => {
      const jwtToken = res.headers.get('Authorization');
      if (jwtToken !== null) {
        sessionStorage.setItem("jwt", jwtToken);
        setAuth(true);
      }
      else {
        setOpen(true);
      }
    })
    .catch(err => console.error(err))
  }

  if (isAuthenticated) {
    return <Carlist />;
  }
  else {  
    return(
      <div>
        <Stack spacing={2} alignItems='center' mt={2}>
          <TextField 
            name="username"
            label="Username" 
            onChange={handleChange} />
          <TextField 
            type="password"
            name="password"
            label="Password"
            onChange={handleChange}/>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={login}>
              Login
          </Button>
        </Stack>
        <Snackbar 
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Login failed: Check your username and password"
        />
      </div>
    );
  }
}

export default Login;
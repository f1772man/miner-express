import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Stack } from 'react-bootstrap';
import AddCar from './AddCar';

function Logout(props) {
    const [isAuthenticated, setAuth] = useState(false);

    const Logout = () => {
        sessionStorage.removeItem('jwt');
        return (
            <React.Fragment>
              <Stack mt={2} mb={2}>
                <AddCar addCar={addCar} />
              </Stack>
                <div></div>
            </React.Fragment>
        );
    };
}

export default Logout;

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Stack } from 'react-bootstrap';
import AddCar from './AddCar';
import { DataGrid } from '@mui/x-data-grid';

function Logout(props) {
    const [isAuthenticated, setAuth] = useState(false);

    const Logout = () => {
        sessionStorage.removeItem('jwt');
        return (
            <React.Fragment>
              <Stack mt={2} mb={2}>
                <AddCar addCar={addCar} />
              </Stack>
                <div style={{height:500, with: '100%'}}>
                  <DataGrid
                  rows={cars}
                  columns={columns}
                  disableRowSelectionOnClick={true}
                  getRowId={(row) => row._links.self.href)
                    slots = {{toolbar.Custom}}
                </div>
            </React.Fragment>
        );
    };
}

export default Logout;

import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants.js';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
    gridClasses,
} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddCar from './AddCar.js';
import EditCar from './EditCar.js';

function CustomToolbar() {
    console.log('CustomToolbar is rendering'); // 이 줄을 추가해 확인
    return (
        <GridToolbarContainer className={gridClasses.toolbarContainer}>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        const token = sessionStorage.getItem("jwt");
    
        fetch(SERVER_URL + "api/cars", {
            headers: { Authorization: token },
        })
            .then((response) => response.json())
            .then(async (data) => {
                const carData = data._embedded.cars;
    
                // owner 정보를 추가로 요청하는 부분
                const updatedCars = await Promise.all(
                    carData.map(async (car) => {
                        const ownerUrl = car._links.owner.href;
                        try {
                            const ownerResponse = await fetch(ownerUrl, {
                                headers: { Authorization: token },
                            });
                            const ownerData = await ownerResponse.json();
                            return {
                                ...car,
                                ownerLastname: ownerData.lastname, // 소유자의 lastname을 추가
                            };
                        } catch (error) {
                            console.error("Error fetching owner:", error);
                            return { ...car, ownerLastname: "Unknown" };
                        }
                    })
                );
    
                setCars(updatedCars);
            })
            .catch((err) => console.error(err));
    };

    const onDelClick = (url) => {
        if (window.confirm('Are you sure to delete?')) {
            const token = sessionStorage.getItem('jwt');

            fetch(url, {
                method: 'DELETE',
                headers: { Authorization: token },
            })
                .then((response) => {
                    if (response.ok) {
                        fetchCars();
                        setOpen(true);
                    } else {
                        alert('Something went wrsong!');
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    // Add a new car
    const addCar = (car) => {
        const token = sessionStorage.getItem('jwt');

        fetch(SERVER_URL + 'api/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(car),
        })
            .then((response) => {
                if (response.ok) {
                    fetchCars();
                } else {
                    alert('Something went wrong!');
                }
            })
            .catch((err) => console.error(err));
    };

    // Update car
    const updateCar = (car, link) => {
        const token = sessionStorage.getItem('jwt');

        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(car),
        })
            .then((response) => {
                if (response.ok) {
                    fetchCars();
                } else {
                    alert('Something went wrong!');
                }
            })
            .catch((err) => console.error(err));
    };

    const columns = [
        { field: 'brand', headerName: 'Brand', width: 200 },
        { field: 'model', headerName: 'Model', width: 200 },
        { field: 'color', headerName: 'Color', width: 200 },
        { field: 'year', headerName: 'Year', width: 150 },
        { field: 'price', headerName: 'Price', width: 150 },
        {
            field: "ownerLastname",
            headerName: "Owner",
            width: 200, // owner의 last name을 표시할 열 추가
        },
        {
            field: '_links.car.href',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: (row) => <EditCar data={row} updateCar={updateCar} />,
        },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: (row) => (
                <IconButton onClick={() => onDelClick(row.id)}>
                    <DeleteIcon color="error" />
                </IconButton>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Stack mt={2} mb={2}>
                <AddCar addCar={addCar} />
            </Stack>
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={cars}
                    columns={columns}
                    disableSelectionOnClick={true}
                    slots={{
                        toolbar: CustomToolbar, // Toolbar에 GridToolbarExport 컴포넌트 추가
                    }}
                    getRowId={(row) => row._links.self.href}
                />
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={() => setOpen(false)}
                    message="Car deleted"
                />
            </div>
        </React.Fragment>
    );
}

export default Carlist;

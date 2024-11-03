import React from 'react';
import { Button } from '@mui/material';

const Sidebar = () => {
    return (
        <div style={{
            width: '300px',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            <div>
                <h2>Sidebar Title</h2>
                <p>Some descriptive text or instructions.</p>
            </div>
            
            <Button variant="contained" onClick={() => console.log("Button 1 clicked")}>Button 1</Button>
        </div>
    );
};

export default Sidebar;

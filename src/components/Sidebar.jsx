import React from 'react';
import { Button } from '@mui/material';
import '../stylesheets/Sidebar.css'; // Import the CSS file

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div>
                <h2 className="sidebar-title">Sidebar Title</h2>
                <p className="sidebar-description">Some descriptive text or instructions.</p>
            </div>
            
            <Button variant="contained" onClick={() => console.log("Button 1 clicked")}>Button 1</Button>
        </div>
    );
};

export default Sidebar;

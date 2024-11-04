import React from 'react';
import { Button } from '@mui/material';
import '../stylesheets/Sidebar.css';

const Sidebar = ({ content }) => {
    return (
        <div className="sidebar">
            <div>
                <h2 className="sidebar-title">{content.title}</h2>
                <p className="sidebar-description">{content.description}</p>
            </div>
            
            <Button variant="contained" onClick={() => console.log("Button 1 clicked")}>Button 1</Button>
        </div>
    );
};

export default Sidebar;

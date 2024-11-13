// NavBar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CustomDrawer from './CustomDrawer'; // Import the new DrawerComponent

// Import the CSS file
import '../stylesheets/NavBar.css';

const NavBar = ({ onAddNode, content }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" className="app-bar">
        <Toolbar>
          {/* App name on the left */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            Tab Board
          </Typography>

          {/* Add Prompt Node Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#242629',  // Adjust color here
              marginRight: '8px',          // Adds space on the right side
            }}
            startIcon={<AddCircleIcon />}
            onClick={onAddNode}
            className="add-node-button"
          >
            Add Prompt Node
          </Button>

          {/* Drawer icon button on the right */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="menu-icon"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer Component */}
      <CustomDrawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        prompt={prompt}
        setPrompt={setPrompt}
        content={content}
      />
    </>
  );
};

export default NavBar;

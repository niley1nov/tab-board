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
import AddIcon from '@mui/icons-material/Add';
import CustomDrawer from '../drawerComponents/CustomDrawer'; // Import the new DrawerComponent

// Import the CSS file
import '../../stylesheets/NavBar.css';

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
        <Toolbar className='tool-bar'>
          {/* App name on the left */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className='header-tab'>Tab</span>
            <span className='header-board'>Board</span>
          </Typography>

          {/* Add Prompt Node Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddNode}
            className="add-node-button"
            style={{ fontFamily: 'Poppins, sans-serif' }}
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

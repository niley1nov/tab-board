import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppsIcon from '@mui/icons-material/Apps';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import '../stylesheets/NavBar.css';

function NavBar({ onAddNode }) {
  return (
    <Box sx={{ flexShrink: 1 }}>
      {/* Blue Header Section */}
      <AppBar position="static" className="app-bar">
        <Toolbar>
          {/* App Title */}
          <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
            Tab Board
          </Typography>
        </Toolbar>
      </AppBar>

      {/* White Tab Section */}
      <Box className="tab-section">
        {/* Tab with Close Icon */}
        <Box className="tab-board">
          <Typography variant="body2">Tab Board</Typography>
        </Box>

        {/* Icons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginRight: 'auto' }}>
          <IconButton color="default">
            <AppsIcon />
          </IconButton>
          <IconButton color="default" onClick={onAddNode}>
            <AddIcon />
          </IconButton>
          <IconButton color="default">
            <DeleteIcon />
          </IconButton>
          <IconButton color="default">
            <PersonIcon />
          </IconButton>
          <IconButton color="default">
            <ListAltIcon />
          </IconButton>
        </Box>

        {/* Board Activity */}
        <Button variant="outlined" startIcon={<PlayArrowIcon />} className="board-activity-button">
          Board Activity
        </Button>

        {/* Run Board Button */}
        <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />} className="run-board-button">
          Run Board
        </Button>

        {/* Settings Icon */}
        <IconButton color="default">
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default NavBar;

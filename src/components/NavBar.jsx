import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppsIcon from '@mui/icons-material/Apps';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';

// Import the CSS file
import '../stylesheets/NavBar.css';

function NavBar({ onAddNode }) {

	return (
		<>
			{/* Merged Navbar */}
			<AppBar position="static" className="navbar-container">
				<Toolbar className="navbar-toolbar">
					{/* App Title */}
					<Typography variant="h6" component="div">
						Tab Board
					</Typography>

					{/* Navigation Buttons */}
					<Box className="navbar-icons">
						<IconButton color="inherit">
							<AppsIcon />
						</IconButton>
						<IconButton color="inherit" onClick={onAddNode}>
							<AddIcon />
						</IconButton>
						<IconButton color="inherit">
							<DeleteIcon />
						</IconButton>
						<IconButton color="inherit">
							<PersonIcon />
						</IconButton>
						<IconButton color="inherit">
							<ListAltIcon />
						</IconButton>

						{/* Buttons */}
						<Button
							variant="contained"
							startIcon={<PlayArrowIcon />}
							sx={{
								backgroundColor: '#4caf50', // Green background
								color: '#ffffff', // White text
								borderRadius: '8px',
							}}
						>
							Board Activity
						</Button>
						<Button
							variant="contained"
							startIcon={<PlayArrowIcon />}
							className="run-board-button"
						>
							Run Board
						</Button>

					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
}

export default NavBar;

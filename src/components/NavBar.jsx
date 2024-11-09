import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppsIcon from '@mui/icons-material/Apps';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useToken } from '../containers/TokenContext'; // Adjust the path

// Import the CSS file
import '../stylesheets/NavBar.css';

function NavBar({ onAddNode }) {
	const [open, setOpen] = useState(false);
	const { token, setToken } = useToken();
	const [apiToken, setApiToken] = useState('');

	function setInert(inert) {
		const root = document.getElementById('root');
		if (root) {
			root.inert = inert;
		}
	}

	const handleSettingOpen = () => {
		setOpen(true);
		setInert(true);
	};

	const handleSettingClose = () => {
		setOpen(false);
		setApiToken(token);
	};

	const handleSettingSubmit = () => {
		setToken(apiToken);
		setOpen(false);
	};

	useEffect(() => {
		// Initialize apiToken with the current token value on component mount
		setApiToken(token);

		// Remove inert if dialog is closed
		if (!open) {
			setInert(false);
		}
	}, [token, open]); // Runs on token initialization or when open changes	

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

						{/* Settings Icon */}
						<IconButton color="inherit" onClick={handleSettingOpen}>
							<SettingsIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Modal Dialog */}
			<Dialog open={open} onClose={handleSettingClose}>
				<DialogTitle>Enter API Token</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter your API token to proceed.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="API Token"
						type="text"
						fullWidth
						variant="outlined"
						value={apiToken}
						onChange={(e) => setApiToken(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSettingClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSettingSubmit} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default NavBar;

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
import {useToken} from '../containers/TokenContext'; // Adjust the path
import { styled } from '@mui/system';

const TabSection = styled(Box)(({ theme }) => ({
	backgroundColor: '#fff',
	borderRadius: '8px 8px 0 0',
	boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
	padding: '8px 16px',
	marginTop: '-4px',
	display: 'flex',
	alignItems: 'center',
}));

function Navbar({ onAddNode }) {
	const [open, setOpen] = useState(false);
	const {token, setToken} = useToken();
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
		if (!open) {
			setInert(false);
		}
	}, [open]);

	return (
		<Box sx={{ flexShrink: 1 }}>
			{/* Blue Header Section */}
			<AppBar position="static" color="primary" sx={{ backgroundColor: '#2196f3', boxShadow: 'none' }}>
				<Toolbar>
					{/* App Title */}
					<Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
						Tab Board
					</Typography>
				</Toolbar>
			</AppBar>

			{/* White Tab Section */}
			<TabSection>
				{/* Tab with Close Icon */}
				<Box display="flex" alignItems="center" sx={{ border: '1px solid #e0e0e0', borderRadius: 1, padding: '2px 8px', marginRight: 2 }}>
					<Typography variant="body2">Blank board</Typography>
					<IconButton size="small" color="inherit">
						<DeleteIcon fontSize="small" />
					</IconButton>
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
				<Button variant="outlined" startIcon={<PlayArrowIcon />} sx={{ color: '#4caf50', borderColor: '#4caf50', marginRight: 2 }}>
					Board Activity
				</Button>

				{/* Run Board Button */}
				<Button
					variant="contained"
					color="primary"
					startIcon={<PlayArrowIcon />}
					sx={{ backgroundColor: '#2979ff', borderRadius: 2, padding: '6px 16px', marginRight: 1 }}
				>
					Run Board
				</Button>

				{/* Settings Icon */}
				<IconButton color="default" onClick={handleSettingOpen}>
					<SettingsIcon />
				</IconButton>
			</TabSection>

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
		</Box>
	);
}

export default Navbar;

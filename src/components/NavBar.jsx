import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppsIcon from '@mui/icons-material/Apps';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { styled } from '@mui/system';

// Custom styled component for the white tab section
const TabSection = styled(Box)(({ theme }) => ({
	backgroundColor: '#fff',
	borderRadius: '8px 8px 0 0', // Rounded corners on top only
	boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow to give raised effect
	padding: '8px 16px',
	marginTop: '-4px', // Slight overlap with the blue AppBar
	display: 'flex',
	alignItems: 'center',
}));

function Navbar({ onAddNode }) {

	return (
		<Box sx={{ flexGrow: 1 }}>
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
				<IconButton color="default">
					<SettingsIcon />
				</IconButton>
			</TabSection>
		</Box>
	);
}

export default Navbar;

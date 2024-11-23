import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import '../../stylesheets/CustomDrawer.css';

const TokenDialog = ({ open, apiToken, setApiToken, onSubmit, onClose }) => (
	<Dialog
		open={open}
		onClose={onClose}
		PaperProps={{
			sx: {
				backgroundColor: '#0C0E11',
				color: 'white',
				padding: '20px',
				borderRadius: '8px',
				minWidth: '400px',
			},
		}}
	>
		<DialogTitle sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.25rem' }}>
			Enter API Token
		</DialogTitle>
		<DialogContent>
			<DialogContentText sx={{ color: '#b3b3b3', mb: 2 }}>
				Please enter your API token to proceed.
			</DialogContentText>
			<TextField
				label="API Token"
				variant="outlined"
				fullWidth
				value={apiToken}
				onChange={(e) => setApiToken(e.target.value)}
				className="text-field-token"
			/>
		</DialogContent>
		<DialogActions>
			<Button onClick={onClose} sx={{ color: '#ffffff' }}>Cancel</Button>
			<Button onClick={onSubmit} sx={{ color: '#ffffff' }}>Submit</Button>
		</DialogActions>
	</Dialog>
);

export default TokenDialog;

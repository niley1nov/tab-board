// src/components/EditDialog.jsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const EditDialog = ({ open, onClose, title, onTitleChange, onSave }) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Edit Node Title</DialogTitle>
			<DialogContent>
				<TextField
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onSave}>Save</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditDialog;

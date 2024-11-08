// src/components/NodeMenu.jsx
import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const NodeMenu = ({ anchorEl, onClose, onEdit, onDelete, nodeType }) => {
	return (
		<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
			<MenuItem onClick={onEdit}>Edit</MenuItem>
			{nodeType === 'PromptNode' && <MenuItem onClick={onDelete}>Delete</MenuItem>}
		</Menu>
	);
};

export default NodeMenu;

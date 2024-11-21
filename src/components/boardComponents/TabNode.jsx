import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { Handle, Position } from '@xyflow/react';
import '../../stylesheets/TabNode.css';

const TabNode = ({ data }) => {
	return (
		<div className="tab-node" onClick={data.onClick}>
			{/* Left Handle for Input Connection */}
			<Handle type="target" position={Position.Left} id="input" style={{ top: '50%' }} />

			{/* Header Section */}
			<div className="tab-node-header">
				<Typography variant="subtitle2" className="tab-node-title" title={data.label} style={{ fontFamily: 'Poppins, sans-serif' }}>
					{data.label}
				</Typography>
				{/* <div className="tab-node-actions">
					<IconButton aria-label="edit title" onClick={data.onOpenMenu} size="small">
						<EditIcon fontSize="inherit" />
					</IconButton>
				</div> */}
			</div>

			{/* Divider Line */}
			<Divider className="tab-node-divider" sx={{ margin: '8px 0' }} />

			{/* Action Icons Section */}
			<div className="tab-node-actions-container">
				<Button 
					className='edit-title-button'
					variant="outlined" 
					startIcon={<EditIcon className='edit-icon' fontSize="inherit"/>} 
				>
					Edit
				</Button>
			</div>

			{/* Right Handle for Output Connection */}
			<Handle type="source" position={Position.Right} id="output" style={{ top: '50%' }} />
		</div>
	);
};

export default TabNode;
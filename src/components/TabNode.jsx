import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AddLinkIcon from '@mui/icons-material/AddLink';
import PushPinIcon from '@mui/icons-material/PushPin';
import { Handle, Position } from '@xyflow/react';
import '../stylesheets/TabNode.css';

const TabNode = ({ data }) => {
	return (
		<div className="tab-node" onClick={data.onClick}>
			{/* Left Handle for Input Connection */}
			<Handle type="target" position={Position.Left} id="input" style={{ top: '50%' }} />

			{/* Header Section */}
			<div className="tab-node-header">
				<Typography variant="subtitle2" className="tab-node-title" title={data.label}>
					{data.label}
				</Typography>
				<div className="tab-node-actions">
					<IconButton aria-label="settings" onClick={data.onOpenMenu} size="small">
						<MoreVertIcon fontSize="small" />
					</IconButton>
				</div>
			</div>

			{/* Divider Line */}
			<Divider className="tab-node-divider" />

			{/* Action Icons Section */}
			<div className="tab-node-actions-container">
				<IconButton aria-label="edit title" onClick={data.onEditTitle} size="small">
					<EditIcon fontSize="small" />
				</IconButton>
				<IconButton aria-label="add edge" onClick={data.onAddEdge} size="small">
					<AddLinkIcon fontSize="small" />
				</IconButton>
				<IconButton aria-label="pin node" onClick={data.onPinNode} size="small">
					<PushPinIcon fontSize="small" />
				</IconButton>
			</div>

			{/* Right Handle for Output Connection */}
			<Handle type="source" position={Position.Right} id="output" style={{ top: '50%' }} />
		</div>
	);
};

export default TabNode;
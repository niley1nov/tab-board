import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import { Handle, Position } from "@xyflow/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../../stylesheets/OutputNode.css";

const OutputNode = ({ data }) => {
	return (
		<div onClick={data.onClick} className="output-node">
			{/* Left Handle for Schema */}
			<Handle
				type="target"
				position={Position.Left}
				id="schema"
				style={{ top: "50%" }}
			/>

			{/* Header Section */}
			<div className="output-node-header">
				<Typography variant="subtitle2" className="output-node-title">
					{data.label}
				</Typography>
				<div className="output-node-actions">
					<IconButton
						aria-label="settings"
						onClick={data.onOpenMenu}
						size="small"
					>
						<MoreVertIcon fontSize="small" />
					</IconButton>
				</div>
			</div>

			<Divider className="output-node-divider" />

			{/* Output */}
			<div className="output-node-response">
				<Typography variant="body2" color="textSecondary">
					{"Output will appear on the sidebar"}
				</Typography>
			</div>
		</div>
	);
};

export default OutputNode;

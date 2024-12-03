import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { Handle, Position } from "@xyflow/react";
import "../../stylesheets/Node.css";
import "../../stylesheets/TabNode.css";

const TabNode = ({ data }) => {
	return (
		<div
			className="node"
			onClick={data.onClick}
			style={{ backgroundColor: data.backgroundColor || "#FFF" }}
		>
			{/* Header Section */}
			<div className="node-header">
				<Typography
					variant="subtitle2"
					className="node-title"
					title={data.label}
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{data.label}
				</Typography>
			</div>

			{/* Divider Line */}
			<Divider className="node-divider" />

			{/* Action Icons Section */}
			<div className="node-actions-container">
				<Button
					className="edit-title-button"
					variant="outlined"
					startIcon={
						<EditIcon className="edit-icon" fontSize="inherit" />
					}
				>
					Edit
				</Button>
			</div>

			{/* Right Handle for Output Connection */}
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ top: "50%" }}
			/>
		</div>
	);
};

export default TabNode;

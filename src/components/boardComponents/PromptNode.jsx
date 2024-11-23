import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Handle, Position } from "@xyflow/react";
import "../../stylesheets/PromptNode.css";

const PromptNode = ({ data }) => {
	const nodeRef = useRef(null);

	return (
		<div
			onClick={data.onClick}
			ref={nodeRef}
			className="prompt-node"
			style={{ backgroundColor: data.backgroundColor || "#FFF" }}
		>
			{/* Left Handle for Schema */}
			<Handle
				type="target"
				position={Position.Left}
				id="schema"
				style={{ top: "50%" }}
			/>

			{/* Header Section */}
			<div className="prompt-node-header">
				<Typography
					variant="subtitle2"
					className="prompt-node-title"
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{data.label}
				</Typography>
			</div>

			<Divider className="prompt-node-divider" sx={{ margin: "8px 0" }} />

			{/* Action Icons Section */}
			<div className="prompt-node-actions-container">
				<Button
					className="edit-title-button"
					variant="outlined"
					startIcon={
						<EditIcon className="edit-icon" fontSize="inherit" />
					}
				>
					Edit
				</Button>
				<Button
					className="delete-node-button"
					variant="outlined"
					onClick={data.deleteNode}
					startIcon={
						<DeleteOutlineIcon
							className="delete-icon"
							fontSize="inherit"
						/>
					}
				>
					Delete
				</Button>
			</div>

			{/* Right Handle for Context */}
			<Handle
				type="source"
				position={Position.Right}
				id="context"
				style={{ top: "50%" }}
			/>
		</div>
	);
};

export default PromptNode;

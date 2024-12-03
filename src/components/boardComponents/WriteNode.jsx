import React, { useRef } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Handle, Position } from "@xyflow/react";
import { useGraph } from "../../containers/GraphContext";
import "../../stylesheets/Node.css";
import "../../stylesheets/WriteNode.css";

const WriteNode = ({ data }) => {
	const nodeRef = useRef(null);
	const graph = useGraph();
	const { nodeId, adjacencyNodes } = graph.sidebarContent;

	const handleDelete = (e) => {
		e.stopPropagation(); // Prevent event bubbling

		if (data.id === nodeId) {
			graph.setSidebarContent({
				id: "",
				title: "Dynamic Sidebar",
				nodeType: "",
				additionalContent: ""
			});
		}
		data.deleteNode(e);
	};

	return (
		<div
			onClick={data.onClick}
			ref={nodeRef}
			className="node"
			style={{ backgroundColor: data.backgroundColor || "#FFF" }}
		>
			{/* Header Section */}
			<div className="node-header">
				<Typography
					variant="subtitle2"
					className="node-title"
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{data.label}
				</Typography>
			</div>

			<Divider className="node-divider" />

			{/* Action Icons Section */}
			<div className="node-actions-container">
				<Button
					className="edit-title-button"
					variant="outlined"
					onClick={data.editTitle}
					startIcon={
						<EditIcon className="edit-icon" fontSize="inherit" />
					}
				>
					Edit
				</Button>
				<Button
					className="delete-node-button"
					variant="outlined"
					onClick={handleDelete}
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

export default WriteNode;
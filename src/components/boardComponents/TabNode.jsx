import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Handle, Position } from "@xyflow/react";
import { useGraph } from "../../containers/GraphContext";
import "../../stylesheets/Node.css";
import "../../stylesheets/TabNode.css";

const TabNode = ({ data }) => {
	
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

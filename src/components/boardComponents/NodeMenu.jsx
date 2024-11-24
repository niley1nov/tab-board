// src/components/NodeMenu.jsx
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { useGraph } from "../../containers/GraphContext";

const NodeMenu = ({ onEdit }) => {
	const graph = useGraph();
	
	return (
		<Menu anchorEl={graph.anchorEl} open={Boolean(graph.anchorEl)} onClose={graph.closeMenu}>
			<MenuItem onClick={onEdit}>Edit</MenuItem>
			{graph.selectedNode?.type === "PromptNode" && (
				<MenuItem onClick={graph.handleDeleteNode}>Delete</MenuItem>
			)}
		</Menu>
	);
};

export default NodeMenu;

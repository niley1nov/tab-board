import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useToken } from "../../containers/TokenContext";
import { useGraph } from "../../containers/GraphContext";
import { Handle, Position } from "@xyflow/react";
import "../../stylesheets/PromptNode.css";

const ChatNode = ({ data }) => {
	const graph = useGraph();
	const nodeRef = useRef(null);
	const { token } = useToken();
	const [session, setSession] = useState(null);

	// Initialize or reinitialize session
	useEffect(() => {
		if (!token) {
			console.warn("No token available to create a session.");
			return;
		}

		// Clear session if already initialized
		if (session !== null) {
			console.log("Reinitializing session due to token change.");
			setSession(null); // Clear the existing session
		}

		// Create a new session
		console.log("Initializing new session for ChatNode.");
		const newSession = `session-${Date.now()}`; // Simulate session creation
		setSession(newSession);

		// Clean up session on unmount
		return () => {
			console.log("Cleaning up session for ChatNode.");
			setSession(null); // Clear session on unmount
		};
	}, [token]); // Reinitialize session when the token changes

	// Sync session state with data.session
	useEffect(() => {
		if (session !== data.session) {
			console.log("Syncing session to data.session");
			data.session = session; // Update data.session to reflect the current session state
		}
	}, [session]); // Sync whenever session or data changes


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
					onClick={(e) => {
						console.log("session delete");
						setSession(null);
						data.deleteNode(e);
					}}
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

export default ChatNode;

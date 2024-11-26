import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import DrawerHeader from "./DrawerHeader";
import { Divider, Button } from "@mui/material";
import TokenDialog from "./TokenDialog";
import { useGraph } from "../../containers/GraphContext";
import { useToken } from "../../containers/TokenContext";
import PromptNodeContent from "./PromptNodeContent";
import ChatNodeContent from "./ChatNodeContent";
import TabNodeContent from "./TabNodeContent";
import OutputNodeContent from "./OutputNodeContent";
import "../../stylesheets/CustomDrawer.css";

const CustomDrawer = ({ open, onClose }) => {
	const graph = useGraph();
	const { token, setToken } = useToken();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [apiToken, setApiToken] = useState("");
	const { nodeId, title, nodeType } = graph.sidebarContent;

	useEffect(() => {
		// Initialize apiToken with the current token value on component mount
		setApiToken(token);
	}, [token]);

	return (
		<>
			<Drawer
				anchor="right"
				open={open}
				onClose={onClose}
				PaperProps={{
					className: "drawer-paper",
					sx: {
						width: "320px",
						top: "64px",
						height: "calc(100vh - 64px)",
						overflow: "hidden", // Ensure the outer drawer doesn’t scroll.
					},
				}}
				ModalProps={{ keepMounted: true }}
			>
				<DrawerHeader title={title} onClose={onClose} />
				{nodeType === "PromptNode" && (
					<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
				)}
				<div className="drawer-wrapper" style={{ background: nodeType === "TabNode" ? "#2d2a30" : "#49454F" }}>
					<div className="drawer-content">
						{nodeType === "PromptNode" && (
							<PromptNodeContent
								token={token}
								setDialogOpen={setDialogOpen}
							/>
						)}
						{nodeType === "TabNode" && (
							<TabNodeContent />
						)}
						{nodeType === "OutputNode" && (
							<OutputNodeContent />
						)}
						{nodeType === "ChatNode" && (
							<ChatNodeContent
								token={token}
								setDialogOpen={setDialogOpen}
							/>
						)}
					</div>
				</div>
			</Drawer>
			<TokenDialog
				open={dialogOpen}
				apiToken={apiToken}
				setApiToken={setApiToken}
				onClose={() => {
					setDialogOpen(false);
					setApiToken(token);
				}}
				onSubmit={() => {
					setToken(apiToken);
					setDialogOpen(false);
				}}
			/>
		</>
	);
};

export default CustomDrawer;

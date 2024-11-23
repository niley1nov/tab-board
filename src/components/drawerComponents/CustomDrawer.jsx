import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import DrawerHeader from "./DrawerHeader";
import TokenDialog from "./TokenDialog";
import { useToken } from "../../containers/TokenContext";
import PromptNodeContent from "./PromptNodeContent";
import TabNodeContent from "./TabNodeContent";
import "../../stylesheets/CustomDrawer.css";

const CustomDrawer = ({ open, onClose, prompt, setPrompt, content }) => {
	const { token, setToken } = useToken();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [apiToken, setApiToken] = useState("");

	const { nodeId, title, nodeType } = content;

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
				<div className="drawer-content">
					{nodeType === "PromptNode" && (
						<PromptNodeContent
							content={content}
							prompt={prompt}
							setPrompt={setPrompt}
							token={token}
							dialogOpen={dialogOpen}
							setDialogOpen={setDialogOpen}
						/>
					)}
					{nodeType === "TabNode" && (
						<TabNodeContent
							additionalContent={content.additionalContent}
						/>
					)}
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

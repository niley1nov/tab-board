import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	TextField,
} from "@mui/material";
import "../../stylesheets/TokenDialog.css";

const TokenDialog = ({ open, apiToken, setApiToken, onSubmit, onClose }) => (
	<Dialog
		open={open}
		onClose={onClose}
		PaperProps={{
			className: "dialog",
		}}
	>
		<DialogTitle className="dialog-title">Enter API Token</DialogTitle>
		<DialogContent>
			{/* <DialogContentText className="dialog-content-text">
				Access GEMINI APIs with your token.
			</DialogContentText> */}
			<TextField
				fullWidth
				variant="outlined"
				placeholder="e.g., 8JpWjL-lDv8L-aItwmp-a0QSr...."
				value={apiToken}
				onChange={(e) => setApiToken(e.target.value)}
				className="custom-text-field"
				autoComplete="off"
			/>
		</DialogContent>
		<DialogActions className="dialog-actions">
			<Button
				variant="contained"
				color="primary"
				onClick={onClose}
				className="cancel-button"
			>
				Cancel
			</Button>
			<Button
				variant="contained"
				color="primary"
				onClick={onSubmit}
				className="submit-button"
			>
				Submit
			</Button>
		</DialogActions>
	</Dialog>
);

export default TokenDialog;

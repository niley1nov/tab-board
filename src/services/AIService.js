import React from "react";
import ReactDOM from "react-dom";
import { Snackbar, Alert } from "@mui/material";

export default class AIService {
	constructor() {
		if (new.target === AIService) {
			throw new TypeError("Cannot instantiate an abstract class.");
		}
	}

	showWarningPopup(message) {
		// Create a container div for the popup
		const container = document.createElement("div");
		document.body.appendChild(container);

		// Create a root for rendering
		const root = ReactDOM.createRoot(container);

		// Function to remove the popup after 3 seconds
		const removePopup = () => {
			root.unmount(); // Unmount the React component
			container.remove(); // Remove the container from the DOM
		};

		// Render the Snackbar into the container
		root.render(
			<Snackbar
				open={true}
				autoHideDuration={3000} // Close after 3 seconds
				onClose={removePopup}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={removePopup} severity="warning" sx={{ width: "100%" }}>
					{message}
				</Alert>
			</Snackbar>
		);
	}

	async callModel(prompt) {
		throw new Error("Method 'callModel()' must be implemented.");
	}
}

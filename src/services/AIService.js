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

	approximateTokenCount(text) {
		let tokens = 0;
		const words = text.trim().split(/\s+/);
		for (const word of words) {
			tokens += Math.max(1, Math.ceil(word.length / 4));
			tokens += (word.match(/[.,!?;:]/g) || []).length;
		}
		return tokens;
	}

	trimContext(context, maxTokens, systemPrompt) {
		let currentTokens = this.approximateTokenCount(systemPrompt) + this.approximateTokenCount(context);
		let originalContextLength = context.length; // Store original length

		while (currentTokens > maxTokens) {
			const sections = context.split('\n');
			sections.pop();
			context = sections.join('\n');
			currentTokens = this.approximateTokenCount(systemPrompt) + this.approximateTokenCount(context);
		}

		// Check if the context was shortened
		if (context.length < originalContextLength) {
			this.showWarningPopup("The provided context is too large for Gemini Nano and has been shortened. For larger contexts, consider using Gemini Pro."); // Call the warning popup function
		}

		return context;
	}
}

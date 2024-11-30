import AIService from "./AIService";
import React from "react";
import ReactDOM from "react-dom";
import { Snackbar, Alert } from "@mui/material";
import { getPrompts } from "./AIConfigData.js";

export default class GeminiNanoService extends AIService {
	constructor() {
		super();
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
			this.showWarningPopup(); // Call the warning popup function
		}

		return context;
	}

	showWarningPopup() {
		// Create a container div for the popup
		const container = document.createElement("div");
		document.body.appendChild(container);

		// Function to remove the popup after 3 seconds
		const removePopup = () => {
			ReactDOM.unmountComponentAtNode(container);
			container.remove();
		};

		// Render the Snackbar into the container
		ReactDOM.render(
			<Snackbar
				open={true}
				autoHideDuration={10000} // Close after 10 seconds
				onClose={removePopup}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={removePopup} severity="warning" sx={{ width: "100%" }}>
					The provided context is too large for Gemini Nano and has been shortened.
					For larger contexts, consider using Gemini Pro.
				</Alert>
			</Snackbar>,
			container
		);
	}

	async initializeSession(context) {
		console.log('Initialize Session');
		const maxTokens = 4800;
		const systemPrompt = getPrompts("system_prompt");

		// Optimize: Calculate systemPrompt tokens only once
		const systemPromptTokens = this.approximateTokenCount(systemPrompt);
		let contextTokens = this.approximateTokenCount(context);
		let combinedTokens = systemPromptTokens + contextTokens;

		if (combinedTokens > maxTokens) {
			context = this.trimContext(context, maxTokens, systemPrompt);
			contextTokens = this.approximateTokenCount(context); // Recalculate after trimming
			combinedTokens = systemPromptTokens + contextTokens;
		}

		try {
			const chatSession = await window.ai.languageModel.create({
				systemPrompt: systemPrompt + `\n\nContext:\n\n` + context,
			});
			return chatSession;
		} catch (error) {
			console.error(error);
			// More informative error message
			throw new Error("Failed to initialize AI session. This could be due to a large context or a network issue.");
		}
	}

	async callModel(node, prompt) {
		try {
			const chatSession = node.data.session;
			const nodeId = node.data.id;
			if (!chatSession) {
				throw new Error(`Session not initialized`);
			}
			let result = await chatSession.prompt(prompt);
			return {
				id: nodeId,
				text: result
			};
		} catch (error) {
			console.error("Error in GeminiProService callModel:", error);
			throw error;
		}
	}
}

import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useGraph } from "../../containers/GraphContext";
import "../../stylesheets/CustomDrawer.css";

const PromptInputField = ({ handleSubmit }) => {
	const graph = useGraph();
	const [loading, setLoading] = useState(false); //store this in node
	const [abortController, setAbortController] = useState(null);
	const [prompt, setPrompt] = useState("");

	// Update prompt when selectedNode changes
	useEffect(() => {
		if (graph.selectedNode) {
			setPrompt(graph.selectedNode.data.prompt || "");
		}
	}, [graph.selectedNode]);

	const handleSendClick = async () => {
		if (!graph.selectedNode) return; // Ensure a node is selected

		const controller = new AbortController();
		setAbortController(controller);
		setLoading(true);

		// Update the prompt for the selected node in the graph context
		graph.selectedNode.data.prompt = prompt;

		try {
			await handleSubmit(controller.signal); // Send the prompt to Gemini API
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Error while sending prompt:", error.message);
			}
		} finally {
			setLoading(false);
			setAbortController(null);
		}
	};

	const handleStopClick = () => {
		if (abortController) {
			abortController.abort(); // Cancel the ongoing request
		}
	};

	const handlePromptChange = (e) => {
		setPrompt(e.target.value);

		// Update the prompt for the selected node in the graph context
		if (graph.selectedNode) {
			graph.selectedNode.data.prompt = e.target.value;
		}
	};

	return (
		<Box mb={2}>
			<div className="prompt-container">
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Submit Prompt Here..."
					value={prompt}
					onChange={handlePromptChange}
					className="custom-text-field"
					multiline
					rows={4}
				/>
				<div className="button-container">
					<Button
						variant="contained"
						color="primary"
						onClick={loading ? handleStopClick : handleSendClick}
						disabled={loading}
						className="send-button"
					>
						{loading ? "Sending..." : "Send"}
					</Button>
				</div>
			</div>
		</Box>
	);
};

export default PromptInputField;

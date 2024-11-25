import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import {
	updatePromptNodeDetails,
	addFinalPrompt,
} from "../../helpers/CustomDrawerHelper";
import GeminiProService from "../../services/GeminiProService";

const PromptNodeContent = ({
	token,
	setDialogOpen
}) => {
	const graph = useGraph();
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});
	const [nodeModelSelections, setNodeModelSelections] = useState({});
	const [promptNodeDetails, setPromptNodeDetails] = useState({});
	const geminiService = new GeminiProService(token);
	const { nodeId, adjacencyNodes } = graph.sidebarContent;

	const handleSubmitPrompt = async () => {
		let inputNodes = adjacencyNodes.filter((node) => node.type === 'TabNode');
		let context = "";
		for (let node of inputNodes) {
			let name = adjacentNodeInputs[node.id];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += (node.data.content + '\n\n' + '----------' + '\n\n');
		}

		try {
			const response = token
				? await geminiService.callModel(nodeId, `Prompt: ${graph.selectedNode.data.prompt}\n\nContext: ${context}`)
				: null;
			console.log("Response:", response);
			graph.selectedNode.data.content = response;
			setPromptNodeDetails((prevDetails) =>
				addFinalPrompt(prevDetails, nodeId, graph.selectedNode.data.prompt),
			); //what is this doing?
			console.log(graph.selectedNode);
		} catch (error) {
			console.error("Error while submitting prompt:", error.message);
		}
	};

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		setNodeModelSelections((prev) => ({
			...prev,
			[nodeId]: selectedValue,
		}));
		if (selectedValue === "Gemini Pro" && !token) setDialogOpen(true);
	};

	useEffect(() => {
		// Initialize AI session on mount
		if (token) {
			geminiService.initializeSession(nodeId);
		}
		return () => {
			// Cleanup session on unmount (optional)
			geminiService.clearSession(nodeId);
		};
	}, [nodeId, token, geminiService]);

	return (
		<>
			<ModelSelector
				selectedModel={nodeModelSelections[nodeId]}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
			<br/>
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) =>
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }))
				}
			/>
			<br/>
			<PromptInputField
				handleSubmit={handleSubmitPrompt} // Updated to pass handleSubmitPrompt
			/>
		</>
	);
};

export default PromptNodeContent;

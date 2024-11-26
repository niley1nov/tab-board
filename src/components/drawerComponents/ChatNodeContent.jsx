import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import ChatWindow from "./ChatWindow";
import {
	updatePromptNodeDetails,
	addFinalPrompt,
} from "../../helpers/CustomDrawerHelper";
import GeminiProService from "../../services/GeminiProService";

const ChatNodeContent = ({
	token,
	setDialogOpen
}) => {
	const graph = useGraph();
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});
	const [nodeModelSelections, setNodeModelSelections] = useState({});
	const geminiService = new GeminiProService(token);
	const { nodeId, adjacencyNodes } = graph.sidebarContent;

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
	}, [nodeId, token]);

	useEffect(() => {
		let inputNodes = adjacencyNodes.filter((node) => node.type === 'TabNode');
		let context = "";
		for (let node of inputNodes) {
			let name = adjacentNodeInputs[node.id];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += (node.data.content + '\n\n' + '----------' + '\n\n');
		}
		console.log(context);
		if(graph.selectedNode.data.context !== context) {
			graph.selectedNode.data.context = context;
			geminiService.clearSession(nodeId);
			graph.getNode(nodeId).data.chatHistory = [];
			graph.getNode(nodeId).data.processing = false;
			geminiService.initializeSession(nodeId, context);
		}
	}, [adjacencyNodes.length]);

	const handleSendMessage = async (message) => {
		try {
			// Call the model with the message
			const response = await geminiService.callModel(nodeId, message);
			return response;
		} catch (error) {
			console.error("Error sending message:", error.message);
			return "Failed to get a response.";
		}
	};

	return (
		<>
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) =>
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }))
				}
			/>
			<ModelSelector
				selectedModel={nodeModelSelections[nodeId]}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<ChatWindow handleSendMessage={handleSendMessage} />
		</>
	);
};

export default ChatNodeContent;

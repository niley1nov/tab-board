import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box, Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import { useGraph } from "../../containers/GraphContext";
import ChatWindow from "./ChatWindow";
import "../../stylesheets/ChatNodeContent.css"
import GeminiProService from "../../services/GeminiProService";
import GeminiNanoService from "../../services/GeminiNanoService";

const ChatNodeContent = ({
	token,
	setDialogOpen
}) => {
	const graph = useGraph();
	const { nodeId, adjacencyNodes } = graph.sidebarContent;
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState(graph.getNode(nodeId)?.data?.adjacentNodeInputs ?? {});
	const [chatVisible, setChatVisible] = useState(
		graph.getNode(nodeId)?.data?.ready ?? false
	);
	const [modelSelection, setModelSelection] = useState(graph.getNode(nodeId)?.data?.model ?? "Gemini Pro");
	const [geminiService, setGeminiService] = useState(graph.getNode(nodeId)?.data?.service ?? null);

	useEffect(() => {
		setChatVisible(graph.getNode(nodeId)?.data?.ready || false);
		setAdjacentNodeInputs(graph.getNode(nodeId)?.data?.adjacentNodeInputs || {});
		setModelSelection(graph.getNode(nodeId)?.data?.model || "Gemini Pro");
		setGeminiService(graph.getNode(nodeId)?.data?.service || null);
	}, [nodeId]);

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		graph.getNode(nodeId).data.model = selectedValue;
		setModelSelection(selectedValue);
		if (selectedValue === "Gemini Pro" && !token) setDialogOpen(true);
	};

	const handleSendMessage = async (message) => {
		try {
			// Call the model with the message
			const node = graph.getNode(nodeId);
			const response = await node.data.service.callModel(node, message);
			return response;
		} catch (error) {
			console.error("Error sending message:", error.message);
			throw error;
		}
	};

	const initializeChat = async () => {
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
		const node = graph.getNode(nodeId);
		node.data.context = context;
		node.data.chatHistory = [];
		node.data.processing = false;
		if (modelSelection === "Gemini Pro") {
			const service = new GeminiProService(token);
			node.data.service = service;
			setGeminiService(service);
		} else if (modelSelection === "Gemini Nano") {
			const service = new GeminiNanoService();
			node.data.service = service;
			setGeminiService(service);
		}
		node.data.session = await node.data.service.initializeSession(context);
		node.data.ready = true;
		setChatVisible(true);
	};

	return (
		<>
			<ModelSelector
				selectedModel={modelSelection}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
			<br />
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) => {
					graph.getNode(nodeId).data.adjacentNodeInputs = { ...graph.getNode(nodeId).data.adjacentNodeInputs, [id]: value };
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }));
				}
				}
			/>
			<br />
			<Box className="centered-button">
				<Button
					variant="contained"
					color="primary"
					onClick={initializeChat}
					className="send-button"
				>
					Initialize
				</Button>
			</Box>
			{chatVisible && <ChatWindow handleSendMessage={handleSendMessage} />}
		</>
	);
};

export default ChatNodeContent;

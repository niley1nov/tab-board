import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import GeminiProPromptService from "../../services/GeminiProPromptService";
import GeminiNanoPromptService from "../../services/GeminiNanoPromptService";
import "../../stylesheets/ChatNodeContent.css"

const PromptNodeContent = ({
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

	const initializeChat = async () => {
		let inputNodes = graph.adjacencyList[nodeId].left;
		let context = "";
		for (let nnid of inputNodes) {
			let name = adjacentNodeInputs[nnid];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += (graph.getNode(nnid).data.content + '\n\n----------\n\n');
		}
		console.log(context);
		const node = graph.getNode(nodeId);
		node.data.context = context;
		node.data.processing = false;
		let service;
		if (modelSelection === "Gemini Pro") {
			service = new GeminiProPromptService(token);
		} else if (modelSelection === "Gemini Nano") {
			service = new GeminiNanoPromptService();
		}
		node.data.service = service;
		setGeminiService(service);
		node.data.session = await node.data.service.initializeSession(context);
		node.data.ready = true;
		setChatVisible(true);
	};

	const handleSubmitPrompt = async () => {
		try {
			const node = graph.getNode(nodeId);
			const response = await node.data.service.callModel(node, graph.selectedNode.data.prompt);
			console.log("Response:", response);
			graph.selectedNode.data.content = response.text;
		} catch (error) {
			console.error("Error while submitting prompt:", error.message);
		}
	};

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		graph.getNode(nodeId).data.model = selectedValue;
		setModelSelection(selectedValue);
		if (selectedValue === "Gemini Pro" && !token) setDialogOpen(true);
	};

	return (
		<>
			<ModelSelector
				selectedModel={modelSelection}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				leftNodes={graph?.adjacencyList[nodeId]?.left || []}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) => {
					graph.getNode(nodeId).data.adjacentNodeInputs = { ...graph.getNode(nodeId).data.adjacentNodeInputs, [id]: value };
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }));
				}
				}
			/>
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
			{chatVisible && <PromptInputField
				handleSubmit={handleSubmitPrompt}
				nodeId={nodeId}
			/>}
		</>
	);
};

export default PromptNodeContent;

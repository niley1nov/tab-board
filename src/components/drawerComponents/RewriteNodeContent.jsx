import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import GeminiProRewriteService from "../../services/GeminiProRewriteService";
import GeminiNanoRewriteService from "../../services/GeminiNanoRewriteService";
import "../../stylesheets/ChatNodeContent.css"

const RewriteNodeContent = ({
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

	const handleSubmitPrompt = async () => {
		if (graph.adjacencyList[nodeId].left.length === 0) return;
		try {
			const node = graph.getNode(nodeId);
			let inputNode = graph.getNode(graph.adjacencyList[nodeId].left[0]);
			let context = inputNode.data.content;
			let name = adjacentNodeInputs[inputNode.id]; //use tab name + title
			console.log(context);
			node.data.context = context;
			node.data.processing = false;
			let service;
			if (modelSelection === "Gemini Pro") {
				service = new GeminiProRewriteService(token);
			} else if (modelSelection === "Gemini Nano") {
				service = new GeminiNanoRewriteService();
			}
			node.data.service = service;
			setGeminiService(service);
			node.data.session = await node.data.service.initializeSession(name);
			const response = await node.data.service.callModel(node, context, node.data.prompt);
			console.log("Response:", response);
			graph.selectedNode.data.content = response.text;
			node.data.ready = true;
			setChatVisible(true);
		} catch (error) {
			console.error("Error while submitting prompt.");
			console.error(error);
			throw error;
		}
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
			{graph.adjacencyList[nodeId].left.length > 0 && (
				<PromptInputField
					handleSubmit={handleSubmitPrompt} //take names for button states
					nodeId={nodeId}
				/>
			)}
		</>
	);
};

export default RewriteNodeContent;

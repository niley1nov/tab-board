import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { TextField, Typography, Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import GeminiProService from "../../services/GeminiProService";
import GeminiNanoService from "../../services/GeminiNanoService";
import "../../stylesheets/ChatNodeContent.css"

const WriteNodeContent = ({
	token,
	setDialogOpen
}) => {
	const graph = useGraph();
	const [promptNodeDetails, setPromptNodeDetails] = useState({});
	const { nodeId, adjacencyNodes } = graph.sidebarContent;
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState(graph.getNode(nodeId)?.data?.adjacentNodeInputs ?? {});
	const [chatVisible, setChatVisible] = useState(
		graph.getNode(nodeId)?.data?.ready ?? false
	);
	const [modelSelection, setModelSelection] = useState(graph.getNode(nodeId)?.data?.model ?? "Gemini Pro");
	const [geminiService, setGeminiService] = useState(graph.getNode(nodeId)?.data?.service ?? null);
	const [context, setContext] = useState(graph.getNode(nodeId)?.data?.context ?? "");
	const [prompt, setPrompt] = useState(graph.getNode(nodeId)?.data?.prompt ?? "");

	useEffect(() => {
		setChatVisible(graph.getNode(nodeId)?.data?.ready || false);
		setAdjacentNodeInputs(graph.getNode(nodeId)?.data?.adjacentNodeInputs || {});
		setModelSelection(graph.getNode(nodeId)?.data?.model || "Gemini Pro");
		setGeminiService(graph.getNode(nodeId)?.data?.service || null);
		setContext(graph.getNode(nodeId)?.data?.context || "");
		setPrompt(graph.getNode(nodeId)?.data?.prompt || "");
	}, [nodeId]);

	const handleContextChange = (e) => {
		setContext(e.target.value);

		// Update the prompt for the selected node in the graph context
		if (graph.selectedNode) {
			graph.selectedNode.data.context = e.target.value;
		}
	};

	const handlePromptChange = (e) => {
		setPrompt(e.target.value);

		// Update the prompt for the selected node in the graph context
		if (graph.selectedNode) {
			graph.selectedNode.data.prompt = e.target.value;
		}
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

	const initializeChat = async () => {
		let inputNodes = graph.adjacencyList[nodeId].left;
		let context = "";
		for (let nnid of inputNodes) {
			let name = adjacentNodeInputs[nnid];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += (graph.getNode(nnid).data.content + '\n\n' + '----------' + '\n\n');
		}
		console.log(context);
		const node = graph.getNode(nodeId);
		node.data.context = context;
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
		node.data.session = await node.data.service.initializePromptSession(context);
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
			<Typography className="text-title" style={{ fontFamily: "Poppins, sans-serif" }}>
				Context
			</Typography>
			<div className="context-container">
				<TextField
					fullWidth
					variant="outlined"
					placeholder="System Prompt..."
					value={context}
					onChange={handleContextChange}
					className="custom-text-field"
					multiline
					rows={4}
				/>
			</div>
			<br/>
			<Typography className="text-title" style={{ fontFamily: "Poppins, sans-serif" }}>
				Prompt
			</Typography>
			<div className="context-container">
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Prompt..."
					value={prompt}
					onChange={handlePromptChange}
					className="custom-text-field"
					multiline
					rows={4}
				/>
			</div>
			<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
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

export default WriteNodeContent;

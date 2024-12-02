import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { TextField, Typography, Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import GeminiProWriteService from "../../services/GeminiProWriteService";
import GeminiNanoWriteService from "../../services/GeminiNanoWriteService";
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
	const [loading, setLoading] = useState(graph.getNode(nodeId)?.data?.loading ?? false);
	const [context, setContext] = useState(graph.getNode(nodeId)?.data?.context ?? "");
	const [prompt, setPrompt] = useState(graph.getNode(nodeId)?.data?.prompt ?? "");

	useEffect(() => {
		setChatVisible(graph.getNode(nodeId)?.data?.ready || false);
		setLoading(graph.getNode(nodeId)?.data?.loading || false);
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

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		graph.getNode(nodeId).data.model = selectedValue;
		setModelSelection(selectedValue);
		if (selectedValue === "Gemini Pro" && !token) setDialogOpen(true);
	};

	const handleSendClick = async () => {
		graph.getNode(nodeId).data.loading = true;
		setLoading(true);
		try {
			console.log(context);
			console.log(prompt);
			const node = graph.getNode(nodeId);
			node.data.processing = false;
			let service;
			if (modelSelection === "Gemini Pro") {
				service = new GeminiProWriteService(token);
			} else if (modelSelection === "Gemini Nano") {
				service = new GeminiNanoWriteService();
			}
			node.data.service = service;
			setGeminiService(service);
			node.data.session = await node.data.service.initializeSession(context);
			const response = await node.data.service.callModel(node, prompt);
			console.log("Response:", response);
			graph.selectedNode.data.content = response.text;
			node.data.ready = true;
			setChatVisible(true);
		} catch (error) {
			console.error("Error while submitting prompt.");
			console.error(error);
			throw error;
		} finally {
			graph.getNode(nodeId).data.loading = false;
			setLoading(false);
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
					onClick={handleSendClick}
					className="send-button"
					disabled={loading}
				>
					{loading ? "Processing..." : "Write"}
				</Button>
			</Box>
		</>
	);
};

export default WriteNodeContent;

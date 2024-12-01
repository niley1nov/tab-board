import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import { useGraph } from "../../containers/GraphContext";
import {
	addFinalPrompt,
} from "../../helpers/CustomDrawerHelper";
import GeminiProService from "../../services/GeminiProService";
import GeminiNanoService from "../../services/GeminiNanoService";
import "../../stylesheets/ChatNodeContent.css"

const SummaryNodeContent = ({
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
	const [loading, setLoading] = useState(false); //store this in node
	const [abortController, setAbortController] = useState(null);

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

	const handleSendClick = async () => {
		if (adjacencyNodes.length === 0) return;
		const controller = new AbortController();
		setAbortController(controller);
		setLoading(true);
		try {
			let inputNode = adjacencyNodes[0];
			let context = "";
			let name = adjacentNodeInputs[inputNode.id];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += (inputNode.data.content + '\n\n' + '----------' + '\n\n');
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
			node.data.session = await node.data.service.initializeSummarySession();
			const response = await node.data.service.callModel(node, context);
			console.log("Response:", response);
			graph.selectedNode.data.content = response.text;
			setPromptNodeDetails((prevDetails) =>
				addFinalPrompt(prevDetails, nodeId, graph.selectedNode.data.prompt),
			); //what is this doing?
			node.data.ready = true;
			setChatVisible(true);
		} catch (error) {
			console.error("Error while submitting prompt:", error.message);
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
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) => {
					graph.getNode(nodeId).data.adjacentNodeInputs = { ...graph.getNode(nodeId).data.adjacentNodeInputs, [id]: value };
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }));
				}
				}
			/>
			<Box className="centered-button">
				{/* Show the button only if adjacencyNodes is not empty */}
				{adjacencyNodes.length > 0 && (
					<Button
						variant="contained"
						color="primary"
						onClick={loading ? handleStopClick : handleSendClick}
						disabled={loading}
						className="send-button"
					>
						{loading ? "Processing..." : "Summarize"}
					</Button>
				)}
			</Box>
		</>
	);
};

export default SummaryNodeContent;

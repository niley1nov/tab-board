import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import { useGraph } from "../../containers/GraphContext";
import GeminiProSummarizeService from "../../services/GeminiProSummarizeService";
import GeminiNanoSummarizeService from "../../services/GeminiNanoSummarizeService";
import "../../stylesheets/ChatNodeContent.css"

const SummaryNodeContent = ({
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
	const [loading, setLoading] = useState(graph.getNode(nodeId)?.data?.loading ?? false);

	useEffect(() => {
		setChatVisible(graph.getNode(nodeId)?.data?.ready || false);
		setLoading(graph.getNode(nodeId)?.data?.loading || false);
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
		if (graph.adjacencyList[nodeId].left.length === 0) return;
		graph.getNode(nodeId).data.loading = true;
		setLoading(true);
		try {
			let inputNode = graph.getNode(graph.adjacencyList[nodeId].left[0]);
			let context = "";
			let name = adjacentNodeInputs[inputNode.id];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += inputNode.data.content;
			console.log(context);
			const node = graph.getNode(nodeId);
			node.data.context = context;
			node.data.processing = false;
			let service;
			if (modelSelection === "Gemini Pro") {
				service = new GeminiProSummarizeService(token);
			} else if (modelSelection === "Gemini Nano") {
				service = new GeminiNanoSummarizeService();
			}
			node.data.service = service;
			setGeminiService(service);
			node.data.session = await node.data.service.initializeSession();
			const response = await node.data.service.callModel(node, context, name);
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
				{graph.adjacencyList[nodeId].left.length > 0 && (
					<Button
						variant="contained"
						color="primary"
						onClick={handleSendClick}
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

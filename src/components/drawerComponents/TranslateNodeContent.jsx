import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Divider, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import "../../stylesheets/CustomDrawer.css";
import ModelSelector from "./ModelSelector";
import { useGraph } from "../../containers/GraphContext";
import GeminiProTranslateService from "../../services/GeminiProTranslateService";
import GeminiNanoTranslateService from "../../services/GeminiNanoTranslateService";
import "../../stylesheets/ChatNodeContent.css"

const TranslateNodeContent = ({
	token,
	setDialogOpen
}) => {
	const graph = useGraph();
	const [language, setLanguage] = useState("English");
	const { nodeId, adjacencyNodes } = graph.sidebarContent;
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState(graph.getNode(nodeId)?.data?.adjacentNodeInputs ?? {});
	const [chatVisible, setChatVisible] = useState(
		graph.getNode(nodeId)?.data?.ready ?? false
	);
	const [modelSelection, setModelSelection] = useState(graph.getNode(nodeId)?.data?.model ?? "Gemini Pro");
	const [geminiService, setGeminiService] = useState(graph.getNode(nodeId)?.data?.service ?? null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setChatVisible(graph.getNode(nodeId)?.data?.ready || false);
		setAdjacentNodeInputs(graph.getNode(nodeId)?.data?.adjacentNodeInputs || {});
		setModelSelection(graph.getNode(nodeId)?.data?.model || "Gemini Pro");
		setGeminiService(graph.getNode(nodeId)?.data?.service || null);
	}, [nodeId]);

	const handleSendClick = async () => {
		try {
			setLoading(true);
			if (graph.adjacencyList[nodeId].left.length === 0) return;
			const node = graph.getNode(nodeId);
			node.data.loading = true;
			let inputNode = graph.getNode(graph.adjacencyList[nodeId].left[0]);
			let context = "";
			let name = adjacentNodeInputs[inputNode.id];
			if (!!name) {
				context += (name + '\n\n');
			}
			context += inputNode.data.content;
			console.log(context);
			node.data.context = context;
			node.data.processing = false;
			let service;
			if (modelSelection === "Gemini Pro") {
				service = new GeminiProTranslateService(token);
			} else if (modelSelection === "Gemini Nano") {
				service = new GeminiNanoTranslateService();
			}
			node.data.service = service;
			setGeminiService(service);
			node.data.session = await node.data.service.initializeSession(language, name);
			const response = await node.data.service.callModel(node, context);
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

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		graph.getNode(nodeId).data.model = selectedValue;
		setModelSelection(selectedValue);
		if (selectedValue === "Gemini Pro" && !token) setDialogOpen(true);
	};

	const handleLanguageChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		graph.getNode(nodeId).data.targetLanguage = selectedValue;
		setLanguage(selectedValue);
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
				{graph.adjacencyList[nodeId].left.length > 0 && (
					<Box mb={2}>
						<div className="prompt-container">
							<div>
								<Typography className="language-selector-title" style={{ fontFamily: "Poppins, sans-serif" }}>
									Choose Language
								</Typography>
								<FormControl fullWidth>
									<Select
										value={language || "English"}
										onChange={(e) => handleLanguageChange(nodeId, e)}
										style={{ fontFamily: "Poppins, sans-serif" }}
										className="custom-select"
									>
										<MenuItem value="English">English</MenuItem>
										<MenuItem value="German">German</MenuItem>
										<MenuItem value="French">French</MenuItem>
									</Select>
								</FormControl>
							</div>
							<div className="button-container">
								<Button
									variant="contained"
									color="primary"
									onClick={handleSendClick}
									disabled={loading}
									className="send-button"
								>
									{loading ? "Processing..." : "Translate"}
								</Button>
							</div>
						</div>

					</Box>
				)}
			</Box>
		</>
	);
};

export default TranslateNodeContent;
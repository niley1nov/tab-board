import React, { useState, useEffect } from "react";
import AdjacentNodeInputs from "./AdjacentNodeInputs";
import { Button, Box } from "@mui/material";
import { Divider } from "@mui/material";
import ModelSelector from "./ModelSelector";
import PromptInputField from "./PromptInputField";
import { useGraph } from "../../containers/GraphContext";
import {
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
	const [chatVisible, setChatVisible] = useState(
		graph.getNode(nodeId)?.data?.ready ?? false
	);

	const handleSubmitPrompt = async () => {
		try {
			const node = graph.getNode(nodeId);
			const response = await geminiService.callModel(node, graph.selectedNode.data.prompt);
			console.log("Response:", response);
			graph.selectedNode.data.content = response.text;
			setPromptNodeDetails((prevDetails) =>
				addFinalPrompt(prevDetails, nodeId, graph.selectedNode.data.prompt),
			); //what is this doing?
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

	const initializeChat = () => {
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
		if (graph.selectedNode.data.context !== context) {
			node.data.context = context;
			node.data.processing = false;
			node.data.session = geminiService.initializeSession(context);
		}
		node.data.ready = true;
		setChatVisible(true);
	};

	return (
		<>
			<ModelSelector
				selectedModel={nodeModelSelections[nodeId]}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<Divider sx={{ marginY: 2, borderColor: "#F1E9FF" }} />
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) =>
					setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }))
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
				handleSubmit={handleSubmitPrompt} // Updated to pass handleSubmitPrompt
			/>}
		</>
	);
};

export default PromptNodeContent;

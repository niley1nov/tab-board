import React, { useState } from 'react';
import AdjacentNodeInputs from './AdjacentNodeInputs';
import ModelSelector from './ModelSelector';
import PromptInputField from './PromptInputField';
import { updatePromptNodeDetails, addFinalPrompt } from '../../helpers/CustomDrawerHelper';
import GeminiProService from '../../services/GeminiProService';

const PromptNodeContent = ({ content, prompt, setPrompt, token, dialogOpen, setDialogOpen }) => {
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});
	const [nodeModelSelections, setNodeModelSelections] = useState({});
	const [promptNodeDetails, setPromptNodeDetails] = useState({});
	const { nodeId, adjacencyNodes } = content;

	const handleSendInput = async (tabNodeId, promptText) => {
		const context = adjacencyNodes.find((node) => node.id === tabNodeId)?.data.content || '';
		try {
			const geminiService = new GeminiProService(token);
			const response = token ? await geminiService.callModel(`Prompt: ${promptText}\nContext: ${context}`) : null;
			console.log('Response: ', response);
			setPromptNodeDetails((prevDetails) =>
				updatePromptNodeDetails(prevDetails, nodeId, tabNodeId, promptText, context, response)
			);
		} catch (error) {
			console.error(`Error for TabNode ${tabNodeId}:`, error.message);
		}
	};

	const handleSubmitPrompt = async () => {
		try {
			const geminiService = new GeminiProService(token);
			const response = token ? await geminiService.callModel(prompt) : null;
			console.log('Response:', response);
			setPromptNodeDetails((prevDetails) => addFinalPrompt(prevDetails, nodeId, prompt));
		} catch (error) {
			console.error('Error while submitting prompt:', error.message);
		}
	};

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		setNodeModelSelections((prev) => ({ ...prev, [nodeId]: selectedValue }));
		if (selectedValue === 'Gemini Pro' && !token) setDialogOpen(true);
	};

	return (
		<>
			<AdjacentNodeInputs
				adjacencyNodes={adjacencyNodes}
				adjacentNodeInputs={adjacentNodeInputs}
				handleInputChange={(id, value) => setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }))}
			/>
			<ModelSelector
				selectedModel={nodeModelSelections[nodeId]}
				nodeId={nodeId}
				handleModelChange={handleModelChange}
			/>
			<PromptInputField
				prompt={prompt}
				setPrompt={setPrompt}
				handleSubmit={handleSubmitPrompt} // Updated to pass handleSubmitPrompt
			/>
		</>
	);
};

export default PromptNodeContent;

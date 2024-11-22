import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import DrawerHeader from './DrawerHeader';
import AdjacentNodeInputs from './AdjacentNodeInputs';
import ModelSelector from './ModelSelector';
import PromptInputField from './PromptInputField';
import TokenDialog from './TokenDialog';
import ScrollableContent from './ScrollableContent';
import ReactMarkdown from 'react-markdown';
import { updatePromptNodeDetails, addFinalPrompt } from '../../helpers/CustomDrawerHelper';
import useToken from '../../helpers/useToken';
import GeminiProService from '../../services/GeminiProService';
import '../../stylesheets/CustomDrawer.css';

const CustomDrawer = ({ open, onClose, prompt, setPrompt, content }) => {
	const { token, setToken } = useToken();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [apiToken, setApiToken] = useState('');
	const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});
	const [nodeModelSelections, setNodeModelSelections] = useState({});
	const [promptNodeDetails, setPromptNodeDetails] = useState({});
	const { nodeId, title, nodeType, adjacencyNodes, additionalContent } = content;

	const handleSendInput = async (tabNodeId) => {
		const promptText = adjacentNodeInputs[tabNodeId];
		const context = adjacencyNodes.find((node) => node.id === tabNodeId)?.data.content || '';
		try {
			const geminiService = new GeminiProService(token);
			const response = token ? await geminiService.callModel(`Prompt: ${promptText}\nContext: ${context}`) : null;
			console.log("Response: ", response);
			setPromptNodeDetails((prevDetails) =>
				updatePromptNodeDetails(prevDetails, nodeId, tabNodeId, promptText, context, response)
			);
		} catch (error) {
			console.error(`Error for TabNode ${tabNodeId}:`, error.message);
		}
	};

	function closeDialog(openDialog, save)  {
		setDialogOpen(openDialog);
		if(!save) {
			setApiToken(token);
		}
	}

	const handleModelChange = (nodeId, event) => {
		const selectedValue = event.target.value;
		setNodeModelSelections((prev) => ({ ...prev, [nodeId]: selectedValue }));
		console.log(token);
		if (selectedValue === 'Gemini Pro' && !token) setDialogOpen(true);
	};

	const handleSubmitPrompt = () => {
		setPromptNodeDetails((prevDetails) => addFinalPrompt(prevDetails, nodeId, prompt));
		console.log("Final Object: ", promptNodeDetails);
	};

	return (
		<>
			<Drawer
				anchor="right"
				open={open}
				onClose={onClose}
				PaperProps={{
					className: 'drawer-paper',
					sx: { width: '320px', top: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' },
				}}
				ModalProps={{ keepMounted: true }}
			>
				<DrawerHeader title={title} onClose={onClose} />
				{nodeType === 'PromptNode' && (
					<>
						<AdjacentNodeInputs
							adjacencyNodes={adjacencyNodes}
							adjacentNodeInputs={adjacentNodeInputs}
							handleInputChange={(id, value) => setAdjacentNodeInputs((prev) => ({ ...prev, [id]: value }))}
							handleSendInput={handleSendInput}
						/>
						<ModelSelector
							selectedModel={nodeModelSelections[nodeId]}
							nodeId={nodeId}
							handleModelChange={handleModelChange}
						/>
						<PromptInputField prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmitPrompt} />
					</>
				)}
				{nodeType === 'TabNode' && (
					<ScrollableContent>
						{additionalContent ? (
							<div className="tab-content">
								<ReactMarkdown>{additionalContent}</ReactMarkdown>
							</div>
						) : (
							<div>No content available.</div>
						)}
					</ScrollableContent>
				)}
			</Drawer>
			<TokenDialog
				open={dialogOpen}
				apiToken={apiToken}
				setApiToken={setApiToken}
				onClose={() => closeDialog(false, false)}
				onSubmit={() => {
					setToken(apiToken);
					closeDialog(false, true);
				}}
			/>
		</>
	);
};

export default CustomDrawer;

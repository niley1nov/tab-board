import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { Handle, Position } from '@xyflow/react';
import '../stylesheets/PromptNode.css';

const PromptNode = ({ data }) => {
	const [highlighted, setHighlighted] = useState(false);
	const [prompt, setPrompt] = useState('');
	const [response, setResponse] = useState('');
	const nodeRef = useRef(null);

	// Function to handle prompt submission to the API
	const handlePromptSubmit = async () => {
		// if (!prompt) return; // Prevent empty submissions
		// try {
		// 	// Replace with actual API call to Gemini Nano
		// 	const response = await fetch('https://api.gemini-nano.com/generate', {
		// 		method: 'POST',
		// 		headers: { 'Content-Type': 'application/json' },
		// 		body: JSON.stringify({ prompt })
		// 	});
		// 	const data = await response.json();
		// 	setResponse(data.output); // Adjust according to actual API response format
		// } catch (error) {
		// 	console.error('Error:', error);
		// 	setResponse('Failed to generate response');
		// }
		console.log("Inside Handle Prompt")
	};

	return (
		<div onClick={data.onClick}
			ref={nodeRef}
			className={`prompt-node ${highlighted ? 'highlighted' : ''}`}
		>
			{/* Left Handle for Schema */}
			<Handle type="target" position={Position.Left} id="schema" style={{ top: '50%' }} />

			{/* Header Section */}
			<div className="prompt-node-header">
				<Typography variant="subtitle2" className="prompt-node-title">
					{data.label}
				</Typography>
				<div className="prompt-node-actions">
					<IconButton aria-label="settings" onClick={data.onOpenMenu} size="small">
						<MoreVertIcon fontSize="small" />
					</IconButton>
				</div>
			</div>

			<Divider className="prompt-node-divider" />

			{/* Prompt Input Section */}
			<div className="prompt-node-content">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<TextField
						variant="outlined"
						size="small"
						label="Prompt"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						style={{ flexGrow: 1 }} // Make input field small
					/>
					<IconButton
						color="primary"
						onClick={handlePromptSubmit}
						size="small"
						style={{ marginLeft: 4 }}
					>
						<SendIcon fontSize="small" />
					</IconButton>
				</div>
			</div>

			{/* API Response Section */}
			<div className="prompt-node-response">
				<Typography variant="body2" color="textSecondary">
					{response || 'API response will appear here.'}
				</Typography>
			</div>

			{/* Right Handle for Context */}
			<Handle type="source" position={Position.Right} id="context" style={{ top: '50%' }} />
		</div>
	);
};

export default PromptNode;
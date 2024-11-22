import '../../stylesheets/Sidebar.css';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Divider from '@mui/material/Divider';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { 
    Box, 
    IconButton, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Switch, 
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useToken } from '../../containers/TokenContext';

const SideBar = ({ content, isSidebarVisible, setIsSidebarVisible }) => {
    
    const { token, setToken } = useToken();
    
    const [prompt, setPrompt] = useState('');
    const [storedPrompt, setStoredPrompt] = useState('');
    const [output, setOutput] = useState(null);
    const [open, setOpen] = useState(false);
	const [apiToken, setApiToken] = useState('');
    const [isSwitchOn, setIsSwitchOn] = useState({});
    const [isMinimized, setIsMinimized] = useState(false);
    const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});  // To manage inputs for adjacent nodes
    const [tabNodePrompts, setTabNodePrompts] = useState({});
    const { title, nodeType, additionalContent = "", adjacencyNodes  } = content;

    function setInert(inert) {
		const root = document.getElementById('root');
		if (root) {
			root.inert = inert;
		}
	}

	useEffect(() => {
        // Initialize apiToken with the current token value on component mount
		setApiToken(token);

        // Remove inert if dialog is closed
		if (!open) {
			setInert(false);
		}
	}, [token, open]);

    useEffect(() => {
        if (adjacencyNodes && adjacencyNodes.length > 0) {  // Check if adjacencyNodes exists and is not empty
            const updatedPrompts = {};
    
            adjacencyNodes.forEach(node => {
                updatedPrompts[node.id] = tabNodePrompts[node.id] || '';
            });
            
            setTabNodePrompts(updatedPrompts);
        }
    }, [adjacencyNodes]);
    

    const togglePopup = () => {
        setIsMinimized(!isMinimized);
        setIsSidebarVisible(!isSidebarVisible);
    };

    const handleSwitchChange = (nodeId) => (event) => {
        const isChecked = event.target.checked;

        setIsSwitchOn(prevState => ({
            ...prevState,
            [nodeId]: isChecked,  // Update only for the specific node ID
        }));
    
        if (isChecked) {
            setOpen(true);  // Only open when the switch is checked (turned on)
        } else {
            setOpen(false); // Optionally close it when unchecked
        }
    };

    const handleSettingSubmit = () => {
		setToken(apiToken);
		setOpen(false);
	};

    const handleSettingClose = () => {
		setOpen(false);
        setIsSwitchOn(false);
		setApiToken(token);
	};

    // Action on Get Output button
    const handleGetOutput = () => {
        setOutput("Generated output text goes here.");
    };

    // Handle input change for each adjacent node
    const handleAdjacentNodeInputChange = (nodeId, value) => {
        setAdjacentNodeInputs(prevState => ({
            ...prevState,
            [nodeId]: value,
        }));
    };

    // Handle sending input for each adjacent node
    const handleSendInput = (nodeId) => {
        const promptText = adjacentNodeInputs[nodeId];
        setTabNodePrompts(prevPrompts => ({
            ...prevPrompts,
            [nodeId]: promptText,
        }));
    };

    const handleSubmitPrompt = () => {
        setStoredPrompt(prompt);
        // Add logic to handle submitting the prompt
    };

    return (
        <>
            <Box className={`popup-container ${isMinimized ? 'minimized' : ''}`}>
                {!isMinimized ? (
                    <Paper elevation={4} className="sidebar-content">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" className="sidebar-title" sx={{ padding: '8px 0' }}>
                                {title}
                            </Typography>
                            <IconButton onClick={togglePopup} size="small">
                                <MinimizeIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <Box className="sidebar-scrollable-content" sx={{ padding: 2 }}>
                            {nodeType === 'TabNode' && (
                                <div>
                                    <ReactMarkdown className="sidebar-markdown">{additionalContent}</ReactMarkdown>
                                </div>
                            )}

                            {nodeType === 'PromptNode' && (
                                <div>
                                    {/* List all adjacent nodes with input fields and send icons */}
                                    {adjacencyNodes.length > 0 && (
                                        <Box>
                                            {adjacencyNodes
                                                .filter(adjNode => adjNode.type === 'TabNode')
                                                .map((adjNode) => (
                                                <Box key={adjNode.id} className="adjacent-node-input-container">
                                                    {/* Title on its own line */}
                                                    <Typography className="adjacent-node-title" variant="body1">
                                                        {adjNode.data.label}
                                                    </Typography>

                                                    <Box className="input-send-container" width="100%">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter a prompt about the tab."
                                                            value={adjacentNodeInputs[adjNode.id] || ''}
                                                            onChange={(e) => handleAdjacentNodeInputChange(adjNode.id, e.target.value)}
                                                            style={{
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #ccc',
                                                                width: '100%',
                                                                flexGrow: 1,
                                                                marginRight: '8px', // Space between input and button
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleSendInput(adjNode.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '0',
                                                            }}
                                                        >
                                                            <SendIcon />
                                                        </button>
                                                    </Box>
                                                    <br/>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    <Divider sx={{ marginTop: 2 }} />
                                    {/* Bottom input for the prompt */}
                                    <TextField
                                        label="Enter Prompt"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        sx={{ marginTop: 2 }}
                                    />

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isSwitchOn[content.id] || false}
                                                onChange={handleSwitchChange(content.id)}
                                                color="primary"
                                            />
                                        }
                                        label="Gemini API"
                                        sx={{ marginTop: 2 }}
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitPrompt}
                                        fullWidth  // Make it full width
                                        sx={{ marginTop: 2, padding: '8px' }}  // Reduce padding
                                    >
                                        Submit
                                    </Button>
                                </div>
                            )}

                            {nodeType === 'OutputNode' && (
                                <div>
                                    <Button variant="contained" onClick={handleGetOutput} sx={{ marginTop: 2 }}>
                                        Get Output
                                    </Button>
                                    {output && (
                                        <Typography variant="body2" className="sidebar-output" sx={{ marginTop: 2 }}>
                                            {output}
                                        </Typography>
                                    )}
                                </div>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    <IconButton onClick={togglePopup} className="minimized-icon">
                        <ExpandLessIcon />
                    </IconButton>
                )}
            </Box>
            {/* Modal Dialog */}
            <Dialog open={open} onClose={handleSettingClose}>
				<DialogTitle>Enter API Token</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter your API token to proceed.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="API Token"
						type="text"
						fullWidth
						variant="outlined"
						value={apiToken}
						onChange={(e) => setApiToken(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSettingClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSettingSubmit} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
        </>
    );
};

export default SideBar;

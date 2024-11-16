import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Divider,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import { useToken } from '../containers/TokenContext';
import '../stylesheets/CustomDrawer.css';

// Import Services
import GeminiProService from '../services/GeminiProService';

const CustomDrawer = ({
  open,
  onClose,
  prompt,
  setPrompt,
  content
}) => {
  const { token, setToken } = useToken();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [storedPrompt, setStoredPrompt] = useState('');
  const [nodeModelSelections, setNodeModelSelections] = useState({}); // Per-node model selection
  const [isGeminiProSelected, setIsGeminiProSelected] = useState(false); // Gemini Pro selection state
  const [apiToken, setApiToken] = useState('');
  const [adjacentNodeInputs, setAdjacentNodeInputs] = useState({});
  const [tabNodePrompts, setTabNodePrompts] = useState({});
  const [promptNodeDetails, setPromptNodeDetails] = useState({}); // New state to track details per PromptNode
  const { nodeId, title, nodeType, additionalContent = "", adjacencyNodes } = content;

  useEffect(() => {
    console.log("CONTENT: ", content);
  }, []);

  useEffect(() => {
    setApiToken(token);
  }, [token, open]);

  const handleSendInput = async (tabNodeId) => {
    const promptText = adjacentNodeInputs[tabNodeId];
    const context = adjacencyNodes.find(node => node.id === tabNodeId)?.data.content || '';
  
    try {
      let response = null;
      if (isGeminiProSelected && token) {
        const geminiService = new GeminiProService(token);
        response = await geminiService.callModel(`Prompt: ${promptText}\nContext: ${context}`);
      }
  
      setPromptNodeDetails(prevDetails => ({
        ...prevDetails,
        [nodeId]: {
          ...(prevDetails[nodeId] || {}),
          [tabNodeId]: {
            [`subprompt`]: promptText,
            [`context`]: context,
            [`response`]: response || "No response available"
          }
        }
      }));
  
      console.log(`Updated details for TabNode ${tabNodeId}:`, {
        subprompt: promptText,
        context,
        response
      });
    } catch (error) {
      console.error(`Error for TabNode ${tabNodeId}:`, error.message);
    }
  };
  
  useEffect(() => {
    console.log("Current nodeModelSelections:", promptNodeDetails);
  }, [promptNodeDetails]);  

  const handleAdjacentNodeInputChange = (nodeId, value) => {
    setAdjacentNodeInputs(prevState => ({
      ...prevState,
      [nodeId]: value,
    }));
  };

  const handleSubmitPrompt = () => {
    setPromptNodeDetails(prevDetails => ({
      ...prevDetails,
      [nodeId]: {
        ...(prevDetails[nodeId] || {}),
        finalPrompt: prompt
      }
    }));
  
    console.log("Final PromptNode Details Object:", {
      ...promptNodeDetails,
      [nodeId]: {
        ...(promptNodeDetails[nodeId] || {}),
        finalPrompt: prompt
      }
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setApiToken(''); // Clear the local token state (for the input field) but keep the global token intact
  };

  const handleDialogSubmit = () => {
    setToken(apiToken);  // Submit the token to global state
    setDialogOpen(false); // Close the dialog
    console.log("API Token submitted:", apiToken); // Log the entered token for the current node
  };

  const handleModelChange = (nodeId, event) => {
    console.log("CHECKING NODE ID : ", nodeId);
    const selectedValue = event.target.value;
    setNodeModelSelections(prevModels => ({
      ...prevModels,
      [nodeId]: selectedValue
    }));

    // Check if any node now has Gemini Pro selected
    const updatedSelections = { ...nodeModelSelections, [nodeId]: selectedValue };
    const hasGeminiPro = Object.values(updatedSelections).includes('Gemini Pro');
    setIsGeminiProSelected(hasGeminiPro);

    // If Gemini Pro is selected and no token, show dialog
    if (selectedValue === "Gemini Pro" && !token) {
      setDialogOpen(true); // Only ask for the token if it's not already set
    }
  };

  useEffect(() => {
    if (adjacencyNodes && adjacencyNodes.length > 0) {
      const updatedPrompts = {};
      adjacencyNodes.forEach(node => {
        updatedPrompts[node.id] = tabNodePrompts[node.id] || '';
      });
      setTabNodePrompts(updatedPrompts);
    }
  }, [adjacencyNodes]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          className: 'drawer-paper',
          sx: {
            width: '320px',
            top: '64px',
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
          },
        }}
        BackdropComponent={null}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
        }}
        variant="persistent"
      >
        {/* Drawer header */}
        <Box className="drawer-header">
          <Typography variant="h6" className="sidebar-title">
            {title}
          </Typography>
          <IconButton onClick={onClose} className="close-icon">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ marginY: 2, borderColor: '#242629' }} /> {/* Custom divider color */}

        <Box
          mt={2}
          sx={{
            overflowY: 'auto',
            overflowX: 'hidden',       // Prevent horizontal scroll
            paddingRight: '8px',       // Space between content and vertical scrollbar
            height: 'calc(100vh - 140px)',
          }}
        >

          {nodeType === 'TabNode' && (
            <Box sx={{
              overflowY: 'auto',
              overflowX: 'hidden',  // Prevent horizontal scroll in additional content
              height: '100%',
              paddingRight: '8px',  // Space between content and vertical scrollbar
            }}>
              <ReactMarkdown className="sidebar-markdown">
                {additionalContent}
              </ReactMarkdown>
            </Box>
          )}

          {/* Adjacent Node Inputs if nodeType is 'PromptNode' */}
          {nodeType === 'PromptNode' && (
            <Box sx={{ overflowY: 'auto', paddingRight: '8px' }}> {/* Ensure scrollable area */}
              {adjacencyNodes
                .filter(adjNode => adjNode.type === 'TabNode')
                .map((adjNode) => (
                  <Box key={adjNode.id} className="adjacent-node-input-container" mb={2}>
                    <Typography className="adjacent-node-title" variant="body1">
                      {adjNode.data.label}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter a prompt about the tab."
                      value={adjacentNodeInputs[adjNode.id] || ''}
                      onChange={(e) => handleAdjacentNodeInputChange(adjNode.id, e.target.value)}
                      InputProps={{
                        disableUnderline: true,
                        className: 'text-field',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleSendInput(adjNode.id)}
                              sx={{ color: 'white' }}
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: '100%' }}  // Ensure input takes full width
                    />
                  </Box>
                ))}
              <Divider sx={{ marginY: 2, borderColor: '#242629' }} /> {/* Custom divider color */}

              {/* Model Selection Dropdown */}
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: 'white' }}>Model</Typography>
                <FormControl fullWidth>
                  <Select
                    value={nodeModelSelections[nodeId] || 'Gemini Nano'}
                    onChange={(e) => handleModelChange(nodeId, e)}
                    className="select-border"
                  >
                    <MenuItem value="Gemini Nano">Gemini Nano</MenuItem>
                    <MenuItem value="Gemini Pro">Gemini Pro</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Prompt Input Field with Move to Top Icon */}
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type something"
                  InputProps={{
                    disableUnderline: true,
                    className: 'text-field',
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSubmitPrompt()}
                          sx={{ color: 'white' }}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  sx={{ width: '100%' }}  // Ensure input takes full width
                />
              </Box>
              <Box sx={{ marginBottom: '40px' }} /> {/* Added margin below the prompt field */}
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: '#0C0E11',      // Dark background color to match theme
            color: 'white',                  // White text color for readability
            padding: '20px',                 // Extra padding for spacing
            borderRadius: '8px',             // Rounded corners for a softer look
            minWidth: '400px',               // Minimum width to prevent narrow appearance
          },
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.25rem' }}>
          Enter API Token
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#b3b3b3', mb: 2 }}>
            Please enter your API token to proceed.
          </DialogContentText>
          <TextField
            label="API Token"
            variant="outlined"
            fullWidth
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#333', // Dark background for the input field
                borderRadius: '8px',      // Rounded corners for the input
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: '#ffffff' }}>Cancel</Button>
          <Button onClick={handleDialogSubmit} sx={{ color: '#ffffff' }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomDrawer;

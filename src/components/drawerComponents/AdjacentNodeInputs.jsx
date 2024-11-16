import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import '../../stylesheets/CustomDrawer.css';

const AdjacentNodeInputs = ({ adjacencyNodes, adjacentNodeInputs, handleInputChange, handleSendInput }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [abortControllers, setAbortControllers] = useState({}); // To handle request cancellation

  const handleSendClick = async (nodeId) => {
    const abortController = new AbortController(); // Create a new AbortController for each request
    setAbortControllers((prev) => ({ ...prev, [nodeId]: abortController }));

    setLoadingStates((prev) => ({ ...prev, [nodeId]: true }));
    try {
      await handleSendInput(nodeId, abortController.signal); // Pass signal for cancellation
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error while sending input for node ${nodeId}:`, error.message);
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [nodeId]: false }));
      setAbortControllers((prev) => {
        const updatedControllers = { ...prev };
        delete updatedControllers[nodeId];
        return updatedControllers;
      });
    }
  };

  const handleStopClick = (nodeId) => {
    if (abortControllers[nodeId]) {
      abortControllers[nodeId].abort(); // Abort the request
    }
  };

  return (
    <Box>
      {adjacencyNodes
        .filter((node) => node.type === 'TabNode')
        .map((node) => (
          <Box key={node.id} mb={2} className="adjacent-node-input-container">
            <Typography className="adjacent-node-title" variant="body1">{node.data.label}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter a prompt about the tab."
              value={adjacentNodeInputs[node.id] || ''}
              onChange={(e) => handleInputChange(node.id, e.target.value)}
              disabled={loadingStates[node.id]} // Disable input while loading
              InputProps={{
                disableUnderline: true,
                className: 'text-field',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        loadingStates[node.id]
                          ? handleStopClick(node.id) // Handle stop click
                          : handleSendClick(node.id) // Handle send click
                      }
                      sx={{ color: 'white' }}
                    >
                      {loadingStates[node.id] ? (
                        <StopCircleIcon /> // Show StopCircleIcon when loading
                      ) : (
                        <SendIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: '100%' }}
            />
          </Box>
        ))}
    </Box>
  );
};

export default AdjacentNodeInputs;

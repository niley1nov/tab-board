import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import '../../stylesheets/CustomDrawer.css';

const ModelSelector = ({ selectedModel, nodeId, handleModelChange }) => (
	<Box mb={2}>
		<Typography variant="body1" sx={{ color: 'white' }}>Model</Typography>
		<FormControl fullWidth>
			<Select
				value={selectedModel || 'Gemini Nano'}
				onChange={(e) => handleModelChange(nodeId, e)}
				className="select-border"
			>
				<MenuItem value="Gemini Nano">Gemini Nano</MenuItem>
				<MenuItem value="Gemini Pro">Gemini Pro</MenuItem>
			</Select>
		</FormControl>
	</Box>
);

export default ModelSelector;

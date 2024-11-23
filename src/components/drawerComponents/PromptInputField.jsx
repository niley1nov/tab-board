import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import '../../stylesheets/CustomDrawer.css';

const PromptInputField = ({ prompt, setPrompt, handleSubmit }) => (
	<Box mb={2}>
		<TextField
			fullWidth
			variant="outlined"
			placeholder="Type something"
			value={prompt}
			onChange={(e) => setPrompt(e.target.value)}
			slotProps={{
				input: {
					className: 'text-field',
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleSubmit} sx={{ color: 'white' }}>
								<ArrowUpwardIcon />
							</IconButton>
						</InputAdornment>
					),
				},
			}}
			sx={{ width: '100%' }}
		/>
	</Box>
);

export default PromptInputField;

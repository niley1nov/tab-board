import React, { useState } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import "../../stylesheets/CustomDrawer.css";

const PromptInputField = ({ prompt, setPrompt, handleSubmit }) => {
	const [loading, setLoading] = useState(false);
	const [abortController, setAbortController] = useState(null);

	const handleSendClick = async () => {
		const controller = new AbortController();
		setAbortController(controller);
		setLoading(true);

		try {
			await handleSubmit(controller.signal); // Send the prompt to Gemini API
		} catch (error) {
			if (error.name !== "AbortError") {
				console.error("Error while sending prompt:", error.message);
			}
		} finally {
			setLoading(false);
			setAbortController(null);
		}
	};

	const handleStopClick = () => {
		if (abortController) {
			abortController.abort(); // Cancel the ongoing request
		}
	};

	return (
		<Box mb={2}>
			<TextField
				fullWidth
				variant="outlined"
				placeholder="Submit Prompt Here..."
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="custom-text-field"
				slotProps={{
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={
										loading
											? handleStopClick
											: handleSendClick
									}
									className="icon-button"
								>
									{loading ? <StopCircleIcon /> : <SendIcon />}
								</IconButton>
							</InputAdornment>
						),
					},
				}}
			/>
		</Box>
	);
};

export default PromptInputField;

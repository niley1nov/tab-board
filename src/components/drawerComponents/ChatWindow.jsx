import React, { useState } from "react";
import { TextField, Paper, List, ListItem, ListItemText, Button, Divider, Box } from "@mui/material";

const ChatWindow = ({ handleSubmitPrompt }) => {
	const [messages, setMessages] = useState([]); // Store chat messages
	const [input, setInput] = useState(""); // User input

	const handleSend = () => {
		if (!input.trim()) return;

		// Add user message
		setMessages((prev) => [...prev, { sender: "user", text: input }]);

		// Dummy Gemini response
		const dummyResponse = "This is a dummy response from Gemini!";
		setMessages((prev) => [...prev, { sender: "gemini", text: dummyResponse }]);

		// Clear input
		setInput("");
	};

	return (
		<Paper style={{ padding: "16px", height: "400px", display: "flex", flexDirection: "column" }}>
			{/* Chat Display */}
			<List style={{ flex: 1, overflow: "auto" }}>
				{messages.map((message, index) => (
					<ListItem key={index} style={{ textAlign: message.sender === "user" ? "right" : "left" }}>
						<ListItemText
							primary={message.text}
							style={{
								backgroundColor: message.sender === "user" ? "#d1f1ff" : "#f1f1f1",
								borderRadius: "12px",
								padding: "8px 12px",
								display: "inline-block",
							}}
						/>
					</ListItem>
				))}
			</List>

			{/* Divider */}
			<Divider style={{ margin: "8px 0" }} />

			{/* Input and Send Button */}
			<Box display="flex" gap="8px">
				<TextField
					variant="outlined"
					fullWidth
					placeholder="Type your message here..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") handleSend();
					}}
				/>
				<Button variant="contained" onClick={handleSend}>
					Send
				</Button>
			</Box>
		</Paper>
	);
};

export default ChatWindow;

import React, { useState } from "react";
import { TextField, Paper, List, ListItem, ListItemText, Button, Divider, Box, CircularProgress } from "@mui/material";
import "../../stylesheets/ChatWindow.css";

const ChatWindow = ({ handleSendMessage }) => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		if (!input.trim() || loading) return;
		setLoading(true);
		// Add user message
		setMessages((prev) => [...prev, { sender: "user", text: input }]);
		// Clear input
		setInput("");
		// Get AI response
		try {
			const response = await handleSendMessage(input);
			// Add AI response
			setMessages((prev) => [...prev, { sender: "gemini", text: response }]);
		} catch (error) {
			console.error("Error fetching response:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Paper className="chat-window">
			<List className="message-list">
				{messages.map((message, index) => (
					<ListItem
						key={index}
						className={`message-item ${message.sender === "user" ? "user-message" : "gemini-message"
							}`}
					>
						<ListItemText
							primary={message.text}
							className="message-text"
						/>
					</ListItem>
				))}
			</List>
			<Divider className="divider" />
			<Box className="input-container">
				<TextField
					variant="outlined"
					fullWidth
					placeholder="Type your message here..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !loading) handleSend(); // Use onKeyDown instead of onKeyPress
					}}
					disabled={loading}
				/>
				<Button
					variant="contained"
					onClick={handleSend}
					disabled={loading || !input.trim()}
					className="send-button"
				>
					{loading ? <CircularProgress size={24} className="loading-spinner" /> : "Send"}
				</Button>
			</Box>
		</Paper>
	);
};

export default ChatWindow;

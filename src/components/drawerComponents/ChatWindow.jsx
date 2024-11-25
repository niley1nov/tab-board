import React, { useState, useEffect } from "react";
import { TextField, Paper, List, ListItem, ListItemText, Button, Divider, Box, CircularProgress } from "@mui/material";
import { useGraph } from "../../containers/GraphContext";
import "../../stylesheets/ChatWindow.css";

const ChatWindow = ({ handleSendMessage }) => {
	const graph = useGraph();
	const selectedNode = graph.selectedNode;

	// Initialize state for the selected node
	const [messages, setMessages] = useState(selectedNode.data.chatHistory || []);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	// Update messages when the selectedNode changes
	useEffect(() => {
		if (!selectedNode.data.chatHistory) {
			selectedNode.data.chatHistory = []; // Initialize chatHistory if it doesn't exist
		}
		setMessages(selectedNode.data.chatHistory);
	}, [selectedNode]);

	// Sync messages to selectedNode.data
	useEffect(() => {
		setMessages(selectedNode.data.chatHistory);
	}, [messages, selectedNode, selectedNode.data.chatHistory]);

	const handleSend = async () => {
		if (!input.trim() || loading) return;
		setLoading(true);
		// Add user message
		selectedNode.data.chatHistory = [...selectedNode.data.chatHistory, { sender: "user", text: input }];
		// Clear input
		setInput("");
		// Get AI response
		try {
			const response = await handleSendMessage(input);
			// Add AI response
			selectedNode.data.chatHistory = [...selectedNode.data.chatHistory, { sender: "gemini", text: response.text }];
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
						className={`message-item ${message.sender === "user" ? "user-message" : "gemini-message"}`}
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
						if (e.key === "Enter" && !loading) handleSend();
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

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
	const [loading, setLoading] = useState(selectedNode.data.processing || false);

	// Sync messages to selectedNode.data
	useEffect(() => {
		setMessages(selectedNode.data.chatHistory);
		setLoading(selectedNode.data.processing);
	}, [messages, selectedNode, selectedNode.data.chatHistory]);

	const handleSend = async () => {
		if (!input.trim() || loading) return; // Avoid empty inputs or duplicate sends
		selectedNode.data.processing = true;

		// Add user message to chat history
		selectedNode.data.chatHistory = [
			...selectedNode.data.chatHistory,
			{ sender: "user", text: input },
		];
		setMessages([...selectedNode.data.chatHistory]);

		// Clear input field
		setInput("");

		try {
			// Get AI response
			const response = await handleSendMessage(input);

			// Add AI response to chat history
			selectedNode.data.chatHistory = [
				...selectedNode.data.chatHistory,
				{ sender: "gemini", text: response.text || "No response" },
			];
			setMessages([...selectedNode.data.chatHistory]);
		} catch (error) {
			// Format the error message by introducing breaks on commas, periods, and slashes
			const formattedError = String(error.message).replace(/[,./]/g, (match) => `${match} `);

			// Add error message to chat history with isError flag
			selectedNode.data.chatHistory = [
				...selectedNode.data.chatHistory,
				{ sender: "gemini", text: formattedError, isError: true },
			];
			setMessages([...selectedNode.data.chatHistory]);
		} finally {
			// Mark processing as complete
			selectedNode.data.processing = false;
		}
	};


	return (
		<div className="chat-container">
			<div className="chat-window">
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
			</div>
		</div>
	);
};

export default ChatWindow;

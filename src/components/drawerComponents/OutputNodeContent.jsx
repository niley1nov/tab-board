import React from "react";
import ScrollableContent from "./ScrollableContent";
import ReactMarkdown from "react-markdown";

const OutputNodeContent = ({ selectedNode }) => {
	// Extract the first connected node's content from `selectedNode`
	const connectedNodes = selectedNode?.data?.adjacencyNodes || [];
	const connectedContent =
		connectedNodes.length > 0 ? connectedNodes[0]?.data?.content : null;

	return (
		<ScrollableContent>
			{connectedContent ? (
				<div className="output-content">
					<ReactMarkdown>{connectedContent}</ReactMarkdown>
				</div>
			) : (
				<div>No content available.</div>
			)}
		</ScrollableContent>
	);
};

export default OutputNodeContent;

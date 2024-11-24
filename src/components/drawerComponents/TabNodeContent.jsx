import React from "react";
import ScrollableContent from "./ScrollableContent";
import ReactMarkdown from "react-markdown";
import { useGraph } from "../../containers/GraphContext";

const TabNodeContent = () => {
	const graph = useGraph();

	return (
		<ScrollableContent>
			{graph.sidebarContent.additionalContent ? (
				<div className="tab-content">
					<ReactMarkdown>{graph.sidebarContent.additionalContent}</ReactMarkdown>
				</div>
			) : (
				<div>No content available.</div>
			)}
		</ScrollableContent>
	);
};

export default TabNodeContent;

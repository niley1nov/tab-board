import React from "react";
import ScrollableContent from "./ScrollableContent";
import ReactMarkdown from "react-markdown";

const TabNodeContent = ({ additionalContent }) => {
	return (
		<ScrollableContent>
			{additionalContent ? (
				<div className="tab-content">
					<ReactMarkdown>{additionalContent}</ReactMarkdown>
				</div>
			) : (
				<div>No content available.</div>
			)}
		</ScrollableContent>
	);
};

export default TabNodeContent;

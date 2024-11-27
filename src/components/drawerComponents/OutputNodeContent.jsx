import React from "react";
import ScrollableContent from "./ScrollableContent";
import ReactMarkdown from "react-markdown";
import { useGraph } from "../../containers/GraphContext";

const OutputNodeContent = () => {
	const graph = useGraph();

	// Extract the first connected node's content from `selectedNode`
	const connectedNodes = graph.selectedNode?.data?.adjacencyNodes || [];
	const connectedContent =
		connectedNodes.length > 0 ? connectedNodes[0]?.data?.content : null;

	return (
		<div className="tabnode-container">
			<ScrollableContent>
				{connectedContent ? (
					<div className="tab-content">
						<ReactMarkdown
							components={{
								// Headings
								h1: ({ children }) => <h1 style={{ color: "white" }}>{children}</h1>,
								h2: ({ children }) => <h2 style={{ color: "white" }}>{children}</h2>,
								h3: ({ children }) => <h3 style={{ color: "white" }}>{children}</h3>,
								h4: ({ children }) => <h4 style={{ color: "white" }}>{children}</h4>,
								h5: ({ children }) => <h5 style={{ color: "white" }}>{children}</h5>,
								h6: ({ children }) => <h6 style={{ color: "white" }}>{children}</h6>,

								// Paragraphs
								p: ({ children }) => <p style={{ color: "white" }}>{children}</p>,

								// Blockquotes
								blockquote: ({ children }) => (
								<blockquote style={{ color: "white", fontStyle: "italic" }}>
									{children}
								</blockquote>
								),

								// Lists
								ul: ({ children }) => <ul style={{ color: "white" }}>{children}</ul>,
								ol: ({ children }) => <ol style={{ color: "white" }}>{children}</ol>,
								li: ({ children }) => <li style={{ color: "white" }}>{children}</li>,

								// Code and preformatted text
								code: ({ children }) => (
								<code style={{ color: "white", background: "#333", padding: "2px 4px" }}>
									{children}
								</code>
								),
								pre: ({ children }) => (
								<pre style={{ color: "white", background: "#333", padding: "10px" }}>
									{children}
								</pre>
								),

								// Links
								a: ({ href, children }) => (
								<a href={href} style={{ color: "cyan", textDecoration: "underline" }}>
									{children}
								</a>
								),

								// Images
								img: ({ src, alt }) => (
								<img
									src={src}
									alt={alt}
									style={{ maxWidth: "100%", border: "1px solid white" }}
								/>
								),

								// Strong and emphasis
								strong: ({ children }) => <strong style={{ color: "white" }}>{children}</strong>,
								em: ({ children }) => <em style={{ color: "white" }}>{children}</em>,

								// Horizontal rules
								hr: () => <hr style={{ border: "1px solid white" }} />,

								// Tables
								table: ({ children }) => (
								<table style={{ color: "white", borderCollapse: "collapse", width: "100%" }}>
									{children}
								</table>
								),
								thead: ({ children }) => <thead style={{ background: "#444" }}>{children}</thead>,
								tbody: ({ children }) => <tbody>{children}</tbody>,
								tr: ({ children }) => <tr>{children}</tr>,
								th: ({ children }) => (
								<th style={{ border: "1px solid white", padding: "8px" }}>{children}</th>
								),
								td: ({ children }) => (
								<td style={{ border: "1px solid white", padding: "8px" }}>{children}</td>
								),
							}}
							>
							{connectedContent}
							</ReactMarkdown>
						</div>
				) : (
					<div>No content available.</div>
				)}
			</ScrollableContent>
		</div>
	);
};

export default OutputNodeContent;

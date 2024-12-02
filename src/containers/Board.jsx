import React, { useState, useEffect, useRef } from "react";
import { useGraph } from "./GraphContext";
import TabNode from "../components/boardComponents/TabNode";
import PromptNode from "../components/boardComponents/PromptNode";
import OutputNode from "../components/boardComponents/OutputNode";
import ChatNode from "../components/boardComponents/ChatNode";
import SummaryNode from "../components/boardComponents/SummaryNode";
import NavBar from "../components/boardComponents/NavBar";
import Edge from "../components/boardComponents/Edge";
import NodeMenu from "../components/boardComponents/NodeMenu";
import EditDialog from "../components/boardComponents/EditDialog";
import {
	ReactFlow,
	Background,
	BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "../stylesheets/Board.css";

const rfStyle = { backgroundColor: "#F1E9FF", flexGrow: 1 };
const defaultViewport = { x: 0, y: 0, zoom: 1 };

const Board = () => {
	const graph = useGraph();
	console.log("Current nodes in ReactFlow:", graph.nodes);
	const nodeTypes = {
		TabNode: TabNode,
		PromptNode: PromptNode,
		OutputNode: OutputNode,
		ChatNode: ChatNode,
		SummaryNode: SummaryNode,
	};
	const edgeTypes = { Edge: Edge };

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const xPosRef = useRef(100);
	const yPosRef = useRef(100);

	const openEditDialog = () => {
		setNewTitle(graph.selectedNode?.data?.label || "");
		setEditDialogOpen(true);
		graph.closeMenu();
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
	};

	const handleTitleChange = () => {
		graph.setNodes((nds) =>
			nds.map((node) => {
				if (node.id === graph.selectedNode.id) {
					const newLabel = newTitle || "Untitled";
					return { ...node, data: { ...node.data, label: newLabel } };
				}
				return node;
			})
		);
		closeEditDialog();
	};	

	useEffect(() => {
		const handleTabData = (request) => {
			const { action, tabData } = request;
	
			// Validate tabData before proceeding
			if (!tabData || !tabData.content || !tabData.content.tabId) {
				console.error("Invalid tabData received:", tabData);
				return;
			}
	
			switch (action) {
				case "sendTabData":
					const newNode = graph.createTabNode(
						xPosRef.current,
						yPosRef.current,
						tabData
					);
					graph.setNodes((prevNodes) => [...prevNodes, newNode]);
					yPosRef.current += 250;
					break;
	
				case "removeTabNode":
					graph.setNodes((prevNodes) =>
						prevNodes.filter((node) => node.id !== tabData.content.tabId.toString())
					);
					break;
	
				case "updateTabData":
					graph.setNodes((prevNodes) =>
						prevNodes.map((node) =>
							node.id === tabData.content.tabId.toString()
								? {
									  ...node,
									  data: {
										  ...node.data,
										  label: tabData.content.title || "Updated Tab",
										  content: tabData.content.url || "",
									  },
								  }
								: node
						)
					);
					break;
	
				default:
					console.warn("Unknown action:", action);
			}
		};
	
		window.chrome.runtime.onMessage.addListener(handleTabData);
	
		return () => {
			window.chrome.runtime.onMessage.removeListener(handleTabData);
		};
	}, []);	

	return (
		<div className="board-container">
			<NavBar />
			<div className="board-main">
				<ReactFlow
					nodes={graph.nodes}
					edges={graph.edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={graph.onNodesChange}
					onEdgesChange={graph.handleEdgeChange}
					onConnect={(params) =>
						graph.setEdges((eds) => graph.addEdge(params, eds))
					}
					defaultViewport={defaultViewport}
					style={rfStyle}
				>
					<Background variant={BackgroundVariant.Dots} />
				</ReactFlow>
			</div>
			<NodeMenu
				onEdit={openEditDialog}
			/>
			<EditDialog
				open={editDialogOpen}
				onClose={closeEditDialog}
				title={newTitle}
				onTitleChange={setNewTitle}
				onSave={handleTitleChange}
			/>
		</div>
	);
};

export default Board;
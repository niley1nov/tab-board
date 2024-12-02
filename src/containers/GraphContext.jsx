import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import {
	useNodesState,
	useEdgesState,
} from "@xyflow/react";

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
	const xCustPosRef = useRef(700);
	const yCustPosRef = useRef(100);
	const xOutPosRef = useRef(1300);
	const yOutPosRef = useRef(100);
	const adjacencyList = useRef({});
	const [sidebarContent, setSidebarContent] = useState({
		id: "",
		title: "Dynamic Sidebar",
		nodeType: "",
		additionalContent: ""
	});
	const [selectedNode, setSelectedNode] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = (event, node) => {
		setAnchorEl(event.currentTarget);
		setSelectedNode(node);
	};
	function generateRandomID(length = 8) {
		return Math.random().toString(36).substr(2, length);
	}

	const addNodeToAdjacencyList = (nodeId) => {
		if (!adjacencyList.current[nodeId]) {
			adjacencyList.current[nodeId] = { left: [], right: [] };
		}
	};

	// Modify createNode to include adjacencyNodes
	const createNode = (id, type, position, data) => {
		const node = {
			id,
			type,
			position,
			data: {
				id: id,
				onOpenMenu: (e) => openMenu(e, node),
				deleteNode: (e) => handleDeleteNode(e, node),
				onClick: () => handleSetSelectedNode(node),
				adjacencyNodes: [], // Store the full node data here
				...data,
			},
		};
		return node;
	};

	const createTabNode = (x, y, request) => {
		const content = request?.content; // Safely access content
		if (!content || !content.tabId) {
			console.error("Invalid tab data:", request);
			return null; // Or handle this case appropriately
		}
		const id = content.tabId.toString();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"TabNode",
			{ x, y },
			{
				label: content.title || "Untitled Tab",
				content: content.content || "",
			},
		);
	};
	

	const createSumamryNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"SummaryNode",
			{ x, y },
			{
				label: "Summarization Node",
				content: "",
				prompt: "",
				context: "",
				processing: false,
				session: null,
				ready: false,
				adjacentNodeInputs: {},
				model: 'Gemini Pro',
				service: null,
				loading: false,
			},
		);
	};

	const createPromptNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"PromptNode",
			{ x, y },
			{
				label: "Prompt Node",
				content: "",
				prompt: "",
				context: "",
				processing: false,
				session: null,
				ready: false,
				adjacentNodeInputs: {},
				model: 'Gemini Pro',
				service: null,
				loading: false,
			},
		);
	};

	const createChatNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"ChatNode",
			{ x, y },
			{
				label: "Chat Node",
				content: "",
				prompt: "",
				context: "",
				chatHistory: [],
				processing: false,
				session: null,
				ready: false,
				adjacentNodeInputs: {},
				model: 'Gemini Pro',
				service: null,
				loading: false,
			},
		);
	};

	const createOutputNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"OutputNode",
			{ x, y },
			{
				label: "Output Node",
				content: "",
			},
		);
	};

	// Nodes state
	const [nodes, setNodes, onNodesChange] = useNodesState(() => {
		const initialNode = createOutputNode(xOutPosRef.current,
			yOutPosRef.current);
		yOutPosRef.current += 250;
		addNodeToAdjacencyList(initialNode.id);
		return [initialNode];
	});
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const handleSetSelectedNode = (node) => {
		console.log("SELECTED NODE: ", node);
		console.log("Adjacent Node Data: ", adjacencyList.current[node.id]);

		setSidebarContent((prevContent) => ({
			...prevContent,
			nodeId: node.id,
			title: node.data.label,
			nodeType: node.type,
			additionalContent: node.data.content,
			adjacencyNodes: node.data.adjacencyNodes,
		}));
		setSelectedNode(node);
	};

	const closeMenu = () => {
		setAnchorEl(null);
	};


	const handleDeleteNode = (e, node) => {
		const nodeId = node.id;
	
		// Remove the node from adjacencyList
		const neighbors = adjacencyList.current[nodeId];
		if (neighbors) {
			neighbors.left.forEach((neighbor) => {
				adjacencyList.current[neighbor].right = adjacencyList.current[
					neighbor
				].right.filter((id) => id !== nodeId);
			});
			neighbors.right.forEach((neighbor) => {
				adjacencyList.current[neighbor].left = adjacencyList.current[
					neighbor
				].left.filter((id) => id !== nodeId);
			});
			delete adjacencyList.current[nodeId];
		}
	
		// Update nodes state
		setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
		closeMenu();
	};
	

	const updateAdjacencyList = (source, target, action) => {
		if (action === "add") {
			if (!adjacencyList.current[source])
				adjacencyList.current[source] = { left: [], right: [] };
			if (!adjacencyList.current[target])
				adjacencyList.current[target] = { left: [], right: [] };
	
			adjacencyList.current[source].right.push(target);
			adjacencyList.current[target].left.push(source);
		} else if (action === "remove") {
			if (adjacencyList.current[source]) {
				adjacencyList.current[source].right =
					adjacencyList.current[source].right.filter((id) => id !== target);
			}
			if (adjacencyList.current[target]) {
				adjacencyList.current[target].left =
					adjacencyList.current[target].left.filter((id) => id !== source);
			}
		}
	};
	

	const handleAddNode = (option) => {
		let newNode;
		if (option === "prompt") {
			newNode = createPromptNode(
				xCustPosRef.current,
				yCustPosRef.current,
			);
			yCustPosRef.current += 250;
		} else if (option === "chat") {
			newNode = createChatNode(
				xCustPosRef.current,
				yCustPosRef.current,
			);
			yCustPosRef.current += 250;
		} else if (option === "summary") {
			newNode = createSumamryNode(
				xCustPosRef.current,
				yCustPosRef.current,
			);
			yCustPosRef.current += 250;
		} else if (option === "output") {
			newNode = createOutputNode(
				xOutPosRef.current,
				yOutPosRef.current,
			);
			yOutPosRef.current += 250
		}

		if (!!newNode) {
			setNodes((prevNodes) => [...prevNodes, newNode]);
		}
	};

	const addEdge = (params, eds) => {
		const targetNode = getNode(params.target);
		if (targetNode?.type === "OutputNode" || targetNode?.type === "SummaryNode") {
			const connectedEdges = eds.filter((edge) => edge.target === params.target);
			if (connectedEdges.length >= 1) {
				console.warn("OutputNode can only have one edge connected.");
				return eds;
			}
		}
		const newEdge = {
			id: `e${params.source}-${params.target}`,
			source: params.source,
			target: params.target,
			type: "Edge",
			style: { stroke: "#ff0000" },
			...params,
		};
		updateAdjacencyList(params.source, params.target, "add");
		return [...eds, newEdge];
	};

	const handleEdgeChange = (updatedEdges) => {
		if (updatedEdges[0].type === "remove") {
			const edge = getEdge(updatedEdges[0].id);
			updateAdjacencyList(edge.source, edge.target, "remove");
		}
		onEdgesChange(updatedEdges);
	};

	// Utility functions for managing graph
	const getNode = (id) => nodes.find((node) => node.id === id) || null;
	const getEdge = (id) => edges.find((edge) => edge.id === id) || null;

	return (
		<GraphContext.Provider
			value={{
				adjacencyList: adjacencyList.current,
				sidebarContent,
				setSidebarContent,
				selectedNode,
				setSelectedNode,
				anchorEl,
				setAnchorEl,
				openMenu,
				generateRandomID,
				addNodeToAdjacencyList,
				createNode,
				createTabNode,
				createPromptNode,
				createSumamryNode,
				createChatNode,
				createOutputNode,
				nodes,
				setNodes,
				onNodesChange,
				edges,
				setEdges,
				onEdgesChange,
				handleSetSelectedNode,
				closeMenu,
				handleDeleteNode,
				updateAdjacencyList,
				handleAddNode,
				addEdge,
				handleEdgeChange,
				getNode,
				getEdge
			}}
		>
			{children}
		</GraphContext.Provider>
	);
};

// Custom hook for using GraphContext
export const useGraph = () => useContext(GraphContext);

import React, { createContext, useContext, useState, useRef } from "react";
import {
	useNodesState,
	useEdgesState,
} from "@xyflow/react";

const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
	const xCustPosRef = useRef(700);
	const yCustPosRef = useRef(100);
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
		const id = request.content.tabId.toString();
		addNodeToAdjacencyList(id);
		return createNode(
			id,
			"TabNode",
			{ x, y },
			{
				label: request.content.title,
				content: request.content.content,
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
				prompt: ""
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
		const initialNode = createOutputNode(1300, 100);
		addNodeToAdjacencyList(initialNode.id);
		return [initialNode];
	});
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const handleSetSelectedNode = (node) => {
		console.log("SELECTED NODE: ", node);
		console.log("Adjacent Node Data: ", node.data.adjacencyNodes);

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
		setSelectedNode(node);
		const nodeId = node.id;
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

		setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
		closeMenu();
	};

	const updateAdjacencyList = (source, target, action) => {
		if (action === "add") {
			if (!adjacencyList.current[source])
				adjacencyList.current[source] = { left: [], right: [] };
			if (!adjacencyList.current[target])
				adjacencyList.current[target] = { left: [], right: [] };

			// Update the adjacency list to include node data
			adjacencyList.current[source].right.push(target);
			adjacencyList.current[target].left.push(source);

			// Fetch the full node data and store in adjacencyNodes array
			const sourceNode = getNode(source);
			const targetNode = getNode(target);
			if (sourceNode && targetNode) {
				sourceNode.data.adjacencyNodes.push(targetNode); // Store the full node object
				targetNode.data.adjacencyNodes.push(sourceNode); // Store the full node object
			}
		} else if (action === "remove") {
			// Remove the target from source's adjacencyNodes and vice versa
			adjacencyList.current[source].right = adjacencyList.current[
				source
			].right.filter((id) => id !== target);
			adjacencyList.current[target].left = adjacencyList.current[
				target
			].left.filter((id) => id !== source);

			// Update adjacencyNodes array on each node after edge removal
			const sourceNode = getNode(source);
			const targetNode = getNode(target);
			if (sourceNode && targetNode) {
				sourceNode.data.adjacencyNodes =
					sourceNode.data.adjacencyNodes.filter(
						(node) => node.id !== target,
					);
				targetNode.data.adjacencyNodes =
					targetNode.data.adjacencyNodes.filter(
						(node) => node.id !== source,
					);
			}

			// Update sidebar content to reflect the removal
			if (selectedNode) {
				handleSetSelectedNode(selectedNode); // Call this to refresh sidebar content
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
		} else if(option === "chat") {
			newNode = createChatNode(
				xCustPosRef.current,
				yCustPosRef.current,
			);
		}

		if(!!newNode) {
			setNodes((prevNodes) => [...prevNodes, newNode]);
			yCustPosRef.current += 250;
		}
	};

	const addEdge = (params, eds) => {
		const targetNode = getNode(params.target);
		if (targetNode?.type === "OutputNode") {
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

	const handleEdgeChange = (edges) => {
		const edge = getEdge(edges[0].id);
		updateAdjacencyList(edge.source, edge.target, "remove");
		onEdgesChange(edges);
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

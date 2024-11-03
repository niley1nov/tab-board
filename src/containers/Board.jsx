import React, { useState, useEffect, useRef } from 'react';
import TabNode from '../components/TabNode';
import PromptNode from '../components/PromptNode';
import OutputNode from '../components/OutputNode';
import NavBar from '../components/NavBar';
import {
	ReactFlow,
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	//addEdge,
	BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Edge from '../components/Edge';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const rfStyle = {
	backgroundColor: '#B8CEFF',
};

const Board = () => {
	const nodeTypes = { TabNode: TabNode, PromptNode: PromptNode, OutputNode: OutputNode };
	const edgeTypes = {
		Edge: Edge,
	};

	const adjacencyList = useRef({}); // Initialize adjacency list

	const addNodeToAdjacencyList = (nodeId) => {
		if (!adjacencyList.current[nodeId]) {
			adjacencyList.current[nodeId] = { left: [], right: [] };
		}
		console.log(adjacencyList);
	};

	const createOutputNode = (x, y) => {
		const tabId = generateRandomID();
		const node = {
			id: tabId,
			type: 'OutputNode',
			position: { x: x, y: y },
			data: {
				label: 'Output Node',
				onOpenMenu: (e) => openMenu(e, node),
			},
		};
		return node;
	};

	const initialNode = createOutputNode(1300, 100);
	// Lazy initialization of initial nodes
	const [nodes, setNodes, onNodesChange] = useNodesState(() => {
		const initialNode = createOutputNode(1300, 100);
		addNodeToAdjacencyList(initialNode.id); // Add to adjacency list
		return [initialNode];
	});
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const xPosRef = useRef(100);
	const yPosRef = useRef(100);
	const xCustPosRef = useRef(700);
	const yCustPosRef = useRef(100);



	// Helper to update adjacency list when an edge is added
	const updateAdjacencyList = (source, target, action) => {
		if (action === 'add') {
			if (!adjacencyList.current[source]) adjacencyList.current[source] = { left: [], right: [] };
			if (!adjacencyList.current[target]) adjacencyList.current[target] = { left: [], right: [] };
			
			// Assuming left is source -> target and right is target -> source
			adjacencyList.current[source].right.push(target);
			adjacencyList.current[target].left.push(source);
		} else if (action === 'remove') {
			adjacencyList.current[source].right = adjacencyList.current[source].right.filter((id) => id !== target);
			adjacencyList.current[target].left = adjacencyList.current[target].left.filter((id) => id !== source);
		}
		console.log(adjacencyList);
	};

	const addEdge = (params, eds) => {
		// Customize edge creation logic here
		const newEdge = {
			id: `e${params.source}-${params.target}`,
			source: params.source,
			target: params.target,
			type: 'Edge',
			style: { stroke: '#ff0000' }, // Custom styling
			...params,
		};

		updateAdjacencyList(params.source, params.target, 'add'); // Update adjacency list
		return [...eds, newEdge];
	};

	const openMenu = (event, node) => {
		setAnchorEl(event.currentTarget);
		setSelectedNode(node);
	};

	const handleAddNode = () => {
		const newNode = createPromptNode(xCustPosRef.current, yCustPosRef.current);
		setNodes((prevNodes) => [...prevNodes, newNode]);
		// Update positions for next node
		yCustPosRef.current += 250;  // Increment x position for the next node
	};

	const closeMenu = () => {
		setAnchorEl(null);
		//setSelectedNode(null); // Reset the selected node
	};

	const openEditDialog = () => {
		setNewTitle(selectedNode?.data?.label || '');
		setEditDialogOpen(true);
		closeMenu();
	};

	const closeEditDialog = () => {
		setEditDialogOpen(false);
	};

	const handleTitleChange = () => {
		setNodes((nds) =>
			nds.map((node) =>
				node.id === selectedNode.id ? { ...node, data: { ...node.data, label: newTitle } } : node
			)
		);
		closeEditDialog();
	};

	const handleDeleteNode = () => {
		// Remove node from adjacency list and update neighbors
		const nodeId = selectedNode.id;
		const neighbors = adjacencyList.current[nodeId];

		if (neighbors) {
			neighbors.left.forEach((neighbor) => {
				adjacencyList.current[neighbor].right = adjacencyList.current[neighbor].right.filter((id) => id !== nodeId);
			});
			neighbors.right.forEach((neighbor) => {
				adjacencyList.current[neighbor].left = adjacencyList.current[neighbor].left.filter((id) => id !== nodeId);
			});
			delete adjacencyList.current[nodeId]; // Remove the node itself
		}

		setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
		closeMenu();
	};

	function generateRandomID(length = 8) {
		return Math.random().toString(36).substr(2, length);
	}

	// Helper function to create a node
	const createNode = (x, y, request) => {
		const tabId = request.content.tabId.toString();
		const node = {
			id: tabId,
			position: { x: x, y: y },
			data: {
				label: request.content.title,
				onOpenMenu: (e) => openMenu(e, node)
			},
			type: 'TabNode',
		};
		addNodeToAdjacencyList(tabId); // Add node to adjacency list on creation
		return node;
	};

	const createPromptNode = (x, y) => {
		const tabId = generateRandomID();
		const node = {
			id: tabId,
			position: { x: x, y: y },
			data: {
				label: 'Custom Node',
				onOpenMenu: (e) => openMenu(e, node)
			},
			type: 'PromptNode',
		};
		addNodeToAdjacencyList(tabId); // Add node to adjacency list on creation
		return node;
	};

	// Use effect to initialize the canvas and SVG
	useEffect(() => {
		// Message handler function
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				// Create a new node at dynamic positions
				const newNode = createNode(xPosRef.current, yPosRef.current, request.tabData);
				setNodes((prevNodes) => [...prevNodes, newNode]);
				// Update positions for next node
				yPosRef.current += 250;  // Increment x position for the next node
			}
		};

		// Attach the listener
		window.chrome.runtime.onMessage.addListener(handleTabData);

		// Cleanup function to remove the listener when the component unmounts or effect re-runs
		return () => {
			window.chrome.runtime.onMessage.removeListener(handleTabData);
		};
	}, []);  // Dependency array ensures that the effect runs when tabsList changes

	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<NavBar onAddNode={handleAddNode} />
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
				style={rfStyle}
			>
				<Controls />
				<MiniMap />
				<Background variant={BackgroundVariant.Dots} />
			</ReactFlow>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
				<MenuItem onClick={openEditDialog}>Edit</MenuItem>
				{selectedNode?.type === 'PromptNode' && ( // Condition for showing "Delete"
					<MenuItem onClick={handleDeleteNode}>Delete</MenuItem>
				)}
			</Menu>
			<Dialog open={editDialogOpen} onClose={closeEditDialog}>
				<DialogTitle>Edit Node Title</DialogTitle>
				<DialogContent>
					<TextField value={newTitle} onChange={(e) => setNewTitle(e.target.value)} fullWidth />
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button onClick={handleTitleChange}>Save</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default Board;

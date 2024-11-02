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

	const createOutputNode = (x, y) => {
		const tabId = generateRandomID();
		const node = {
			id: tabId,
			type: 'OutputNode',
			position: { x: x, y: y },
			data: {
				label: 'Output Node',
				onOpenMenu: (e) => openMenu(e, node), // Pass the entire node
			},
		};
		return node;
	};

	const initialNodes = [
		createOutputNode(1300, 100)
	]

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNode, setSelectedNode] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const xPosRef = useRef(100);
	const yPosRef = useRef(100);
	const xCustPosRef = useRef(700);
	const yCustPosRef = useRef(100);

	const addEdge = (params, eds) => {
		console.log("Adding custom edge:", params);
		// Customize edge creation logic here
		const newEdge = {
			id: `e${params.source}-${params.target}`,
			source: params.source,
			target: params.target,
			type: 'Edge',
			style: { stroke: '#ff0000' }, // Custom styling
			...params,
		};
		return [...eds, newEdge];
	};

	const openMenu = (event, node) => {
		setAnchorEl(event.currentTarget);
		setSelectedNode(node);
	};

	const handleAddNode = () => {
		console.log('Button click received in parent');
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
		setNodes((nodes) => nodes.filter((node) => node.id != selectedNode.id));
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
		return node;
	};

	// Use effect to initialize the canvas and SVG
	useEffect(() => {
		// Message handler function
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				// Create a new node at dynamic positions
				console.log(request);
				console.log('-------------------------------');
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

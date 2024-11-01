import React, { useState, useEffect, useRef } from 'react';
import TabNode from '../components/TabNode';
import PromptNode from '../components/PromptNode';
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

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const SPACING = 150;
const TOP_SPACING = 100;

const rfStyle = {
	backgroundColor: '#B8CEFF',
};

const Board = () => {
	const nodeTypes = { TabNode: TabNode, PromptNode: PromptNode };
	const edgeTypes = {
		Edge: Edge,
	};

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNodeId, setSelectedNodeId] = useState(null);
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

	const openMenu = (event, nodeId) => {
		setAnchorEl(event.currentTarget);
		setSelectedNodeId(nodeId);
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
	};

	const openEditDialog = () => {
		const selectedNode = nodes.find((node) => node.id === selectedNodeId);
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
				node.id === selectedNodeId ? { ...node, data: { ...node.data, label: newTitle } } : node
			)
		);
		closeEditDialog();
	};

	const handleRemoveConnections = () => {
		setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
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
			data: { label: request.content.title, onOpenMenu: (e) => openMenu(e, tabId) },
			type: 'TabNode',
		};
		return node;
	};

	const createPromptNode = (x, y) => {
		const tabId = generateRandomID();
		const node = {
			id: tabId,
			position: { x: x, y: y },
			data: { label: 'Custom Node', onOpenMenu: (e) => openMenu(e, tabId) },
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
				<MenuItem onClick={openEditDialog}>Edit Title</MenuItem>
				<MenuItem onClick={handleRemoveConnections}>Remove Connections</MenuItem>
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

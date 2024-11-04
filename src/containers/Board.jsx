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
	BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Edge from '../components/Edge';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const NODE_WIDTH = 200;       // Node width for spacing calculations
const NODE_HEIGHT = 100;      // Node height for row adjustments
const HORIZONTAL_SPACING = 50;  // Horizontal spacing between nodes
const VERTICAL_SPACING = 150;   // Vertical spacing for new rows

const rfStyle = {
	backgroundColor: '#B8CEFF',
};

const Board = () => {
	const nodeTypes = { TabNode: TabNode, PromptNode: PromptNode };
	const edgeTypes = { Edge: Edge };

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNodeId, setSelectedNodeId] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const xPosRef = useRef(100);  // Initial x position
	const yPosRef = useRef(100);  // Initial y position
	const containerWidth = window.innerWidth;  // Dynamic screen width

	const addEdge = (params, eds) => {
		console.log("Adding custom edge:", params);
		const newEdge = {
			id: `e${params.source}-${params.target}`,
			source: params.source,
			target: params.target,
			type: 'Edge',
			style: { stroke: '#ff0000' },
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
		const newNode = createPromptNode(xPosRef.current, yPosRef.current);
		setNodes((prevNodes) => [...prevNodes, newNode]);
		adjustPositionForNextNode();
	};

	const closeMenu = () => setAnchorEl(null);

	const openEditDialog = () => {
		const selectedNode = nodes.find((node) => node.id === selectedNodeId);
		setNewTitle(selectedNode?.data?.label || '');
		setEditDialogOpen(true);
		closeMenu();
	};

	const closeEditDialog = () => setEditDialogOpen(false);

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

	const generateRandomID = (length = 8) => Math.random().toString(36).substr(2, length);

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

	const adjustPositionForNextNode = () => {
		// Calculate next position based on container width and node spacing
		xPosRef.current += NODE_WIDTH + HORIZONTAL_SPACING;
		if (xPosRef.current + NODE_WIDTH > containerWidth) {
			// If it exceeds screen width, reset x and move to next row
			xPosRef.current = 100;  // Reset to starting x position
			yPosRef.current += NODE_HEIGHT + VERTICAL_SPACING;
		}
	};

	useEffect(() => {
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				console.log(request);
				const newNode = createNode(xPosRef.current, yPosRef.current, request.tabData);
				setNodes((prevNodes) => [...prevNodes, newNode]);
				adjustPositionForNextNode();
			}
		};

		window.chrome.runtime.onMessage.addListener(handleTabData);

		return () => {
			window.chrome.runtime.onMessage.removeListener(handleTabData);
		};
	}, []);

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

import React, { useState, useEffect, useRef } from 'react';
import TabNode from '../components/TabNode';
import PromptNode from '../components/PromptNode';
import OutputNode from '../components/OutputNode';
import Sidebar from '../components/Sidebar';
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

const rfStyle = {
	backgroundColor: '#B8CEFF', flexGrow: 1
};
const defaultViewport = { x: 0, y: 0, zoom: 1 };

const Board = () => {
	const nodeTypes = { TabNode: TabNode, PromptNode: PromptNode, OutputNode: OutputNode };
	const edgeTypes = {
		Edge: Edge,
	};

	const adjacencyList = useRef({});

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
	const [nodes, setNodes, onNodesChange] = useNodesState(() => {
		const initialNode = createOutputNode(1300, 100);
		addNodeToAdjacencyList(initialNode.id);
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

	const updateAdjacencyList = (source, target, action) => {
		if (action === 'add') {
			if (!adjacencyList.current[source]) adjacencyList.current[source] = { left: [], right: [] };
			if (!adjacencyList.current[target]) adjacencyList.current[target] = { left: [], right: [] };

			adjacencyList.current[source].right.push(target);
			adjacencyList.current[target].left.push(source);
		} else if (action === 'remove') {
			adjacencyList.current[source].right = adjacencyList.current[source].right.filter((id) => id !== target);
			adjacencyList.current[target].left = adjacencyList.current[target].left.filter((id) => id !== source);
		}
		console.log(adjacencyList);
	};

	const addEdge = (params, eds) => {
		const newEdge = {
			id: `e${params.source}-${params.target}`,
			source: params.source,
			target: params.target,
			type: 'Edge',
			style: { stroke: '#ff0000' },
			...params,
		};

		updateAdjacencyList(params.source, params.target, 'add');
		return [...eds, newEdge];
	};

	const openMenu = (event, node) => {
		setAnchorEl(event.currentTarget);
		setSelectedNode(node);
	};

	const handleAddNode = () => {
		const newNode = createPromptNode(xCustPosRef.current, yCustPosRef.current);
		setNodes((prevNodes) => [...prevNodes, newNode]);
		yCustPosRef.current += 250;
	};

	const closeMenu = () => {
		setAnchorEl(null);
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
		const nodeId = selectedNode.id;
		const neighbors = adjacencyList.current[nodeId];

		if (neighbors) {
			neighbors.left.forEach((neighbor) => {
				adjacencyList.current[neighbor].right = adjacencyList.current[neighbor].right.filter((id) => id !== nodeId);
			});
			neighbors.right.forEach((neighbor) => {
				adjacencyList.current[neighbor].left = adjacencyList.current[neighbor].left.filter((id) => id !== nodeId);
			});
			delete adjacencyList.current[nodeId];
		}

		setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
		closeMenu();
	};

	function generateRandomID(length = 8) {
		return Math.random().toString(36).substr(2, length);
	}

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
		addNodeToAdjacencyList(tabId)
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
		addNodeToAdjacencyList(tabId);
		return node;
	};

	useEffect(() => {
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				const newNode = createNode(xPosRef.current, yPosRef.current, request.tabData);
				setNodes((prevNodes) => [...prevNodes, newNode]);
				yPosRef.current += 250;
			}
		};

		window.chrome.runtime.onMessage.addListener(handleTabData);

		return () => {
			window.chrome.runtime.onMessage.removeListener(handleTabData);
		};
	}, []);

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
			<NavBar onAddNode={handleAddNode} />
			<div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
					defaultViewport={defaultViewport}
					style={rfStyle}
				>
					<Controls />
					<Background variant={BackgroundVariant.Dots} />
				</ReactFlow>
				<Sidebar />
			</div>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
				<MenuItem onClick={openEditDialog}>Edit</MenuItem>
				{selectedNode?.type === 'PromptNode' && (
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

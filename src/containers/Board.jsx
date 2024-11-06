import React, { useState, useEffect, useRef } from 'react';
import TabNode from '../components/TabNode';
import PromptNode from '../components/PromptNode';
import OutputNode from '../components/OutputNode';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import Edge from '../components/Edge';
import {
	ReactFlow,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../stylesheets/Board.css';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const rfStyle = { backgroundColor: '#B8CEFF', flexGrow: 1 };
const defaultViewport = { x: 0, y: 0, zoom: 1 };

const Board = () => {
	const nodeTypes = { TabNode: TabNode, PromptNode: PromptNode, OutputNode: OutputNode };
	const edgeTypes = { Edge: Edge };
	const adjacencyList = useRef({});

	const addNodeToAdjacencyList = (nodeId) => {
		if (!adjacencyList.current[nodeId]) {
			adjacencyList.current[nodeId] = { left: [], right: [] };
		}
	};

	const createNode = (id, type, position, data) => {
		const node = {
			id,
			type,
			position,
			data: {
				onOpenMenu: (e) => openMenu(e, node),
				onClick: () => handleSetSelectedNode(node),
				left: [],
				right: [],
				...data,
			}
		};
		return node;
	}

	const createTabNode = (x, y, request) => {
		const id = request.content.tabId.toString();
		addNodeToAdjacencyList(id);
		return createNode(id, 'TabNode', { x, y }, {
			label: request.content.title,
			content: request.content.content,
		});
	};

	const createPromptNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(id, 'PromptNode', { x, y }, {
			label: 'Prompt Node',
			content: '',
		});
	};

	const createOutputNode = (x, y) => {
		const id = generateRandomID();
		addNodeToAdjacencyList(id);
		return createNode(id, 'OutputNode', { x, y }, {
			label: 'Output Node',
			content: '',
		});
	};

	const [sidebarContent, setSidebarContent] = useState({
		title: "Dynamic Sidebar Title",
		description: "This description is passed as a prop to the Sidebar component.",
		nodeType: "",
		additionalContent: ""
	});

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

	const getNode = (id) => {
		const node = nodes.find((node) => node.id === id);
		return node || null;
	};

	const getNodesByIds = (nodeIds) => {
		return nodes.filter((node) => nodeIds.includes(node.id));
	};


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
	};

	const openMenu = (event, node) => {
		setAnchorEl(event.currentTarget);
		setSelectedNode(node);
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

	function generateRandomID(length = 8) {
		return Math.random().toString(36).substr(2, length);
	}

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

	const handleAddNode = () => {
		const newNode = createPromptNode(xCustPosRef.current, yCustPosRef.current);
		setNodes((prevNodes) => [...prevNodes, newNode]);
		yCustPosRef.current += 250;
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
		getNode(newEdge.source).data.right = getNodesByIds(adjacencyList.current[newEdge.source].right);
		getNode(newEdge.target).data.left = getNodesByIds(adjacencyList.current[newEdge.target].left);
		return [...eds, newEdge];
	};

	const handleEdgeChange = (edge) => {
		onEdgesChange(edge);
		getNode(edge.source).data.right = getNodesByIds(adjacencyList.current[edge.source].right);
		getNode(edge.target).data.left = getNodesByIds(adjacencyList.current[edge.target].left);
	};

	const handleSetSelectedNode = (node) => {
		setSidebarContent((prevContent) => ({
			...prevContent,
			title: node.data.label,
			nodeType: node.type,
			additionalContent: node.data.content
		}));
		setSelectedNode(node);
		console.log(node);
	};

	useEffect(() => {
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				const newNode = createTabNode(xPosRef.current, yPosRef.current, request.tabData);
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
		<div className="board-container">
			<NavBar onAddNode={handleAddNode} />
			<div className="board-main">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={handleEdgeChange}
					onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
					defaultViewport={defaultViewport}
					style={rfStyle}
				>
					<Controls />
					<Background variant={BackgroundVariant.Dots} />
				</ReactFlow>
				<Sidebar content={sidebarContent} />
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

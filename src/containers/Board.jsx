import React, { useState, useEffect, useRef } from 'react';
import TabNode from '../components/boardComponents/TabNode';
import PromptNode from '../components/boardComponents/PromptNode';
import OutputNode from '../components/boardComponents/OutputNode';
import NavBar from '../components/boardComponents/NavBar';
import Edge from '../components/boardComponents/Edge';
import NodeMenu from '../components/boardComponents/NodeMenu';
import EditDialog from '../components/boardComponents/EditDialog';
import {
	ReactFlow,
	Background,
	useNodesState,
	useEdgesState,
	BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../stylesheets/Board.css';

const rfStyle = { backgroundColor: '#F1E9FF', flexGrow: 1 };
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

	// Modify createNode to include adjacencyNodes
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
				adjacencyNodes: [], // Store the full node data here
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
		id: "",
		title: "Dynamic Sidebar",
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

	const getEdge = (id) => {
		const edge = edges.find((edge) => edge.id == id);
		return edge || null;
	}

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
		} else if (action === 'remove') {
			// Remove the target from source's adjacencyNodes and vice versa
			adjacencyList.current[source].right = adjacencyList.current[source].right.filter((id) => id !== target);
			adjacencyList.current[target].left = adjacencyList.current[target].left.filter((id) => id !== source);
	
			// Update adjacencyNodes array on each node after edge removal
			const sourceNode = getNode(source);
			const targetNode = getNode(target);
			if (sourceNode && targetNode) {
				sourceNode.data.adjacencyNodes = sourceNode.data.adjacencyNodes.filter((node) => node.id !== target);
				targetNode.data.adjacencyNodes = targetNode.data.adjacencyNodes.filter((node) => node.id !== source);
			}
	
			// Update sidebar content to reflect the removal
			if (selectedNode) {
				handleSetSelectedNode(selectedNode);  // Call this to refresh sidebar content
			}
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
		return [...eds, newEdge];
	};

	const handleEdgeChange = (edges) => {
		const edge = getEdge(edges[0].id);
		updateAdjacencyList(edge.source, edge.target, 'remove');
		onEdgesChange(edges);
	};

	const handleSetSelectedNode = (node) => {
		console.log("SELECTED NODE: ", node);
		console.log("Adjacent Node Data: ", node.data.adjacencyNodes); // Logs full data of adjacent nodes
		setSidebarContent((prevContent) => ({
			...prevContent,
			nodeId: node.id,
			title: node.data.label,
			nodeType: node.type,
			additionalContent: node.data.content,
			adjacencyNodes: node.data.adjacencyNodes
		}));
		setSelectedNode(node);
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
			<NavBar 
				onAddNode={handleAddNode}
				content={sidebarContent}
			/>
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
					<Background variant={BackgroundVariant.Dots} />
				</ReactFlow>
			</div>
			<NodeMenu
				anchorEl={anchorEl}
				onClose={closeMenu}
				onEdit={openEditDialog}
				onDelete={handleDeleteNode}
				nodeType={selectedNode?.type}
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
}

export default Board;

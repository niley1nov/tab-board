import React, { useState, useEffect } from 'react';
import CustomNode from '../components/CustomNode';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const NODE_WIDTH = 200; 
const NODE_HEIGHT = 100; 
const SPACING = 150; 
const TOP_SPACING = 100; 

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const Board = () => {
  const nodeTypes = { customNode: CustomNode };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const openMenu = (event, nodeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNodeId(nodeId);
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

  useEffect(() => {
    const fetchTabs = async () => {
      if (typeof window.chrome !== 'undefined' && window.chrome.tabs) {
        window.chrome.tabs.query({}, (tabs) => {
          const newNodes = tabs.map((tab, index) => {
            const xPosition = (index % Math.floor(window.innerWidth / (NODE_WIDTH + SPACING))) * (NODE_WIDTH + SPACING);
            const yPosition = TOP_SPACING + Math.floor(index / Math.floor(window.innerWidth / (NODE_WIDTH + SPACING))) * (NODE_HEIGHT + SPACING);
            return {
              id: tab.id.toString(),
              position: { x: xPosition, y: yPosition },
              data: { label: tab.title, onOpenMenu: (e) => openMenu(e, tab.id.toString()) },
              type: 'customNode',
            };
          });
          setNodes(newNodes);
        });
      } else {
        const mockTabs = [
          { id: 1, title: 'Tab 1' },
          { id: 2, title: 'Tab 2' },
        ];
        const newNodes = mockTabs.map((tab) => ({
          id: tab.id.toString(),
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: tab.title, onOpenMenu: (e) => openMenu(e, tab.id.toString()) },
          type: 'customNode',
        }));
        setNodes(newNodes);
      }
    };

    fetchTabs();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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

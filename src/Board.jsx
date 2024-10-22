import React, { useEffect, useRef, useState } from 'react';
import './Board.css'; // Import the CSS file for styles
import * as d3 from 'd3'; // Assuming you are using d3 as a library

const Board = () => {
  const canvasRef = useRef(null); // Create a reference for the canvas element
  const svgRef = useRef(null); // Reference for the SVG element inside the canvas
  const [tabsList, setTabsList] = useState([]); // State to store the list of tabs
  const nodes = useRef([]); // Nodes state
  const edges = useRef([]); // Edges state
  let connectingEdge = useRef(null); // Edge being created
  let startAttachPoint = useRef(null);
  let draggedNode = useRef(null);
  let offsetX = 0, offsetY = 0;
  let isDragging = false;

  // Helper function to create a node
  const createNode = (x, y, label) => {
    const canvas = canvasRef.current;
    const node = document.createElement('div');
    node.classList.add('node');
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    // Wrap the text in a div for separate styling
    const content = document.createElement('div');
    content.classList.add('node-content');
    content.innerText = label;
    node.appendChild(content);
    canvas.appendChild(node);

    // Add attach points
    ['left', 'right'].forEach(side => {
      const attachPoint = document.createElement('div');
      attachPoint.classList.add('attach-point', side);
      attachPoint.dataset.side = side;
      node.appendChild(attachPoint);

      attachPoint.addEventListener('mousedown', (e) => startEdge(e, attachPoint));
    });

    // Add event listeners for dragging
    node.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    node.addEventListener('mousemove', dragNode);

    nodes.current.push({ node, x, y });
    return node;
  };

  const startEdge = (e, attachPoint) => {
    startAttachPoint.current = attachPoint;
    connectingEdge.current = document.createElementNS("http://www.w3.org/2000/svg", "path");
    connectingEdge.current.setAttribute('d', `M 0 0 Q 0 0, 0 0`);
    svgRef.current.appendChild(connectingEdge.current);
    canvasRef.current.addEventListener('mousemove', drawConnectingEdge);
    window.addEventListener('mouseup', finishEdge);
  };

  const drawConnectingEdge = (e) => {
    if (!connectingEdge.current || !startAttachPoint.current) return;
    const startRect = startAttachPoint.current.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2 - 50;
    const endX = e.clientX;
    const endY = e.clientY - 50;

    const controlX1 = startX + (endX - startX) * 0.25;
    const controlX2 = startX + (endX - startX) * 0.75;
    const d = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
    connectingEdge.current.setAttribute('d', d);
  };

  const finishEdge = (e) => {
    canvasRef.current.removeEventListener('mousemove', drawConnectingEdge);
    window.removeEventListener('mouseup', finishEdge);
    if (!connectingEdge.current) return;
    const endAttachPoint = document.elementFromPoint(e.clientX, e.clientY);
    if (endAttachPoint && endAttachPoint.classList.contains('attach-point') && endAttachPoint !== startAttachPoint.current) {
      createEdge(startAttachPoint.current, endAttachPoint);
    }
    svgRef.current.removeChild(connectingEdge.current);
    connectingEdge.current = null;
    startAttachPoint.current = null;
  };
  
const createEdge = (startPoint, endPoint) => {
	const startNode = startPoint.parentNode;
	const endNode = endPoint.parentNode;

	// Check if an edge between these two nodes already exists
	if (edgeExists(startPoint, endPoint)) {
		console.log('Edge already exists between these nodes.');
		return;
	}

	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.classList.add('edge');
	svgRef.current.appendChild(path);
	edges.push({ path, startPoint, endPoint, startNode, endNode });

	// Add click event listener to allow edge deletion
	path.addEventListener('click', (e) => removeEdge(e, path));

	updateEdgePosition({ path, startPoint, endPoint });
};

// Function to check if an edge already exists between two nodes
const edgeExists = (startPoint, endPoint) => {
	const startNode = startPoint.parentNode;
	const endNode = endPoint.parentNode;
	return edges.some(edge => (
		(edge.startNode === startNode && edge.endNode === endNode) ||
		(edge.startNode === endNode && edge.endNode === startNode)
	));
};

  const startDrag = (e) => {
	if (e.target.closest('.node')) {  // Ensure drag applies to the entire node, including content
		isDragging = true;
		draggedNode = e.target.closest('.node');  // Get the parent .node if clicking on a child
		offsetX = e.clientX - draggedNode.offsetLeft;
		offsetY = e.clientY - draggedNode.offsetTop;
	}
};

const stopDrag = (e) => {
	isDragging = false;
	draggedNode = null;
};

const dragNode = (e) => {
	if (isDragging && draggedNode) {
		const newX = e.clientX - offsetX;
		const newY = e.clientY - offsetY;
		draggedNode.style.left = newX + 'px';
		draggedNode.style.top = newY + 'px';

		// Update connected edges
		edges.forEach(updateEdgePosition);
	}
};

const updateEdgePosition = (edge) => {
	const { path, startPoint, endPoint } = edge;
	const startRect = startPoint.getBoundingClientRect();
	const endRect = endPoint.getBoundingClientRect();

	const startX = startRect.left + startRect.width / 2;
	const startY = startRect.top + startRect.height / 2 - 50; // Adjust for canvas offset
	const endX = endRect.left + endRect.width / 2;
	const endY = endRect.top + endRect.height / 2 - 50; // Adjust for canvas offset

	const controlX1 = startX + (endX - startX) * 0.25; // Control points for cubic Bézier
	const controlX2 = startX + (endX - startX) * 0.75;

	const d = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
	path.setAttribute('d', d);
};

const removeEdge = (e, path) => {
	e.stopPropagation(); // Prevent the event from bubbling up
	svgRef.current.removeChild(path); // Remove from the SVG
	const index = edges.findIndex(edge => edge.path === path);
	if (index !== -1) {
		edges.splice(index, 1); // Remove from the array
	}
};

  // Use effect to initialize the canvas and SVG
  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgRef.current = svg;
    canvas.appendChild(svg);

    // Handle incoming tab data (this can be linked to Chrome runtime if needed)
    window.chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'sendTabData') {
        const updatedTabsList = [...tabsList, request.tabData];
        setTabsList(updatedTabsList); // Update the state
        createNode(100, 100, request.tabData.title); // Create a node for each new tab
      }
    });
  }, [tabsList]);

  return (
    <div>
      <div className="navbar">
        <h1>My Application</h1>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div id="canvas" ref={canvasRef}></div>
    </div>
  );
};

export default Board;

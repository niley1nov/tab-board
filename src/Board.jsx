import React, { useEffect, useRef, useState } from 'react';
import './Board.css'; // Import the CSS file for styles
import * as d3 from 'd3'; // Assuming you are using d3 as a library

const Board = () => {
	const canvasRef = useRef(null); // Create a reference for the canvas element
	const svgRef = useRef(null); // Reference for the SVG element inside the canvas
	const [tabsList, setTabsList] = useState([]); // State to store the list of tabs
	const nodes = useRef([]); // Nodes state
	// Initialize xPos and yPos to manage node positions
	const xPosRef = useRef(100);
	const yPosRef = useRef(100);

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
		nodes.current.push({ node, x, y });
		return node;
	};

	// Use effect to initialize the canvas and SVG
	useEffect(() => {
		const canvas = canvasRef.current;
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgRef.current = svg;
		canvas.appendChild(svg);

		// Message handler function
		const handleTabData = (request) => {
			if (request.action === 'sendTabData') {
				const updatedTabsList = [...tabsList, request.tabData];

				// Create a new node at dynamic positions
				createNode(xPosRef.current, yPosRef.current, request.tabData.title);

				// Update positions for next node
				xPosRef.current += 250;  // Increment x position for the next node
				if (xPosRef.current > canvas.clientWidth - 200) {  // Reset x and increment y if out of bounds
					xPosRef.current = 100;
					yPosRef.current += 150;
				}

				// Add tab data to the state
				setTabsList((prevTabsList) => [...prevTabsList, request.tabData]);
			}
		};

		// Attach the listener
		window.chrome.runtime.onMessage.addListener(handleTabData);

		// Cleanup function to remove the listener when the component unmounts or effect re-runs
		return () => {
			window.chrome.runtime.onMessage.removeListener(handleTabData);
		};
	}, [tabsList]);  // Dependency array ensures that the effect runs when tabsList changes


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

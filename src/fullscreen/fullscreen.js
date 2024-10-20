let tabsList = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendTabData") {
    // Add the received tab data to the tabsList array
    tabsList.push(request.tabData);

    // Log the updated list to check that new data is being added
    console.log("Updated tabs list:", tabsList);

    // You can now manipulate the tabsList as needed, or process each new tab
    const recentTab = tabsList[tabsList.length - 1];
    console.log(`Received tab - ID: ${recentTab.id}, Title: ${recentTab.title}, URL: ${recentTab.url}`);
  }
});

document.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('canvas');
	const nodes = [];
	const edges = [];
	let connectingEdge = null;
	let startAttachPoint = null;
	let draggedNode = null;
	let offsetX = 0, offsetY = 0;
	let isDragging = false;

	// Create an SVG element for edges
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	canvas.appendChild(svg);

	// Function to create a node with only left and right attach points
	function createNode(x, y, label) {
		const node = document.createElement('div');
		node.classList.add('node');
		node.style.left = x + 'px';
		node.style.top = y + 'px';
		node.innerText = label;
		canvas.appendChild(node);

		// Attach points only on the left and right sides
		['left', 'right'].forEach(side => {
			const attachPoint = document.createElement('div');
			attachPoint.classList.add('attach-point', side);
			attachPoint.dataset.side = side;
			node.appendChild(attachPoint);

			attachPoint.addEventListener('mousedown', (e) => startEdge(e, attachPoint));
		});

		node.addEventListener('mousedown', startDrag);
		window.addEventListener('mouseup', stopDrag);
		node.addEventListener('mousemove', dragNode);

		nodes.push({ node, x, y });
		return node;
	}

	// Function to check if an edge already exists between two nodes
	function edgeExists(startPoint, endPoint) {
		const startNode = startPoint.parentNode;
		const endNode = endPoint.parentNode;
		return edges.some(edge => (
			(edge.startNode === startNode && edge.endNode === endNode) ||
			(edge.startNode === endNode && edge.endNode === startNode)
		));
	}

	// Function to create a curvy edge between two attach points
	function createEdge(startPoint, endPoint) {
		const startNode = startPoint.parentNode;
		const endNode = endPoint.parentNode;

		// Check if an edge between these two nodes already exists
		if (edgeExists(startPoint, endPoint)) {
			console.log('Edge already exists between these nodes.');
			return;
		}

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.classList.add('edge');
		svg.appendChild(path);
		edges.push({ path, startPoint, endPoint, startNode, endNode });

		// Add click event listener to allow edge deletion
		path.addEventListener('click', (e) => removeEdge(e, path));

		updateEdgePosition({ path, startPoint, endPoint });
	}

	// Update the curvy edge based on positions of the attach points
	function updateEdgePosition(edge) {
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
	}


	// Function to remove an edge from the SVG and edges array
	function removeEdge(e, path) {
		e.stopPropagation(); // Prevent the event from bubbling up
		svg.removeChild(path); // Remove from the SVG
		const index = edges.findIndex(edge => edge.path === path);
		if (index !== -1) {
			edges.splice(index, 1); // Remove from the array
		}
	}

	// Function to start creating an edge
	function startEdge(e, attachPoint) {
		e.stopPropagation();
		startAttachPoint = attachPoint;

		connectingEdge = document.createElementNS("http://www.w3.org/2000/svg", "path");
		connectingEdge.setAttribute('d', `M 0 0 Q 0 0, 0 0`);
		svg.appendChild(connectingEdge);

		canvas.addEventListener('mousemove', drawConnectingEdge);
		window.addEventListener('mouseup', finishEdge);
	}

	// Draw the temporary connecting edge while the mouse is moving
	function drawConnectingEdge(e) {
		if (!connectingEdge || !startAttachPoint) return;

		const startRect = startAttachPoint.getBoundingClientRect();
		const startX = startRect.left + startRect.width / 2;
		const startY = startRect.top + startRect.height / 2 - 50; // Adjust for canvas offset

		const endX = e.clientX;
		const endY = e.clientY - 50; // Adjust for canvas offset

		// Calculate control points for cubic Bézier curve
		const controlX1 = startX + (endX - startX) * 0.25; // First control point closer to start
		const controlX2 = startX + (endX - startX) * 0.75; // Second control point closer to end

		const d = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
		connectingEdge.setAttribute('d', d);
	}


	// Finish the edge when the mouse is released
	function finishEdge(e) {
		canvas.removeEventListener('mousemove', drawConnectingEdge);
		window.removeEventListener('mouseup', finishEdge);

		if (!connectingEdge) return;

		const endAttachPoint = document.elementFromPoint(e.clientX, e.clientY);
		if (endAttachPoint && endAttachPoint.classList.contains('attach-point') && endAttachPoint !== startAttachPoint) {
			createEdge(startAttachPoint, endAttachPoint);
		}

		// Remove temporary edge if not valid
		svg.removeChild(connectingEdge);
		connectingEdge = null;
		startAttachPoint = null;
	}

	// Start dragging the node
	function startDrag(e) {
		if (e.target.classList.contains('node')) {
			isDragging = true;
			draggedNode = e.target;
			offsetX = e.clientX - draggedNode.offsetLeft;
			offsetY = e.clientY - draggedNode.offsetTop;
		}
	}

	// Stop dragging the node
	function stopDrag() {
		isDragging = false;
		draggedNode = null;
	}

	// Drag the node and update position of edges
	function dragNode(e) {
		if (isDragging && draggedNode) {
			const newX = e.clientX - offsetX;
			const newY = e.clientY - offsetY;
			draggedNode.style.left = newX + 'px';
			draggedNode.style.top = newY + 'px';

			// Update connected edges
			edges.forEach(updateEdgePosition);
		}
	}

	// Create some sample nodes with left and right attach points
	createNode(100, 100, 'Node 1');
	createNode(300, 200, 'Node 2');
	createNode(500, 300, 'Node 3');
});

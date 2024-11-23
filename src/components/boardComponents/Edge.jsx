import React from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	useReactFlow,
} from "@xyflow/react";

export default function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}) {
	const { setEdges } = useReactFlow();
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	// Function to delete the edge when clicking on the "X" button
	const onDeleteClick = (event) => {
		event.stopPropagation(); // Prevent propagation to prevent edge click behavior
		setEdges((edges) => edges.filter((edge) => edge.id !== id)); // Remove the edge
	};

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={markerEnd}
				style={{ strokeWidth: 3 }} // Apply the stroke width for the edge
				className="custom-edge" // Custom class for additional styling
			/>
			{/* No longer need the large transparent clickable path for the edge */}

			{/* Always show the delete button */}
			<g>
				<circle
					cx={labelX}
					cy={labelY}
					r="6" // Set the radius to a smaller value (e.g., 4 instead of 6)
					fill="white"
					stroke="black"
					strokeWidth="1"
					onClick={onDeleteClick} // Handle delete button click
				/>
				<text
					x={labelX}
					y={labelY}
					textAnchor="middle"
					dominantBaseline="middle"
					fontSize="14"
					fill="black"
					onClick={onDeleteClick} // Handle delete button click
					style={{ cursor: "pointer" }}
				>
					x
				</text>
			</g>

			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						pointerEvents: "all",
					}}
					className="nodrag nopan"
				/>
			</EdgeLabelRenderer>
		</>
	);
}

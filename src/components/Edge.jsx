import React from 'react';
import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	useReactFlow,
} from '@xyflow/react';

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

	const onEdgeClick = (event) => {
		event.stopPropagation();
		setEdges((edges) => edges.filter((edge) => edge.id !== id));
		console.log('Edge clicked:', id);
	};

	return (
		<>
			<BaseEdge
				path={edgePath}
				markerEnd={markerEnd}
				style={{ strokeWidth: 3 }} // Ensure thickness is applied here
				className="custom-edge" // Assign a CSS class for custom styling
			/>
			<path
				d={edgePath}
				fill="none"
				stroke="transparent"
				strokeWidth={10}
				onClick={onEdgeClick}
			/>
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						pointerEvents: 'all',
					}}
					className="nodrag nopan"
				/>
			</EdgeLabelRenderer>
		</>
	);
}

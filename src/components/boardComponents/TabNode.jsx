import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Handle, Position } from "@xyflow/react";
import "../../stylesheets/TabNode.css";

const TabNode = ({ data }) => {
	return (
		<div
			className="tab-node"
			onClick={data.onClick}
			style={{ backgroundColor: data.backgroundColor || "#FFF" }}
		>
			{/* Header Section */}
			<div className="tab-node-header">
				<Typography
					variant="subtitle2"
					className="tab-node-title"
					title={data.label}
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{data.label}
				</Typography>
			</div>

			{/* Divider Line */}
			<Divider className="tab-node-divider" sx={{ margin: "8px 0" }} />

			{/* Image Section */}
			{data.image && (
				<div className="tab-node-image-container">
					<img
						src={data.image}
						alt={data.label || "Tab Image"}
						className="tab-node-image"
					/>
				</div>
			)}

			{/* Right Handle for Output Connection */}
			<Handle
				type="source"
				position={Position.Right}
				id="output"
				style={{ top: "50%" }}
			/>
		</div>
	);
};

export default TabNode;

import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Handle, Position } from "@xyflow/react";
import "../../stylesheets/OutputNode.css";

const OutputNode = ({ data }) => {
	return (
		<div 
			onClick={data.onClick} 
			className="output-node"
			style={{ backgroundColor: data.backgroundColor || "#FFF" }}
		>
			{/* Left Handle */}
			<Handle
				type="target"
				position={Position.Left}
				id="schema"
				style={{ top: "50%" }}
			/>

			{/* Header Section */}
			<div className="output-node-header">
				<Typography  
					className="output-node-title"
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{data.label}
				</Typography>
			</div>

			<Divider className="output-node-divider" sx={{ margin: "8px 0" }} />

			{/* Output */}
			<div className="output-node-resp-container">
				<Typography
					className="output-node-response"
					style={{ fontFamily: "Poppins, sans-serif" }}
				>
					{"Output will appear on sidebar"}
				</Typography>
			</div>
		</div>
	);
};

export default OutputNode;

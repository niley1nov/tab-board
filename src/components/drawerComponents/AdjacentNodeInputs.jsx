import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import "../../stylesheets/CustomDrawer.css";

const AdjacentNodeInputs = ({
	adjacencyNodes,
	adjacentNodeInputs,
	handleInputChange,
}) => (
	<Box className='adjacent-tabnode-input-container'>
		{adjacencyNodes
			.filter((node) => node.type === "TabNode")
			.map((node) => (
				<Box
					key={node.id}
					mb={2}
					className="adjacent-node-input-container"
				>
					<Typography className="adjacent-node-title" style={{ fontFamily: "Poppins, sans-serif" }}>
						{node.data.label}
					</Typography>
					<TextField
						fullWidth
						variant="outlined"
						placeholder="Enter context"
						value={adjacentNodeInputs[node.id] || ""}
						onChange={(e) =>
							handleInputChange(node.id, e.target.value)
						}
						className="custom-text-field"
						autoComplete="off"
					/>
				</Box>
			))}
	</Box>
);

export default AdjacentNodeInputs;

import React, { useState } from "react";
import { Button, Typography } from "@mui/material";

const OutputNodeContent = () => {
	const [output, setOutput] = useState(null);

	const handleGetOutput = () => {
		setOutput("Generated output text goes here.");
	};

	return (
		<div>
			<Button
				variant="contained"
				onClick={handleGetOutput}
				sx={{ marginTop: 2 }}
			>
				Get Output
			</Button>
			{output && (
				<Typography
					variant="body2"
					className="sidebar-output"
					sx={{ marginTop: 2 }}
				>
					{output}
				</Typography>
			)}
		</div>
	);
};

export default OutputNodeContent;

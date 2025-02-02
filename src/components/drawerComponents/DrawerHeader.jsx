import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import "../../stylesheets/CustomDrawer.css";

const DrawerHeader = ({ title, onClose }) => (
	<>
		<Box className="drawer-header">
			<Typography className="sidebar-title" style={{ fontFamily: "Poppins, sans-serif" }}>
				{title}
			</Typography>
		</Box>
	</>
);

export default DrawerHeader;

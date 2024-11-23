import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../stylesheets/CustomDrawer.css";

const DrawerHeader = ({ title, onClose }) => (
	<>
		<Box className="drawer-header">
			<Typography variant="h6" className="sidebar-title">
				{title}
			</Typography>
			<IconButton onClick={onClose} className="close-icon">
				<CloseIcon />
			</IconButton>
		</Box>
		<Divider sx={{ marginY: 2, borderColor: "#242629" }} />
	</>
);

export default DrawerHeader;

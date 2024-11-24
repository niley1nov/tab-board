// NavBar.jsx
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useGraph } from "../../containers/GraphContext";
import AddIcon from "@mui/icons-material/AddCard";
import TokenIcon from "@mui/icons-material/Token";
import { useToken } from "../../containers/TokenContext";
import TokenDialog from "../drawerComponents/TokenDialog";
import CustomDrawer from "../drawerComponents/CustomDrawer";
import AddNodeMenu from "./AddNodeMenu";
import "../../stylesheets/NavBar.css";

const NavBar = () => {
	const graph = useGraph();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { token, setToken } = useToken();
	const [apiToken, setApiToken] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [menuAnchor, setMenuAnchor] = useState(null);

	const toggleDrawer = () => () => {
		setDrawerOpen(!drawerOpen);
	};

	const setGeminiToken = () => {
		setDialogOpen(true);
	};

	useEffect(() => {
		setApiToken(token);
	}, [token]);

	// Open dropdown menu
	const handleMenuOpen = (event) => {
		setMenuAnchor(event.currentTarget);
	};

	// Close dropdown menu
	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	// Handle menu item selection
	const handleMenuItemClick = (option) => {
		graph.handleAddNode(option);
		handleMenuClose();
	};

	return (
		<>
			{/* AppBar */}
			<AppBar position="static" className="app-bar">
				<Toolbar className="tool-bar">
					{/* App name on the left */}
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, color: "white" }}
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						<span className="header-tab">Tab</span>
						<span className="header-board">Board</span>
					</Typography>

					<Button
						variant="contained"
						startIcon={<TokenIcon />}
						onClick={setGeminiToken}
						className="add-node-button"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						Set Token
					</Button>

					{/* Add Prompt Node Button */}
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={handleMenuOpen} // Open dropdown menu
						className="add-node-button"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						Add Node
					</Button>

					{/* Drawer icon button on the right */}
					<IconButton
						edge="end"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer()}
						className="menu-icon"
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			<AddNodeMenu
				anchorEl={menuAnchor}
				open={Boolean(menuAnchor)}
				onClose={handleMenuClose}
				onSelectOption={handleMenuItemClick}
			/>

			{/* Drawer Component */}
			<CustomDrawer
				open={drawerOpen}
				onClose={toggleDrawer()}
			/>
			<TokenDialog
				open={dialogOpen}
				apiToken={apiToken}
				setApiToken={setApiToken}
				onClose={() => {
					setDialogOpen(false);
					setApiToken(token);
				}}
				onSubmit={() => {
					setToken(apiToken);
					setDialogOpen(false);
				}}
			/>
		</>
	);
};

export default NavBar;

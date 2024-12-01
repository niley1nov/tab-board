// AddNodeMenu.jsx
import React from "react";
import { Popover, Box } from "@mui/material";
import "../../stylesheets/AddNodeMenu.css";

const AddNodeMenu = ({ anchorEl, open, onClose, onSelectOption }) => {
	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "left",
			}}
			className="custom-popover"
		>
			<Box className="menu-box">
				<div className="menu-arrow"></div>
				<div
					className="menu-option"
					onClick={() => onSelectOption("prompt")}
				>
					Prompt Node
				</div>
				<hr className="menu-divider" />
				<div
					className="menu-option"
					onClick={() => onSelectOption("summary")}
				>
					Summarization Node
				</div>
				<hr className="menu-divider" />
				<div
					className="menu-option"
					onClick={() => onSelectOption("rewrite")}
				>
					Rewrite Node
				</div>
				<hr className="menu-divider" />
				<div
					className="menu-option"
					onClick={() => onSelectOption("translate")}
				>
					Translate Node
				</div>
				<hr className="menu-divider" />
				<div
					className="menu-option"
					onClick={() => onSelectOption("chat")}
				>
					Chat Node
				</div>
				<hr className="menu-divider" />
				<div
					className="menu-option"
					onClick={() => onSelectOption("output")}
				>
					Output Node
				</div>
			</Box>
		</Popover>
	);
};

export default AddNodeMenu;

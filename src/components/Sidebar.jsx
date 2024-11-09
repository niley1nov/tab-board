import '../stylesheets/Sidebar.css';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Divider from '@mui/material/Divider';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Box, IconButton, Typography, Paper, TextField, Button } from '@mui/material';

const SideBar = ({ content, isSidebarVisible, setIsSidebarVisible }) => {
    // Create different states
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const { title, nodeType, additionalContent = "" } = content;

    // Action to Minimize the sidebar
    const togglePopup = () => {
        console.log("INSIDE TOGGLE: ", isSidebarVisible)
        setIsMinimized(!isMinimized);
        setIsSidebarVisible(!isSidebarVisible)
    };

    // Action on Get Output button
    const handleGetOutput = () => {
        setOutput("Generated output text goes here.");
    };

    return (
        <Box className={`popup-container ${isMinimized ? 'minimized' : ''}`}>
            {!isMinimized ? (
                <Paper elevation={4} className="sidebar-content">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" className="sidebar-title" sx={{ padding: '8px 0' }}>{title}</Typography>
                        <IconButton onClick={togglePopup} size="small">
                            <MinimizeIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box className="sidebar-scrollable-content">
                        {nodeType === 'TabNode' && (
                            <div>
                                <ReactMarkdown className="sidebar-markdown">{additionalContent}</ReactMarkdown>
                            </div>
                        )}

                        {nodeType === 'PromptNode' && (
                            <div>
                                <TextField
                                    label="Enter Prompt"
                                    variant="outlined"
                                    fullWidth
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    sx={{ marginTop: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => console.log("Prompt submitted:", prompt)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}

                        {nodeType === 'OutputNode' && (
                            <div>
                                <Button variant="contained" onClick={handleGetOutput} sx={{ marginTop: 2 }}>
                                    Get Output
                                </Button>
                                {output && (
                                    <Typography variant="body2" className="sidebar-output" sx={{ marginTop: 2 }}>
                                        {output}
                                    </Typography>
                                )}
                            </div>
                        )}
                    </Box>
                </Paper>
            ) : (
                <IconButton onClick={togglePopup} className="minimized-icon">
                    <ExpandLessIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default SideBar;

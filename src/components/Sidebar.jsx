import React, { useState } from 'react';
import { Box, IconButton, Typography, Paper, TextField, Button } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ReactMarkdown from 'react-markdown'; // Import for Markdown support
import '../stylesheets/Sidebar.css';

const Sidebar = ({ content }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const { title, nodeType, description = "", additionalContent = "" } = content; // Set default values
    const [showFullContent, setShowFullContent] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState(null);

    const togglePopup = () => {
        setIsMinimized(!isMinimized);
    };

    const handleGetOutput = () => {
        setOutput("Generated output text goes here.");
    };

    return (
        <Box className={`popup-container ${isMinimized ? 'minimized' : ''}`}>
            {!isMinimized ? (
                <Paper elevation={4} sx={{ padding: 2, height: '100%', overflow: 'hidden' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{title}</Typography>
                        <IconButton onClick={togglePopup} size="small">
                            <MinimizeIcon />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            maxHeight: 'calc(100% - 50px)',
                            overflowY: 'auto',
                            marginTop: 1,
                        }}
                    >
                        {nodeType === 'TabNode' && (
                            <div>
                                <Typography variant="body2" className="sidebar-description">
                                    {showFullContent ? description : `${description.slice(0, 100)}...`}
                                </Typography>
                                {description.length > 100 && (
                                    <Button
                                        variant="text"
                                        onClick={() => setShowFullContent(!showFullContent)}
                                        className="read-more-button"
                                    >
                                        {showFullContent ? "Show Less" : "Read More"}
                                    </Button>
                                )}
                                <ReactMarkdown className="sidebar-markdown">{additionalContent}</ReactMarkdown>
                            </div>
                        )}

                        {nodeType === 'PromptNode' && (
                            <div>
                                <Typography variant="body2" className="sidebar-description">
                                    {description}
                                </Typography>
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
                <IconButton onClick={togglePopup} sx={{ backgroundColor: '#007bff', color: '#fff' }}>
                    <ExpandLessIcon />
                </IconButton>
            )}
        </Box>
    );
};

export default Sidebar;

import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown'; // Use for Markdown support
import '../stylesheets/Sidebar.css';

const Sidebar = ({ content }) => {
    const { title, nodeType, description = "", additionalContent = "" } = content; // Set default values
    const [showFullContent, setShowFullContent] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState(null);

    const handleGetOutput = () => {
        setOutput("Generated output text goes here.");
    };

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">{title}</h2>
            <div className="sidebar-divider"></div> {/* Divider below the title */}

            <div className="sidebar-content">
                {nodeType === 'TabNode' && (
                    <div>
                        <p className="sidebar-description">
                            {showFullContent ? description : `${description.slice(0, 100)}...`}
                        </p>
                        {description && description.length > 100 && (
                            <Button variant="text" onClick={() => setShowFullContent(!showFullContent)} className="read-more-button">
                                {showFullContent ? "Show Less" : "Read More"}
                            </Button>
                        )}
                        <ReactMarkdown className="sidebar-markdown">{additionalContent}</ReactMarkdown>
                    </div>
                )}

                {nodeType === 'PromptNode' && (
                    <div>
                        <p className="sidebar-description">{description}</p>
                        <TextField
                            label="Enter Prompt"
                            variant="outlined"
                            fullWidth
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            style={{ marginTop: '10px' }}
                        />
                        <Button variant="contained" onClick={() => console.log("Prompt submitted:", prompt)} style={{ marginTop: '10px' }}>
                            Submit
                        </Button>
                    </div>
                )}

                {nodeType === 'OutputNode' && (
                    <div>
                        <Button variant="contained" onClick={handleGetOutput} style={{ marginTop: '10px' }}>
                            Get Output
                        </Button>
                        {output && <p className="sidebar-output">{output}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

import React from "react";
import "../stylesheets/App.css";

function App() {
	// Function to handle "Open Board" button click
	const handleOpenBoard = () => {
		if (
			typeof window !== "undefined" &&
			window.chrome &&
			window.chrome.tabs
		) {
			// Open board.html in a new tab with the #/board route
			window.chrome.tabs.create(
				{ url: window.chrome.runtime.getURL("board.html#/board") },
				function (boardTab) {
					// Ensure that `boardTab` is correctly defined
					if (boardTab && boardTab.id) {
						// Wait for the board tab to finish loading
						window.chrome.tabs.onUpdated.addListener(
							function onUpdated(tabId, changeInfo) {
								// Ensure the correct tab and that the page is fully loaded
								if (
									tabId === boardTab.id &&
									changeInfo.status === "complete"
								) {
									// Now that the board page is ready, send the message to extract content from all tabs
									window.chrome.runtime.sendMessage({
										action: "extractContentFromTabs",
									});

									// Remove the listener to prevent future triggers
									window.chrome.tabs.onUpdated.removeListener(
										onUpdated,
									);
								}
							},
						);
					}
				},
			);
		} else {
			alert(
				"This feature is only available in the Chrome extension context.",
			);
		}
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1>Welcome to TabBoard</h1>
				<p>Organize your browser tabs with ease and efficiency.</p>
				<button className="open-board-btn" onClick={handleOpenBoard}>
					Open Board
				</button>
				<footer className="App-footer">
					<p>
						Visit our site:{" "}
						<a
							href="https://www.tab-board.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							tab-board.com
						</a>
					</p>
				</footer>
			</header>
		</div>
	);
}

export default App;

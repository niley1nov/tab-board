import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./containers/App";
import { TokenProvider } from "./containers/TokenContext"; // Adjust the path
import Board from "./containers/Board";

ReactDOM.render(
	<TokenProvider>
		<Router>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/board" element={<Board />} />
			</Routes>
		</Router>
	</TokenProvider>,
	document.getElementById("root"),
);

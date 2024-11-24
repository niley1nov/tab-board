import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "./containers/App";
import { TokenProvider } from "./containers/TokenContext";
import { GraphProvider } from "./containers/GraphContext";
import Board from "./containers/Board";

ReactDOM.render(
	<TokenProvider>
		<GraphProvider>
			<Router>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/board" element={<Board />} />
				</Routes>
			</Router>
		</GraphProvider>
	</TokenProvider>,
	document.getElementById("root"),
);

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './containers/App';
import Board from './containers/Board';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/board" element={<Board />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

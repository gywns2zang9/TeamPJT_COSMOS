import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/home/navBar.jsx';
import Footer from './components/home/footer.jsx';
import HomeRoutes from './routes/homeRoutes.js';
import GroupRoutes from './routes/groupRoutes.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" id="App">
        <NavBar />
        <Routes>
          <Route path="*" element={<HomeRoutes />} />
          <Route path="/group/*" element={<GroupRoutes />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

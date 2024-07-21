import React from "react";
import HomeView from "./views/HomeView";
import NavBar from './components/home/navBar.jsx';
import Footer from './components/home/footer.jsx';

import './App.css';

function App() {
  return (
    <div className="App" id="App">
      <NavBar />
      <HomeView />
      <Footer />
    </div>
  );
}

export default App;

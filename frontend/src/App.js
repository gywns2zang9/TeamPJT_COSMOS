import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomeView from "./views/HomeView";
import ConferenceView from "./views/ConferenceView.jsx";
import GroupPageView from "./views/GroupPageView.jsx";
import NavBar from "./components/home/navBar.jsx";
import Footer from "./components/home/footer.jsx";
import "./App.css";

// 현재 경로에 따라 NavBar와 Footer를 조건적으로 렌더링하는 컴포넌트
function AppContent() {
  const location = useLocation();
  const isConferenceRoute = location.pathname === "/conference";

  return (
    <div id="App">
      {!isConferenceRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/conference" element={<ConferenceView />} />
        <Route path="/group" element={<GroupPageView />} />
      </Routes>
      {!isConferenceRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

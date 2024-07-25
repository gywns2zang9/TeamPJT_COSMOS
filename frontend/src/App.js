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
import Login from "./components/accounts/login.jsx";
import SignUp from "./components/accounts/signUp.jsx";
import UserProfileView from "./views/UserProfileView.jsx";
import PasswordFind from "./components/accounts/passwordFind.jsx";
import UserInfoChange from "./components/user/userInfoChange.jsx";
import PasswordChange from "./components/accounts/passwordChange";
import HomeRoutes from "./routes/homeRoutes.js";
import GroupRoutes from "./routes/groupRoutes.js";
import "./App.css";

// 현재 경로에 따라 NavBar와 Footer를 조건적으로 렌더링하는 컴포넌트
function AppContent() {
  const location = useLocation();
  const isConferenceRoute = location.pathname === "/conference";

  return (
    <div id="App">
      {!isConferenceRoute && <NavBar />}
      <Routes>
        <Route path="/conference" element={<ConferenceView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user" element={<UserProfileView />} />
        <Route path="/password-find" element={<PasswordFind />} />
        <Route path="/userinfochange" element={<UserInfoChange />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/" element={<HomeView />} />
        <Route path="*" element={<HomeRoutes />} />
        <Route path="/group/*" element={<GroupRoutes />} />
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

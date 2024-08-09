import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomeView from "./views/HomeView";
import ConferenceRoutes from "./routes/conferenceRoutes.js";
import NavBar from "./components/home/navBar.jsx";
import Footer from "./components/home/footer.jsx";
import Login from "./components/accounts/login.jsx";
import PasswordChange from "./components/accounts/passwordChange.jsx";
import KakaoRedirect from "./components/accounts/kakaoRedirect.jsx";
import NaverRedirect from "./components/accounts/naverRedirect.jsx";
import SignUp from "./components/accounts/signUp.jsx";
import PasswordFind from "./components/accounts/passwordFind.jsx";
import HomeRoutes from "./routes/homeRoutes.js";
import GroupRoutes from "./routes/groupRoutes.js";
import UserRouters from "./routes/userRouters.js";
import "./App.css";
import RainbowTrail from "./rainbowTrail";

function AppContent() {
  const location = useLocation();
  const isConferenceRoute = location.pathname.startsWith("/conference");

  return (
    <div id="App">
      {!isConferenceRoute && <NavBar />}
      <RainbowTrail />
      <Routes>
        <Route path="/conference/*" element={<ConferenceRoutes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao/callback" element={<KakaoRedirect />} />
        <Route path="/auth/naver/callback" element={<NaverRedirect />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password-change" element={<PasswordChange />} />
        <Route path="/password-find" element={<PasswordFind />} />
        <Route path="/" element={<HomeView />} />
        <Route path="*" element={<HomeRoutes />} />
        <Route path="/group/*" element={<GroupRoutes />} />
        <Route path="/users/*" element={<UserRouters />} />{" "}
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

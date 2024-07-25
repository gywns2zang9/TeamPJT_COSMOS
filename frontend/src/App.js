import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";
import NavBar from "./components/home/navBar.jsx";
import Footer from "./components/home/footer.jsx";
import Login from "./components/accounts/login.jsx";
import SignUp from "./components/accounts/signUp.jsx";
import UserProfileView from "./views/UserProfileView.jsx";
import PasswordFind from "./components/accounts/passwordFind.jsx";
import UserInfoChange from "./components/user/userInfoChange.jsx";
import PasswordChange from "./components/accounts/passwordChange";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App" id="App">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<UserProfileView />} />
          <Route path="/password-find" element={<PasswordFind />} />
          <Route path="/userinfochange" element={<UserInfoChange />} />
          <Route path="/password-change" element={<PasswordChange />} />
          <Route path="/" element={<HomeView />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// src/views/AccountPageView.jsx

import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/accounts/login";
import PasswordFind from "../components/accounts/passwordFind";
import PasswordChange from "../components/accounts/passwordChange";

const AccountPageView = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/password-find" element={<PasswordFind />} />
      <Route path="/password-change" element={<PasswordChange />} />
      {/* 다른 라우트들 */}
    </Routes>
  );
};

export default AccountPageView;

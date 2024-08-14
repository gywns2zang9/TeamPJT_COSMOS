import React from "react";
import { Route, Routes } from "react-router-dom";
import ConferenceView from "../views/ConferenceView";
import useAuthStore from "../store/auth";

const ConferenceRoutes = () => {
  const isLogin = useAuthStore((state) => state.isLogin)
  if (!isLogin) {
    window.location.href = `http://localhost:3000`
    return null; 
  }

  return (
    <Routes>
    <Route path="/:groupId" element={<ConferenceView />} />
    <Route path="*" element={<ConferenceView />} />{" "}
  </Routes>
  )
}

export default ConferenceRoutes;

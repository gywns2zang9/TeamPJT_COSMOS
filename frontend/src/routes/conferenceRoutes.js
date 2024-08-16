import React from "react";
import { Route, Routes } from "react-router-dom";
import ConferenceView from "../views/ConferenceView";
import useAuthStore from "../store/auth";

const BASE_URL = `https://i11a708.p.ssafy.io/`


const ConferenceRoutes = () => {
  const isLogin = useAuthStore((state) => state.isLogin)
  if (!isLogin) {
    window.location.href = BASE_URL
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

import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import GroupPageView from "../views/GroupPageView";
import GroupDetailView from "../views/GroupDetailView";
import Error404 from "../components/error/Error404";
import useAuthStore from "../store/auth.js";
const getLogin = useAuthStore.getState().isLogin

const checkLogin = () => {
  const getIsLogin = getLogin();
  return getIsLogin;
}

const GroupRoutes = () => 
  (
  <Routes>
    <Route path="/" element={<GroupPageView />} />
    <Route path="/:groupId/main/:fileId" element={<GroupDetailView />} />
    <Route path="/:groupId/overview/:fileId" element={<GroupDetailView />} />
    <Route path="/:groupId/:fileId" element={<GroupDetailView />} />
    <Route path="/:groupId/code/:fileId" element={<GroupDetailView />} />
    <Route path="/:groupId/time-overview/:fileId" element={<GroupDetailView />} />
    <Route path="*" element={<Error404 />} />
  </Routes>
)


export default GroupRoutes;

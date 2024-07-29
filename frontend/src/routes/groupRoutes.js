import React from "react";
import { Route, Routes } from "react-router-dom";
import GroupPageView from "../views/GroupPageView";
import GroupDetailView from "../views/GroupDetailView";
import Error404 from "../components/error/Error404";

const GroupRoutes = () => (
  <Routes>
    <Route path="/" element={<GroupPageView />} />
    <Route path="/:groupId/:pageId" element={<GroupDetailView />} />
    <Route path="*" element={<Error404 />} />{" "}
    {/* 모든 경로에 대해 404 페이지 처리 */}
  </Routes>
);

export default GroupRoutes;

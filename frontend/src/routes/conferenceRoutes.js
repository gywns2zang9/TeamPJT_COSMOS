import React from "react";
import { Route, Routes } from "react-router-dom";
import ConferenceView from "../views/ConferenceView";

const ConferenceRoutes = () => (
  <Routes>
    <Route path="/:groupId" element={<ConferenceView />} />
    <Route path="*" element={<ConferenceView />} />{" "}
    {/* 잘못된 경로 접근 시에도 ConferenceView를 렌더링 */}
  </Routes>
);

export default ConferenceRoutes;

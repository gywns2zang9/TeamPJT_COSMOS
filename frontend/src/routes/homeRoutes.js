import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "../views/HomeView";
import Error401 from "../components/error/Error401";
import Error403 from "../components/error/Error403";
import Error404 from "../components/error/Error404";

const HomeRoutes = () => (
    <Routes>
        <Route exact path="/" element={<HomeView />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} /> {/* 모든 경로에 대해 404 페이지 처리 */}
    </Routes>
);

export default HomeRoutes;

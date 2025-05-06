import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/page";
import LoginPage from "./pages/LoginPage/page";
import MyPage from "./pages/MyPage/page";
import ProtectedRoute from "./components/ProtectedRoute";
import RoadMapInputPage from "./pages/RoadMapInputPage/page";
import RoadMapPage from "./pages/RoadMapPage/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/roadmap/input" element={
          <ProtectedRoute>
            <RoadMapInputPage />
          </ProtectedRoute>
        } />
        <Route path="/roadmap/:id" element={
          <ProtectedRoute>
            <RoadMapPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

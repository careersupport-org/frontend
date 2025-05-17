import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthService } from './services/AuthService';
import MainPage from "./pages/MainPage/page";
import LoginPage from "./pages/LoginPage/page";
import KakaoCallback from "./pages/LoginPage/KakaoCallback";
import MyPage from "./pages/MyPage/page";
import ProtectedRoute from "./components/ProtectedRoute";
import RoadMapInputPage from "./pages/RoadMapInputPage/page";
import RoadMapPage from "./pages/RoadMapPage/page";
import MyRoadMapsPage from "./pages/MyRoadMapsPage/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
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
        <Route path="/my-roadmaps" element={<MyRoadMapsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

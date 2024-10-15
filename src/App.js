/* eslint-disable */
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import "tailwindcss/tailwind.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import InterviewTemplatePage from "./pages/InterviewTemplate";
import InterviewChatPage from "./pages/Interview";
import InterviewTemplateListPage from "./pages/TemplateList";
import CodeReviewIntoducePage from "./pages/CodeReviewIntroducePage";
function App() {
  return (

    <Routes>
      <Route>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/interview/template" element={<InterviewTemplatePage />} />
        <Route path="/interview/chat" element={<InterviewChatPage />} />
        <Route path="/interview/list" element={<InterviewTemplateListPage />} />
        <Route path="/code-review/introduce" element={<CodeReviewIntoducePage />} />
      </Route>
    </Routes>

  );
}

export default App;

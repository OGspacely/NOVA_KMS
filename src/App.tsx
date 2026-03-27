/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { BrowseArticles } from './pages/BrowseArticles.tsx';
import { ArticleView } from './pages/ArticleView.tsx';
import { ArticleEditor } from './pages/ArticleEditor.tsx';
import { ReviewPage } from './pages/ReviewPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { Analytics } from './pages/Analytics.tsx';
import { Resources } from './pages/Resources.tsx';
import { Settings } from './pages/Settings.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { SearchResults } from './pages/SearchResults.tsx';
import { Forum } from './pages/Forum.tsx';
import { ForumQuestion } from './pages/ForumQuestion.tsx';
import { Quizzes } from './pages/Quizzes.tsx';
import { Assignments } from './pages/Assignments.tsx';
import { AssignmentView } from './pages/AssignmentView.tsx';
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx';
import { TermsOfService } from './pages/TermsOfService.tsx';
import { Support } from './pages/Support.tsx';

import { Chatbot } from './pages/Chatbot.tsx';
import { Feedback } from './pages/Feedback.tsx';
import { MySubmissions } from './pages/MySubmissions.tsx';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/support" element={<Support />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<BrowseArticles />} />
            <Route path="resources" element={<Resources />} />
            <Route path="articles/:id" element={<ArticleView />} />
            <Route path="editor" element={<ArticleEditor />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="submissions" element={<MySubmissions />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="assignments/:id" element={<AssignmentView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


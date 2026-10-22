import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NewsroomProvider } from './context/NewsroomContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/editorial/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { SectionPage } from './pages/SectionPage';
import { AboutPage } from './pages/AboutPage';
import { EditorialStandardsPage } from './pages/EditorialStandardsPage';
import { LookCloserPage } from './pages/LookCloserPage';
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { EditorialLoginPage } from './pages/editorial/EditorialLoginPage';
import { EditorialDashboardPage } from './pages/editorial/EditorialDashboardPage';
import { StoryEditorPage } from './pages/editorial/StoryEditorPage';
import { ContributorsManagerPage } from './pages/editorial/ContributorsManagerPage';
import { InternalAssessmentPage } from './pages/editorial/InternalAssessmentPage';

export const App: React.FC = () => {
  return (
    <NewsroomProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-paper-100 text-ink-900 selection:bg-editorial-red selection:text-white">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                {/* Public Reader Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/latest" element={<SectionPage />} />
                <Route path="/long-reads" element={<SectionPage />} />
                <Route path="/short-stories" element={<SectionPage />} />
                <Route path="/section/:category" element={<SectionPage />} />
                <Route path="/multimedia" element={<SectionPage />} />
                <Route path="/story/:slug" element={<StoryDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/standards" element={<EditorialStandardsPage />} />
                <Route path="/look-closer" element={<LookCloserPage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Legacy redirect */}
                <Route path="/workspace" element={<Navigate to="/editorial" replace />} />

                {/* Editorial Suite Routes */}
                <Route path="/editorial/login" element={<EditorialLoginPage />} />
                <Route
                  path="/editorial"
                  element={
                    <ProtectedRoute>
                      <EditorialDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editorial/new"
                  element={
                    <ProtectedRoute>
                      <StoryEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editorial/edit/:id"
                  element={
                    <ProtectedRoute>
                      <StoryEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editorial/contributors"
                  element={
                    <ProtectedRoute>
                      <ContributorsManagerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editorial/internal"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <InternalAssessmentPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </NewsroomProvider>
  );
};

export default App;

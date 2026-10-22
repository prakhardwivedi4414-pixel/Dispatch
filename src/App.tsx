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
import { SearchPage } from './pages/SearchPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
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
                {/* 1. Public Reader Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/latest" element={<SectionPage />} />
                <Route path="/features" element={<SectionPage />} />
                <Route path="/long-reads" element={<Navigate to="/features?format=long-read" replace />} />
                <Route path="/short-stories" element={<Navigate to="/features?format=short" replace />} />
                
                {/* Categorical beats */}
                <Route path="/campus" element={<SectionPage />} />
                <Route path="/multimedia" element={<SectionPage />} />
                <Route path="/section/:category" element={<SectionPage />} />

                {/* Direct category beat redirects */}
                <Route path="/society" element={<Navigate to="/section/society" replace />} />
                <Route path="/culture" element={<Navigate to="/section/culture" replace />} />
                <Route path="/investigations" element={<Navigate to="/section/investigations" replace />} />

                {/* Article Reader: Support both /article/:slug and /story/:slug seamlessly */}
                <Route path="/article/:slug" element={<StoryDetailPage />} />
                <Route path="/story/:slug" element={<StoryDetailPage />} />

                {/* Newsroom Info & Transparency */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/standards" element={<EditorialStandardsPage />} />
                <Route path="/editorial-standards" element={<Navigate to="/standards" replace />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Authentication & Profile Routes */}
                <Route path="/login" element={<EditorialLoginPage />} />
                <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Administrator Dashboard & Editorial Management (Restricted solely to Samridhi) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <EditorialDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/articles"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <EditorialDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/new"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <StoryEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/edit/:id"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <StoryEditorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/contributors"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <ContributorsManagerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/internal"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <InternalAssessmentPage />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy Aliases & Redirects */}
                <Route path="/workspace" element={<Navigate to="/admin" replace />} />
                <Route path="/look-closer" element={<Navigate to="/features" replace />} />
                <Route path="/editorial/login" element={<Navigate to="/login" replace />} />
                <Route path="/editorial" element={<Navigate to="/admin" replace />} />
                <Route path="/editorial/new" element={<Navigate to="/admin/new" replace />} />
                <Route path="/editorial/edit/:id" element={<Navigate to="/admin" replace />} />
                <Route path="/editorial/contributors" element={<Navigate to="/admin/contributors" replace />} />

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

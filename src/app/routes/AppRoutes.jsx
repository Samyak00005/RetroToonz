import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout.jsx";
import RequireAdmin from "./RequireAdmin.jsx";

import AddShowPage from "../../pages/admin/AddShowPage.jsx";
import AnalyticsPage from "../../pages/admin/AnalyticsPage.jsx";
import ContentHealthPage from "../../pages/admin/ContentHealthPage.jsx";
import DashboardPage from "../../pages/admin/DashboardPage.jsx";
import EpisodesPage from "../../pages/admin/EpisodesPage.jsx";
import HomepageSectionsPage from "../../pages/admin/HomepageSectionsPage.jsx";
import SettingsPage from "../../pages/admin/SettingsPage.jsx";
import ShowsPage from "../../pages/admin/ShowsPage.jsx";
import UsersPage from "../../pages/admin/UsersPage.jsx";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage.jsx";
import LoginPage from "../../pages/auth/LoginPage.jsx";
import SignupPage from "../../pages/auth/SignupPage.jsx";
import AllShowsPage from "../../pages/public/AllShowsPage.jsx";
import HomePage from "../../pages/public/HomePage.jsx";
import SearchResultsPage from "../../pages/public/SearchResultsPage.jsx";
import ShowDetailsPage from "../../pages/public/ShowDetailsPage.jsx";
import VideoPlayerPage from "../../pages/public/VideoPlayerPage.jsx";
import AboutPage from "../../pages/public/AboutPage.jsx";
import ComingSoonPage from "../../pages/public/ComingSoonPage.jsx";
import ErrorPage from "../../pages/public/ErrorPage.jsx";
import UserProfilePage from "../../pages/account/UserProfilePage.jsx";
import WatchlistPage from "../../pages/account/WatchlistPage.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";

export default function AppRoutes() {
  const location = useLocation();
  const transitionKey = location.pathname.startsWith("/watch/")
    ? "/watch"
    : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={transitionKey}>
        <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/all-shows" element={<AllShowsPage />} />
      <Route path="/show/:id" element={<ShowDetailsPage />} />
      <Route path="/watch/:id/:episodeId" element={<VideoPlayerPage />} />
      <Route path="/watch/:id" element={<VideoPlayerPage />} />
      <Route path="/comingsoon" element={<ComingSoonPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/about-us" element={<AboutPage />} />

      <Route path="/admin-profile" element={<Navigate to="/profile" replace />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="add-show" element={<AddShowPage />} />
        <Route path="episodes" element={<EpisodesPage />} />
        <Route path="homepage-section" element={<HomepageSectionsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="content-health" element={<ContentHealthPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

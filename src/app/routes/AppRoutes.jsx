import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout.jsx";
import RequireAdmin from "./RequireAdmin.jsx";
import PageTransition from "../../components/common/PageTransition.jsx";
import RouteLoadingFallback from "../../components/common/RouteLoadingFallback.jsx";

const AddShowPage = lazy(() => import("../../pages/admin/AddShowPage.jsx"));
const AnalyticsPage = lazy(() => import("../../pages/admin/AnalyticsPage.jsx"));
const ContentHealthPage = lazy(() => import("../../pages/admin/ContentHealthPage.jsx"));
const DashboardPage = lazy(() => import("../../pages/admin/DashboardPage.jsx"));
const EpisodesPage = lazy(() => import("../../pages/admin/EpisodesPage.jsx"));
const HomepageSectionsPage = lazy(() => import("../../pages/admin/HomepageSectionsPage.jsx"));
const SettingsPage = lazy(() => import("../../pages/admin/SettingsPage.jsx"));
const ShowsPage = lazy(() => import("../../pages/admin/ShowsPage.jsx"));
const UsersPage = lazy(() => import("../../pages/admin/UsersPage.jsx"));
const ForgotPasswordPage = lazy(() => import("../../pages/auth/ForgotPasswordPage.jsx"));
const LoginPage = lazy(() => import("../../pages/auth/LoginPage.jsx"));
const SignupPage = lazy(() => import("../../pages/auth/SignupPage.jsx"));
const AllShowsPage = lazy(() => import("../../pages/public/AllShowsPage.jsx"));
const HomePage = lazy(() => import("../../pages/public/HomePage.jsx"));
const SearchResultsPage = lazy(() => import("../../pages/public/SearchResultsPage.jsx"));
const ShowDetailsPage = lazy(() => import("../../pages/public/ShowDetailsPage.jsx"));
const VideoPlayerPage = lazy(() => import("../../pages/public/VideoPlayerPage.jsx"));
const AboutPage = lazy(() => import("../../pages/public/AboutPage.jsx"));
const ComingSoonPage = lazy(() => import("../../pages/public/ComingSoonPage.jsx"));
const ErrorPage = lazy(() => import("../../pages/public/ErrorPage.jsx"));
const UserProfilePage = lazy(() => import("../../pages/account/UserProfilePage.jsx"));
const WatchlistPage = lazy(() => import("../../pages/account/WatchlistPage.jsx"));

export default function AppRoutes() {
  const location = useLocation();
  const transitionKey = location.pathname.startsWith("/watch/")
    ? "/watch"
    : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={transitionKey}>
        <Suspense fallback={<RouteLoadingFallback />}>
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
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

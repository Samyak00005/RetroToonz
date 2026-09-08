import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter } from "react-router-dom";

import NavigationProgress from "../components/common/NavigationProgress.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import ToastHost from "../components/common/ToastHost.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <div className="rt-app">
      <BrowserRouter>
        <NavigationProgress />
        <ScrollToTop />
        <AppRoutes />
        <ToastHost />
        <SpeedInsights />
      </BrowserRouter>
    </div>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Setiap kali path URL berubah, scroll halaman kembali ke atas secara instan.
 * Pasang komponen ini sekali di dalam <Router> (di App.jsx).
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;

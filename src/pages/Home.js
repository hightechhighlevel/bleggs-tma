import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";
import "../fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { browserName } from "react-device-detect";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";

const tele = window.Telegram.WebApp;
const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  // eslint-disable-next-line
  // const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [restrictAccess, setRestrictAccess] = useState(false);
  const { hider, setHider, tab, setTab, hasVisitedBefore } = useUser();
  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedBefore");
    if (tab === "Splash" && window.location.pathname === "/") {
      navigate("/splash");
      setHider(true);
      setTab("Home")
    }
  }, []);
  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey && (event.key === "u" || event.key === "s")) ||
        (event.ctrlKey && event.shiftKey && event.key === "i")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    tele.ready();
    tele.expand();
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    window.Telegram.WebApp.setHeaderColor("#000"); // Set header color to red

    // Haptic feedback
    if (tele.HapticFeedback) {
      tele.HapticFeedback.impactOccurred("medium");
    }
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms
    }
  }, []);

  const overflow = 100;
  const scrollableEl = useRef(null);

  useEffect(() => {
    const isDashboardRoute =
      location.pathname.startsWith("/dashboardAdx") ||
      location.pathname.startsWith("/dashboard");
    /* Detect Device */
    // const restrictedBrowsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Thor', 'Brave'];
    // const isTelegramApp = tele && tele.initDataUnsafe && tele.initDataUnsafe.query_id;
    // // Check if the user is on a browser but using Telegram (by checking for a Telegram UserAgent)
    // const isTelegramBrowser = navigator.userAgent.includes("Telegram");

    // if (
    //   (isDashboardRoute && !restrictedBrowsers.includes(browserName)) || // Block restricted browsers
    //   (isTelegramBrowser && isTelegramApp) // Block Telegram access from a browser
    // ) {
    //   setRestrictAccess(true);
    // }

    if (isDashboardRoute) {
      if (!loading)
        document.getElementById("footermain").style.display = "none";
    }

    if (!isDashboardRoute) {
      document.body.style.overflowY = "hidden";
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = `${window.innerHeight + overflow}px`;
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);

      let ts;

      const onTouchStart = (e) => {
        ts = e.touches[0].clientY;
      };

      const onTouchMove = (e) => {
        const el = scrollableEl.current;
        if (el) {
          const scroll = el.scrollTop;
          const te = e.changedTouches[0].clientY;
          if (scroll <= 0 && ts < te) {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      };

      const onTouchMoveWithException = (e) => {
        const target = e.target.closest("#refer");
        if (!target) {
          onTouchMove(e);
        }
      };

      document.documentElement.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      document.documentElement.addEventListener(
        "touchmove",
        onTouchMoveWithException,
        { passive: false }
      );

      // Cleanup event listeners on component unmount
      return () => {
        document.documentElement.removeEventListener(
          "touchstart",
          onTouchStart
        );
        document.documentElement.removeEventListener(
          "touchmove",
          onTouchMoveWithException
        );
      };
    }
  }, [location.pathname, overflow, loading]);

  if (loading) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex justify-center h-[100vh]">
        <div className="flex flex-col space-y-3 w-full">
          <AnimatePresence mode="wait">
            {restrictAccess ? (
              <>
                <div className="w-full flex h-full justify-center px-5 items-center font-medium text-[20px]">
                  <div className="w-full pt-24 text-center flex flex-col space-y-3 justify-center items-center">
                    <p className="text-[28px] font-semibold">
                      Mobile rocks for gaming 😎 Open on your mobile device to
                      play now!
                    </p>
                    <img src="/stars.svg" alt="stars" className="w-[200px]" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Outlet />

                <div
                  id="footermain"
                  className={`${
                    loading || hider ? "hidden" : "flex"
                  } z-30 flex-col bg-[#000] fixed bottom-0 pt-3 pb-6 left-0 right-0 justify-center items-center px-3`}
                >
                  <Footer />

                  <div className="bg-[#000] z-20 h-[67px] w-full fixed bottom-0 left-0 right-0 "></div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Home;

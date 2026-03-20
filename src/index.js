import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import NotAdmin236 from "./pages/NotAdmin236";
import { AuthContextProvider } from "./context/AuthContext";
import Leaderboard from "./pages/Leaderboard";
import DailyCheckIn from "./pages/Checkin";
import CryptoFarming from "./pages/Farm";
import Airdrop from "./pages/Airdrop";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import EditTasks from "./pages/admin/EditTasks";
import ExtrenalTasks from "./pages/admin/ExtrenalTasks";
import AdminAdvertTasks from "./pages/admin/AdminAdvertTasks";
import AirdropWallets from "./pages/admin/AdminWallets";
import Search from "./pages/admin/Search";
import Statistics from "./pages/admin/Statistics";
import AdminRanks from "./pages/admin/AdminRanks";
import AdminYoutube from "./pages/admin/AdminYoutube";
import AlphaDogs from "./pages/AlphaDogs";
import AdminFollow from "./Components/AdminFollow";

import { Web3ModalProvider } from "./context/Web3ModalProvider";
import { PurchaseProvider } from "./context/PurchaseProvider";
import ErrorBoundary from "./Components/ErrorBoundary";
import { UserProvider } from "./context/userContext";
import Splash from "./pages/Splash";
import Levels from "./pages/admin/Levels";
import BoostPowerAdmin from "./pages/admin/BoostPower";
import BoostTimeAdmin from "./pages/admin/BoostTime";
import BoostRankAdmin from "./pages/admin/BoostRank";
import UpgradePowerAdmin from "./pages/admin/UpgradePower";
import UpgradeTimeAdmin from "./pages/admin/UpgradeTime";
import FollowTaskApprove from "./pages/admin/FollowTaskApprove";
import DailyCheckAdmin from "./pages/admin/DailyCheck";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Web3ModalProvider>
        <PurchaseProvider>
          <UserProvider>
            <Home />
          </UserProvider>
        </PurchaseProvider>
      </Web3ModalProvider>
    ),
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/",
        element: <AlphaDogs />,
      },
      {
        path: "/ref",
        element: <Ref />,
      },
      {
        path: "/airdrop",
        element: <Airdrop />,
      },
      
      {
        path: "/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/checkin",
        element: <DailyCheckIn />,
      },
      {
        path: "/earn",
        element: <CryptoFarming />,
      },
      {
        path: "/dashboardlogin",
        element: <NotAdmin236 />,
      },
      {
        path: "/splash",
        element: <Splash />,
      },
    ],
  },
  {
    path: "/dashboardAdx",
    element: <Dashboard />,
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/dashboardAdx/settings",
        element: <Settings />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/dailycheck",
        element: <DailyCheckAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/managetasks",
        element: <EditTasks />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/externaltasks",
        element: <ExtrenalTasks />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/promo",
        element: <AdminAdvertTasks />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/youtube",
        element: <AdminYoutube />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/follow",
        element: <AdminFollow />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/airdroplist",
        element: <AirdropWallets />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/ranks",
        element: <AdminRanks />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/search",
        element: <Search />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/stats",
        element: <Statistics />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/levels",
        element: <Levels />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/boostpower",
        element: <BoostPowerAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/boosttime",
        element: <BoostTimeAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/upgradepower",
        element: <UpgradePowerAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/upgradetime",
        element: <UpgradeTimeAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/boostrank",
        element: <BoostRankAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/dashboardAdx/followapprove",
        element: <FollowTaskApprove />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    {/* <Web3ModalProvider>
      <PurchaseProvider> */}
    {/* <React.StrictMode> */}
      <RouterProvider router={router} />
    {/* </React.StrictMode> */}
    {/* </PurchaseProvider>
    </Web3ModalProvider> */}
  </AuthContextProvider>
);

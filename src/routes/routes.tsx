import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";
import LoginPage from "../pages/LoginPage";
import RoutesPage from "../pages/RoutesPage";
import ActiveRoutePage from "../pages/ActiveRoutePage";
import RegisterFarmerPage from "../pages/RegisterFarmerPage";
import InfoPage from "../pages/InfoPage";
import PickupList from "../pages/PickupList";
import FullMapPage from "../pages/FullMapPage";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "/routes",
        index: true,
        element: <RoutesPage />,
      },
      {
        path: "/activeRoute/:routeId",
        element: <ActiveRoutePage />,
      },
      {
        path: "/registerFarmer",
        element: <RegisterFarmerPage />,
      },
      {
        path: "/infoPage",
        element: <InfoPage />,
      },
      {
        path: "/pickupList",
        element: <PickupList />,
      },
      {
        path: "/fullMap",
        element: <FullMapPage />,
      },
    ],
  },
]);

export default router;

import { useLocation } from "react-router-dom";
import type { Route } from "../hooks/useFetchRoutes";
import MapLibreComponent from "../components/MapLibre/MapLibreComponent";

const FullMapPage = () => {
  const { state } = useLocation();
  const route: Route = state?.route;
  const currentStop = state?.currentStop;

  return (
    <div className="h-full w-full">
      <MapLibreComponent route={route} currentStop={currentStop} />
    </div>
  );
};

export default FullMapPage;

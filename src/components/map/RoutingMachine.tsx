import leaflet, { type ControlOptions, LatLng } from "leaflet";
import "leaflet-routing-machine";
import { DepotMarker } from "../waypointMarkers/DepotMarker";
import { WaypointMarker } from "../waypointMarkers/WaypointMarker";
import { createControlComponent } from "@react-leaflet/core";

interface Props extends ControlOptions {
  wayPoints: LatLng[];
  pathStyle: object;
}

const createRoutingMachineLayer = ({ wayPoints, pathStyle }: Props) => {
  const plan = leaflet.Routing.plan(wayPoints, {
    createMarker: (
      waypointIndex: number,
      waypoint: { latLng: LatLng },
      noOfWaypoints: number
    ) => {
      const lastIndex = noOfWaypoints - 1;

      // Hide last waypoint marker (end of route)
      if (waypointIndex === lastIndex) {
        return false;
      }

      // First waypoint - Depot marker
      if (waypointIndex === 0) {
        return leaflet.marker(waypoint.latLng, {
          icon: DepotMarker,
        });
      }

      // Numbered waypoint markers for stops
      return leaflet.marker(waypoint.latLng, {
        icon: WaypointMarker(waypointIndex),
      });
    },
  });

  const instance = leaflet.Routing.control({
    plan,
    waypoints: wayPoints,
    lineOptions: {
      styles: [{ color: "white", weight: 7, opacity: 1 }, pathStyle],
      extendToWaypoints: true,
      missingRouteTolerance: 100,
    },
    show: false,
    addWaypoints: false,
    fitSelectedRoutes: false,
    showAlternatives: false,
  });

  // Hide routing instructions panel
  instance.on("routesfound", function () {
    const container = instance.getContainer();
    if (container) {
      container.style.display = "none";
    }
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;

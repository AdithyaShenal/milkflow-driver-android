// import type { Route, Stop } from "../../hooks/useFetchRoutes";
// import leaflet from "leaflet";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
// import { Geolocation } from "@capacitor/geolocation";
// import { Motion } from "@capacitor/motion";
// import RoutingMachine from "./RoutingMachine";
// import { CurrentLocationIcon } from "../waypointMarkers/CurrentLocationMarker";

// interface Props {
//   route: Route;
//   currentStop: Stop | null;
// }
// const depotCoordinates = { lat: 7.019041, lon: 79.969565 };

// // Component to center map on current location
// function MapCenterUpdater({ center }: { center: leaflet.LatLng | null }) {
//   const map = useMap();

//   useEffect(() => {
//     if (center) {
//       map.setView(center, 19, { animate: true });
//     }
//   }, [center, map]);

//   return null;
// }

// const MapComponent = ({ route, currentStop }: Props) => {
//   const [currentPosition, setCurrentPosition] = useState<leaflet.LatLng | null>(
//     null
//   );
//   const [heading, setHeading] = useState<number>(0);
//   const watchIdRef = useRef<string | null>(null);

//   // Request Sensors access permission---------------------------------------------------
//   // ------------------------------------------------------------------------------------
//   useEffect(() => {
//     const requestMotionPermission = async () => {
//       try {
//         if (
//           typeof DeviceMotionEvent !== "undefined" &&
//           typeof (DeviceMotionEvent as any).requestPermission === "function"
//         ) {
//           const res = await (DeviceMotionEvent as any).requestPermission();
//           if (res !== "granted") {
//             console.warn("Motion permission denied");
//           }
//         }
//       } catch (err) {
//         console.error("Motion permission error", err);
//       }
//     };

//     requestMotionPermission();
//   }, []);

//   // Create route waypoints from stops ---------------------------------------------------
//   // -------------------------------------------------------------------------------------

//   useEffect(() => {
//     let listener: any;

//     const startCompass = async () => {
//       try {
//         listener = await Motion.addListener("orientation", (event) => {
//           if (event.alpha != null) {
//             // Convert to map-friendly heading
//             const newHeading = (360 - event.alpha) % 360;

//             // Simple smoothing to avoid jitter
//             setHeading((prev) => {
//               const diff = ((newHeading - prev + 540) % 360) - 180;
//               return prev + diff * 0.15;
//             });
//           }
//         });
//       } catch (err) {
//         console.error("Compass error", err);
//       }
//     };

//     startCompass();

//     return () => {
//       listener?.remove();
//     };
//   }, []);

//   // Create route waypoints from stops ---------------------------------------------------
//   // -------------------------------------------------------------------------------------
//   const routeWaypoints = useMemo(() => {
//     if (!route || !route.stops) return [];

//     return route.stops.map((stop) => {
//       if (!stop.production) {
//         return leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);
//       }

//       const location = stop.production.farmer.location;
//       return leaflet.latLng(location.lat, location.lon);
//     });
//   }, [route]);

//   // Create route waypoints from stops
//   const currentStopRouteWaypoints = useMemo(() => {
//     if (!currentStop) return;

//     const location = currentStop.production?.farmer.location;

//     if (location) return leaflet.latLng(location.lat, location.lon);
//   }, [currentStop]);

//   // Start GPS tracking
//   useEffect(() => {
//     let isActive = true;

//     const startTracking = async () => {
//       try {
//         // Check and request permissions
//         const permission = await Geolocation.checkPermissions();
//         if (permission.location !== "granted") {
//           const request = await Geolocation.requestPermissions();
//           if (request.location !== "granted") {
//             console.error("Location permission denied");
//             return;
//           }
//         }

//         // Watch position updates
//         watchIdRef.current = await Geolocation.watchPosition(
//           {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0,
//           },
//           (position, err) => {
//             if (err) {
//               console.error("Error getting position:", err);
//               return;
//             }

//             if (position && isActive) {
//               const newPos = leaflet.latLng(
//                 position.coords.latitude,
//                 position.coords.longitude
//               );
//               setCurrentPosition(newPos);

//               // Update heading if available
//               if (
//                 position.coords.heading !== null &&
//                 position.coords.heading !== undefined
//               ) {
//                 setHeading(position.coords.heading);
//               }
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Error starting location tracking:", error);
//       }
//     };

//     startTracking();

//     // Cleanup
//     return () => {
//       isActive = false;
//       if (watchIdRef.current) {
//         Geolocation.clearWatch({ id: watchIdRef.current });
//       }
//     };
//   }, []);

//   const mapCenter =
//     currentPosition ||
//     leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);

//   return (
//     <div className="h-full w-full">
//       <MapContainer
//         className="h-full"
//         center={mapCenter}
//         zoom={19}
//         scrollWheelZoom={true}
//       >
//         <TileLayer
//           attribution="&copy Mapbox"
//           url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
//         />

//         {/* Route with waypoints */}
//         <RoutingMachine
//           pathStyle={{ color: "#4285F4", weight: 4, opacity: 0.6 }}
//           wayPoints={routeWaypoints}
//           key={JSON.stringify(routeWaypoints)}
//         />

//         {currentPosition && currentStopRouteWaypoints && (
//           <RoutingMachine
//             wayPoints={[currentPosition, currentStopRouteWaypoints]}
//             pathStyle={{ color: "#4285F4", weight: 4 }}
//             key={`next-route-${currentPosition.lat}-${currentPosition.lng}`}
//           />
//         )}

//         {/* Current location marker */}
//         {currentPosition && (
//           <Marker
//             position={currentPosition}
//             icon={CurrentLocationIcon(heading)}
//             key={`marker-${heading}`}
//           />
//         )}

//         <MapCenterUpdater center={currentPosition} />
//       </MapContainer>
//     </div>
//   );
// };

// export default MapComponent;

// import type { Route, Stop } from "../../hooks/useFetchRoutes";
// import leaflet from "leaflet";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
// import { Geolocation } from "@capacitor/geolocation";
// import { Motion } from "@capacitor/motion";
// import RoutingMachine from "./RoutingMachine";
// import { CurrentLocationIcon } from "../waypointMarkers/CurrentLocationMarker";

// interface Props {
//   route: Route;
//   currentStop: Stop | null;
// }

// const depotCoordinates = { lat: 7.019041, lon: 79.969565 };

// function MapCenterUpdater({ center }: { center: leaflet.LatLng | null }) {
//   const map = useMap();

//   useEffect(() => {
//     if (center) {
//       map.setView(center, 19, { animate: true });
//     }
//   }, [center, map]);

//   return null;
// }

// const MapComponent = ({ route, currentStop }: Props) => {
//   const [currentPosition, setCurrentPosition] = useState<leaflet.LatLng | null>(
//     null
//   );

//   const [heading, setHeading] = useState(0);

//   const watchIdRef = useRef<string | null>(null);

//   /* =========================================================
//      1️⃣ REQUEST MOTION PERMISSION (ONCE, ON SCREEN OPEN)
//      ========================================================= */
//   useEffect(() => {
//     const requestMotionPermission = async () => {
//       try {
//         if (
//           typeof DeviceMotionEvent !== "undefined" &&
//           typeof (DeviceMotionEvent as any).requestPermission === "function"
//         ) {
//           const res = await (DeviceMotionEvent as any).requestPermission();
//           if (res !== "granted") {
//             console.warn("Motion permission denied");
//           }
//         }
//       } catch (err) {
//         console.error("Motion permission error", err);
//       }
//     };

//     requestMotionPermission();
//   }, []);

//   /* =========================================================
//      2️⃣ COMPASS HEADING (DEVICE ORIENTATION ONLY)
//      ========================================================= */
//   useEffect(() => {
//     let listener: any;

//     const startCompass = async () => {
//       try {
//         listener = await Motion.addListener("orientation", (event) => {
//           if (event.alpha != null) {
//             // Convert to map-friendly heading
//             const COMPASS_OFFSET = 90;

//             const newHeading = (360 - event.alpha + COMPASS_OFFSET) % 360;

//             // Simple smoothing to avoid jitter
//             setHeading((prev) => {
//               const diff = ((newHeading - prev + 540) % 360) - 180;
//               return prev + diff * 0.15;
//             });
//           }
//         });
//       } catch (err) {
//         console.error("Compass error", err);
//       }
//     };

//     startCompass();

//     return () => {
//       listener?.remove();
//     };
//   }, []);

//   /* =========================================================
//      3️⃣ GPS POSITION (LOCATION ONLY — NO HEADING)
//      ========================================================= */
//   useEffect(() => {
//     let isActive = true;

//     const startTracking = async () => {
//       const permission = await Geolocation.checkPermissions();
//       if (permission.location !== "granted") {
//         const req = await Geolocation.requestPermissions();
//         if (req.location !== "granted") return;
//       }

//       watchIdRef.current = await Geolocation.watchPosition(
//         { enableHighAccuracy: true },
//         (pos, err) => {
//           if (!pos || err || !isActive) return;

//           setCurrentPosition(
//             leaflet.latLng(pos.coords.latitude, pos.coords.longitude)
//           );
//         }
//       );
//     };

//     startTracking();

//     return () => {
//       isActive = false;
//       if (watchIdRef.current) {
//         Geolocation.clearWatch({ id: watchIdRef.current });
//       }
//     };
//   }, []);

//   /* =========================================================
//      4️⃣ ROUTE WAYPOINTS
//      ========================================================= */
//   const routeWaypoints = useMemo(() => {
//     if (!route?.stops) return [];

//     return route.stops.map((stop) => {
//       if (!stop.production) {
//         return leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);
//       }

//       const loc = stop.production.farmer.location;
//       return leaflet.latLng(loc.lat, loc.lon);
//     });
//   }, [route]);

//   const currentStopWaypoint = useMemo(() => {
//     if (!currentStop?.production) return null;
//     const loc = currentStop.production.farmer.location;
//     return leaflet.latLng(loc.lat, loc.lon);
//   }, [currentStop]);

//   const mapCenter =
//     currentPosition ??
//     leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);

//   /* =========================================================
//      5️⃣ RENDER MAP
//      ========================================================= */
//   return (
//     <div className="h-full w-full">
//       <MapContainer
//         className="h-full"
//         center={mapCenter}
//         zoom={19}
//         scrollWheelZoom
//       >
//         <TileLayer
//           attribution="&copy; Mapbox"
//           url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
//         />

//         <RoutingMachine
//           wayPoints={routeWaypoints}
//           pathStyle={{ color: "#4285F4", weight: 4, opacity: 0.6 }}
//           key={JSON.stringify(routeWaypoints)}
//         />

//         {currentPosition && currentStopWaypoint && (
//           <RoutingMachine
//             wayPoints={[currentPosition, currentStopWaypoint]}
//             pathStyle={{ color: "#4285F4", weight: 4 }}
//           />
//         )}

//         {currentPosition && (
//           <Marker
//             position={currentPosition}
//             icon={CurrentLocationIcon(heading)}
//             key={`marker-${Math.round(heading)}`}
//           />
//         )}

//         <MapCenterUpdater center={currentPosition} />
//       </MapContainer>
//     </div>
//   );
// };

// export default MapComponent;

import type { Route, Stop } from "../../hooks/useFetchRoutes";
import leaflet from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { Motion } from "@capacitor/motion";
import RoutingMachine from "./RoutingMachine";
import { CurrentLocationIcon } from "../waypointMarkers/CurrentLocationMarker";
import { Button } from "konsta/react";

interface Props {
  route: Route;
  currentStop: Stop | null;
}

const depotCoordinates = { lat: 7.019041, lon: 79.969565 };

function MapCenterUpdater({ center }: { center: leaflet.LatLng | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 19, { animate: true });
    }
  }, [center, map]);

  return null;
}

const MapComponent = ({ route, currentStop }: Props) => {
  const [currentPosition, setCurrentPosition] = useState<leaflet.LatLng | null>(
    null
  );

  const [heading, setHeading] = useState(0);
  const [gpsHeading, setGpsHeading] = useState<number | null>(null);

  const watchIdRef = useRef<string | null>(null);

  /* =========================================================
     1️⃣ REQUEST MOTION PERMISSION (ONCE, ON SCREEN OPEN)
     ========================================================= */
  useEffect(() => {
    const requestMotionPermission = async () => {
      try {
        if (
          typeof DeviceMotionEvent !== "undefined" &&
          typeof (DeviceMotionEvent as any).requestPermission === "function"
        ) {
          const res = await (DeviceMotionEvent as any).requestPermission();
          if (res !== "granted") {
            console.warn("Motion permission denied");
          }
        }
      } catch (err) {
        console.error("Motion permission error", err);
      }
    };

    requestMotionPermission();
  }, []);

  /* =========================================================
     2️⃣ COMPASS HEADING (DEVICE ORIENTATION)
     ========================================================= */
  useEffect(() => {
    let listener: any;

    const startCompass = async () => {
      try {
        listener = await Motion.addListener("orientation", (event) => {
          if (event.alpha != null) {
            // Only use compass if GPS heading is not available
            if (gpsHeading === null) {
              // For most devices, alpha goes 0-360 where:
              // 0/360 = North, 90 = East, 180 = South, 270 = West
              // We need to invert it for proper map alignment
              const compassHeading = (360 - event.alpha) % 360;

              // Simple smoothing to avoid jitter
              setHeading((prev) => {
                const diff = ((compassHeading - prev + 540) % 360) - 180;
                return prev + diff * 0.2;
              });
            }
          }
        });
      } catch (err) {
        console.error("Compass error", err);
      }
    };

    startCompass();

    return () => {
      listener?.remove();
    };
  }, [gpsHeading]);

  /* =========================================================
     3️⃣ GPS POSITION WITH HEADING (PREFERRED WHEN AVAILABLE)
     ========================================================= */
  useEffect(() => {
    let isActive = true;

    const startTracking = async () => {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== "granted") {
        const req = await Geolocation.requestPermissions();
        if (req.location !== "granted") return;
      }

      watchIdRef.current = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        (pos, err) => {
          if (!pos || err || !isActive) return;

          setCurrentPosition(
            leaflet.latLng(pos.coords.latitude, pos.coords.longitude)
          );

          // Prefer GPS heading when moving (more accurate than compass)
          if (
            pos.coords.heading !== null &&
            pos.coords.heading !== undefined &&
            pos.coords.speed !== null &&
            pos.coords.speed > 0.5 // Only use GPS heading when moving > 0.5 m/s
          ) {
            setGpsHeading(pos.coords.heading);
            setHeading(pos.coords.heading);
          } else {
            setGpsHeading(null); // Fall back to compass when stationary
          }
        }
      );
    };

    startTracking();

    return () => {
      isActive = false;
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, []);

  /* =========================================================
     4️⃣ ROUTE WAYPOINTS
     ========================================================= */
  const routeWaypoints = useMemo(() => {
    if (!route?.stops) return [];

    return route.stops.map((stop) => {
      if (!stop.production) {
        return leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);
      }

      const loc = stop.production.farmer.location;
      return leaflet.latLng(loc.lat, loc.lon);
    });
  }, [route]);

  const currentStopWaypoint = useMemo(() => {
    if (!currentStop?.production) return null;
    const loc = currentStop.production.farmer.location;
    return leaflet.latLng(loc.lat, loc.lon);
  }, [currentStop]);

  const mapCenter =
    currentPosition ??
    leaflet.latLng(depotCoordinates.lat, depotCoordinates.lon);

  /* =========================================================
     5️⃣ RENDER MAP
     ========================================================= */
  return (
    <div className="h-full w-full">
      <Button>Navigate</Button>
      <MapContainer
        className="h-full"
        center={mapCenter}
        zoom={19}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; Mapbox"
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
        />

        <RoutingMachine
          wayPoints={routeWaypoints}
          pathStyle={{ color: "#4285F4", weight: 4, opacity: 0.6 }}
          key={JSON.stringify(routeWaypoints)}
        />

        {currentPosition && currentStopWaypoint && (
          <RoutingMachine
            wayPoints={[currentPosition, currentStopWaypoint]}
            pathStyle={{ color: "#4285F4", weight: 4 }}
          />
        )}

        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={CurrentLocationIcon(heading)}
            key={`marker-${Math.round(heading)}`}
          />
        )}

        <MapCenterUpdater center={currentPosition} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;

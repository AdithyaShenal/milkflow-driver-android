import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Geolocation } from "@capacitor/geolocation";
import { Motion } from "@capacitor/motion";
import type { Route, Stop } from "../../hooks/useFetchRoutes";
import { Locate, Navigation2, Navigation2Off } from "lucide-react";
import useGetDepotLocation from "../../hooks/useGetDepotLocation";
import { Block } from "konsta/react";
import LoadingPage from "../../pages/LoadingPage";

interface Props {
  route: Route;
  currentStop: Stop | null;
}

const MapLibreComponent = ({ route, currentStop }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [heading, setHeading] = useState(0);
  const [isNavMode, setIsNavMode] = useState(false);

  const {
    data: depotLocation,
    isError,
    error,
    isLoading,
  } = useGetDepotLocation();

  const DEPOT_COORDS: [number, number] = depotLocation
    ? [depotLocation.lon, depotLocation.lat]
    : [80.545207, 5.95948];

  const osmStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      { id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 },
    ],
  };

  const getStopCoords = (stop: Stop): [number, number] => {
    if (!stop.production?.farmer?.location) return DEPOT_COORDS;
    return [
      stop.production.farmer.location.lon,
      stop.production.farmer.location.lat,
    ];
  };

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: osmStyle,
      center: DEPOT_COORDS,
      zoom: 14,
      attributionControl: false,
    });

    map.current.on("load", () => {
      map.current?.resize();
      setupLayers();
      if (route) updateRoadRoute(route);
    });

    return () => map.current?.remove();
  }, []);

  const setupLayers = () => {
    if (!map.current) return;

    // --- 1. FULL OVERVIEW ROUTE (Blue) ---
    map.current.addSource("route-line-source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });
    map.current.addLayer({
      id: "route-line",
      type: "line",
      source: "route-line-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#3b82f6", "line-width": 5, "line-opacity": 0.4 },
    });

    // --- 2. ACTIVE NAVIGATION PATH (Red) ---
    // This is now ALWAYS visible as long as currentPosition and currentStop exist
    map.current.addSource("nav-path-source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });
    map.current.addLayer({
      id: "nav-path",
      type: "line",
      source: "nav-path-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#ef4444", "line-width": 8, "line-opacity": 1 },
    });

    // --- 3. STOPS ---
    map.current.addSource("stops", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    map.current.addLayer({
      id: "stop-circles",
      type: "circle",
      source: "stops",
      paint: {
        "circle-radius": 14,
        "circle-color": "#2563eb",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
    map.current.addLayer({
      id: "stop-labels",
      type: "symbol",
      source: "stops",
      layout: {
        "text-field": ["get", "index"],
        "text-font": ["Open Sans Regular"],
        "text-size": 12,
        "text-allow-overlap": true,
      },
      paint: { "text-color": "#ffffff" },
    });

    // --- 4. USER ICON ---
    map.current.addSource("me", {
      type: "geojson",
      data: { type: "Point", coordinates: [0, 0] },
    });
    map.current.addLayer({
      id: "me-direction",
      type: "symbol",
      source: "me",
      layout: {
        "text-field": "▲",
        "text-size": 25,
        "text-rotate": ["get", "bearing"],
        "text-rotation-alignment": "map",
        "text-allow-overlap": true,
      },
      paint: {
        "text-color": "#10b981",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    });
  };

  const updateRoadRoute = async (routeData: Route) => {
    if (!map.current || !routeData?.stops || routeData.stops.length < 2) return;
    const coords = routeData.stops
      .map((s) => `${getStopCoords(s)[0]},${getStopCoords(s)[1]}`)
      .join(";");

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const json = await response.json();
      if (json.routes?.[0]) {
        (
          map.current.getSource("route-line-source") as maplibregl.GeoJSONSource
        ).setData({
          type: "Feature",
          properties: {},
          geometry: json.routes[0].geometry,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetches Red Route constantly
  const updateActiveNavRoute = async () => {
    if (!map.current || !currentPosition || !currentStop) return;

    const [targetLon, targetLat] = getStopCoords(currentStop);
    const coords = `${currentPosition[0]},${currentPosition[1]};${targetLon},${targetLat}`;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes?.[0]) {
        (
          map.current.getSource("nav-path-source") as maplibregl.GeoJSONSource
        ).setData({
          type: "Feature",
          properties: {},
          geometry: json.routes[0].geometry,
        });
      }
    } catch (err) {
      console.error("Active Nav Update Error:", err);
    }
  };

  // Sync stops
  useEffect(() => {
    if (!map.current || !route?.stops) return;
    const features = route.stops.map((stop, i) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: getStopCoords(stop) },
      properties: { index: !stop.production ? "D" : i.toString() },
    }));

    const update = () => {
      (map.current?.getSource("stops") as maplibregl.GeoJSONSource)?.setData({
        type: "FeatureCollection",
        features: features as any,
      });
      updateRoadRoute(route);
    };
    if (map.current.isStyleLoaded()) update();
    else map.current.once("load", update);
  }, [route]);

  // Runs whenever GPS or Target moves
  useEffect(() => {
    updateActiveNavRoute();
  }, [currentPosition, currentStop]);

  // GPS & Camera Control
  useEffect(() => {
    if (!map.current || !currentPosition) return;
    (map.current.getSource("me") as maplibregl.GeoJSONSource)?.setData({
      type: "Feature",
      geometry: { type: "Point", coordinates: currentPosition },
      properties: { bearing: heading },
    });

    if (isNavMode) {
      map.current.easeTo({
        center: currentPosition,
        bearing: heading,
        pitch: 60,
        zoom: 18,
        duration: 1000,
        easing: (t) => t,
      });
    }
  }, [currentPosition, heading, isNavMode]);

  // Sensors
  useEffect(() => {
    let watchId: any;
    const startTracking = async () => {
      watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos) => {
          if (pos)
            setCurrentPosition([pos.coords.longitude, pos.coords.latitude]);
        },
      );
      await Motion.addListener("orientation", (event) => {
        if (event.alpha !== null) setHeading((360 - event.alpha) % 360);
      });
    };
    startTracking();
    return () => {
      if (watchId) Geolocation.clearWatch({ id: watchId });
    };
  }, []);

  if (isLoading) return <>{<LoadingPage />}</>;

  if (isError)
    return (
      <>
        <Block inset strong nested className="k-color-brand-red">
          <p className="text-slate-400">
            {error.response?.data.message || error.message}
          </p>
        </Block>
      </>
    );

  return (
    <div className="map-wrap h-full w-full relative">
      <div ref={mapContainer} className="map-container absolute inset-0" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between gap-3 z-10 w-full px-4">
        <div
          className="h-10 w-10 bg-black/50 rounded-full flex justify-center items-center active:scale-110 transition-all"
          onClick={() => setIsNavMode(!isNavMode)}
        >
          {!isNavMode ? (
            <Navigation2 className="text-white" />
          ) : (
            <Navigation2Off className="text-white" />
          )}
        </div>
        {!isNavMode && (
          <div
            onClick={() =>
              map.current?.flyTo({
                center: currentPosition || DEPOT_COORDS,
                zoom: 15,
              })
            }
            className="h-10 w-10 bg-black/50 rounded-full flex justify-center items-center active:scale-110 transition-all"
          >
            <Locate className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLibreComponent;

import leaflet from "leaflet";

export const DepotMarker = leaflet.divIcon({
  className: "custom-depot-marker",
  html: `
    <div class="w-6 h-6 rounded-full bg-black/50 border border-black flex items-center justify-center">
        <div class="text-white font-bold text-xs">D</div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

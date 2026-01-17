import leaflet from "leaflet";

export const CurrentLocationIcon = (heading: number) =>
  leaflet.divIcon({
    className: "current-location-marker",
    html: `
    <div style="
      width: 40px;
      height: 40px;
      position: relative;
      transform: rotate(${heading}deg);
    ">
      <!-- Direction Arrow -->
      <div style="
        position: absolute;
        top: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 16px solid #4285F4;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      "></div>
      <!-- Center Dot -->
      <div style="
        position: absolute;
        top: 10px;
        left: 10px;
        width: 20px;
        height: 20px;
        background: #4285F4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    </div>
  `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

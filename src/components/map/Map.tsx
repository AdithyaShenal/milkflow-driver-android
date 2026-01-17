import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  return (
    <div className="h-full w-full">
      <MapContainer
        className="h-full w-full"
        center={[7.019041, 79.969565]}
        zoom={19}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; Mapbox"
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdGh5YXNoZW5hbCIsImEiOiJjbWlrazQ0aTQwZDdtM2VzZGJrcXA0d3ZnIn0.lI5omaXW6lzbln2Vpb3ubA"
        />
      </MapContainer>
    </div>
  );
};

export default Map;

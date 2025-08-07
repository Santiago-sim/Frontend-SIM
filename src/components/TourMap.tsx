import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
const icon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Coordenadas del centro de México (Ciudad de México)
const MEXICO_CENTER: [number, number] = [19.4326, -99.1332];

interface TourMapProps {
  name: string;
  ubicacion: string;
}

const TourMap: React.FC<TourMapProps> = ({ name, ubicacion }) => {
  return (
    <MapContainer 
      center={MEXICO_CENTER} 
      zoom={8} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*<Marker position={MEXICO_CENTER} icon={icon}>
        <Popup>
          {name}<br />{ubicacion}
        </Popup>
      </Marker>*/}
    </MapContainer>
  );
};

export default TourMap;
import { Browser } from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { reportMarkerIcon } from './report-marker-icon'

type ReportMapProps = {
  latitude: number
  longitude: number
}

// Small map of where the problem is. Only the report detail page uses a map.
export function ReportMap({ latitude, longitude }: ReportMapProps) {
  return (
    // `isolate` keeps Leaflet's high z-index panes below dropdowns and sticky buttons.
    <div
      role="region"
      aria-label="Map showing where the problem is"
      className="isolate h-64 overflow-hidden rounded-lg border"
    >
      <MapContainer
        // Map options cannot change after creation, so a different location needs a new map.
        key={`${latitude},${longitude}`}
        center={[latitude, longitude]}
        zoom={16}
        scrollWheelZoom={false}
        // One-finger dragging would trap page scrolling on phones.
        dragging={!Browser.mobile}
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={reportMarkerIcon} interactive={false} />
      </MapContainer>
    </div>
  )
}

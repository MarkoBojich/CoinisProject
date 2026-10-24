import { useMapEvents } from 'react-leaflet'

type MapClickHandlerProps = {
  onPick: (latitude: number, longitude: number) => void
}

// Renders nothing; it only listens for taps on the map it is placed in.
export function MapClickHandler({ onPick }: MapClickHandlerProps) {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  })
  return null
}

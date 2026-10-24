import { divIcon } from 'leaflet'

// A div instead of Leaflet's default image marker, which breaks under bundlers and ignores our tokens.
export const reportMarkerIcon = divIcon({
  className: '',
  html: '<span class="block size-5 rounded-full border-4 border-card bg-primary ring-2 ring-primary"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

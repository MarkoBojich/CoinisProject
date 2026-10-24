import { useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { LocateFixed } from 'lucide-react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { Button } from '@/components/ui/button'

import { MapClickHandler } from './map-click-handler'
import { reportMarkerIcon } from './report-marker-icon'

// Podgorica: where the map starts until a location is chosen.
const START_CENTER: [number, number] = [42.4304, 19.2594]

type ReportLocationFieldProps = {
  latitude?: number
  longitude?: number
  onChange: (latitude: number, longitude: number) => void
  error?: string
}

export function ReportLocationField({ latitude, longitude, onChange, error }: ReportLocationFieldProps) {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)

  const hasPoint = latitude !== undefined && longitude !== undefined

  function handleLocate() {
    setLocateError(null)
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        onChange(lat, lng)
        map?.setView([lat, lng], 16)
        setLocating(false)
      },
      () => {
        setLocateError('We could not get your location. Tap the map to mark it instead.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-medium">Location of the problem</legend>
      <p id="location-help" className="text-sm text-muted-foreground">
        Tap the map to mark exactly where the problem is.
      </p>
      {'geolocation' in navigator && (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full shadow-none md:w-fit"
          disabled={locating}
          onClick={handleLocate}
        >
          <LocateFixed aria-hidden="true" />
          {locating ? 'Finding your location…' : 'Use my current location'}
        </Button>
      )}
      {locateError && (
        <p role="alert" className="text-sm text-destructive">
          {locateError}
        </p>
      )}
      {/* `isolate` keeps Leaflet's high z-index panes below dropdowns and sticky buttons. */}
      <div
        role="region"
        aria-label="Map for marking the location of the problem"
        className="isolate h-72 overflow-hidden rounded-lg border"
      >
        <MapContainer
          ref={setMap}
          center={hasPoint ? [latitude, longitude] : START_CENTER}
          zoom={hasPoint ? 16 : 13}
          scrollWheelZoom={false}
          className="size-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={onChange} />
          {hasPoint && (
            <Marker position={[latitude, longitude]} icon={reportMarkerIcon} interactive={false} />
          )}
        </MapContainer>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

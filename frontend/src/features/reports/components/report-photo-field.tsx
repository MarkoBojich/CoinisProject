import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ReportPhotoFieldProps = {
  file: File | null
  // The photo a report already has, shown until a new one is chosen (edit form).
  existingUrl?: string
  onChange: (file: File | null) => void
  error?: string
}

export function ReportPhotoField({ file, existingUrl, onChange, error }: ReportPhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // The effect creates and revokes the object URL itself, so it stays correct when React re-runs effects.
  useEffect(() => {
    // A file that is not an image gets the form's error message, not a broken preview.
    if (!file || !file.type.startsWith('image/')) {
      setPreviewUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const shownUrl = previewUrl ?? existingUrl

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-medium">Photo of the problem</legend>
      <p id="photo-help" className="text-sm text-muted-foreground">
        A clear photo helps the city find the problem. JPG or PNG, up to 5 MB.
      </p>
      {shownUrl && (
        <img
          src={shownUrl}
          alt={previewUrl ? 'Preview of the selected photo' : 'Current photo of this report'}
          className="aspect-[4/3] w-full rounded-lg border bg-muted object-cover md:max-w-md"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null)
          // Lets the same file be chosen again after it was replaced or rejected.
          e.target.value = ''
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full shadow-none md:w-fit"
        aria-describedby={error ? 'photo-error' : 'photo-help'}
        onClick={() => inputRef.current?.click()}
      >
        <Camera aria-hidden="true" />
        {shownUrl ? 'Change photo' : 'Take or choose a photo'}
      </Button>
      {error && (
        <p id="photo-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

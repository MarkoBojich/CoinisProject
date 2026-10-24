import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useCreateReport, useUpdateReport, useUploadPhoto } from '../api/use-reports'
import type { Report } from '../types'
import { ReportFieldError } from './report-field-error'
import { ReportLocationField } from './report-location-field'
import { ReportPhotoField } from './report-photo-field'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

// A report that already has a photo does not need a new one, so the schema depends on it.
function createReportSchema(hasExistingPhoto: boolean) {
  return z.object({
    photo: z
      .instanceof(File)
      .nullable()
      .refine((file) => file !== null || hasExistingPhoto, 'Add a photo of the problem.')
      .refine((file) => file === null || file.type.startsWith('image/'), 'The file must be an image.')
      .refine((file) => file === null || file.size <= MAX_PHOTO_BYTES, 'The photo must be 5 MB or smaller.'),
    address: z
      .string()
      .trim()
      .min(3, 'Enter the street or a place name, at least 3 characters.')
      .max(120, 'The address can have at most 120 characters.'),
    latitude: z.number({ error: 'Mark the location on the map.' }),
    longitude: z.number({ error: 'Mark the location on the map.' }),
    categoryId: z.number({ error: 'Choose a category.' }),
    title: z
      .string()
      .trim()
      .min(3, 'The title needs at least 3 characters.')
      .max(80, 'The title can have at most 80 characters.'),
    description: z
      .string()
      .trim()
      .min(10, 'Describe the problem in at least 10 characters.')
      .max(1000, 'The description can have at most 1000 characters.'),
  })
}

type ReportFormValues = z.infer<ReturnType<typeof createReportSchema>>

const fieldClassName = 'h-11 shadow-none'

type ReportFormProps = {
  authorId: number
  // Only the name is needed, so the route can pass categories without this feature importing `categories`.
  categories: { id: number; name: string }[]
  // Present in the edit form, absent when creating.
  report?: Report
  onSaved: (report: Report) => void
}

// One form for creating and editing a report. Time is never asked for: the backend sets it.
export function ReportForm({ authorId, categories, report, onSaved }: ReportFormProps) {
  const upload = useUploadPhoto()
  const create = useCreateReport()
  const update = useUpdateReport()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const schema = useMemo(() => createReportSchema(report !== undefined), [report])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      photo: null,
      address: report?.address ?? '',
      latitude: report?.latitude,
      longitude: report?.longitude,
      categoryId: report?.category.id,
      title: report?.title ?? '',
      description: report?.description ?? '',
    },
  })

  const description = watch('description')

  async function onSubmit(values: ReportFormValues) {
    setSubmitError(null)
    try {
      const photoUrl = values.photo ? (await upload.mutateAsync(values.photo)).url : report?.photoUrl
      if (!photoUrl) {
        setSubmitError('Add a photo of the problem.')
        return
      }
      const content = {
        title: values.title,
        description: values.description,
        photoUrl,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        categoryId: values.categoryId,
      }
      const saved = report
        ? await update.mutateAsync({ id: report.id, changes: content })
        : await create.mutateAsync({ ...content, authorId })
      onSaved(saved)
    } catch {
      setSubmitError(
        report
          ? 'Your changes could not be saved. Please try again.'
          : 'Your report could not be sent. Please try again.',
      )
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <Controller
        control={control}
        name="photo"
        render={({ field }) => (
          <ReportPhotoField
            file={field.value}
            existingUrl={report?.photoUrl}
            onChange={field.onChange}
            error={errors.photo?.message}
          />
        )}
      />

      <div className="flex flex-col gap-3">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          autoComplete="street-address"
          placeholder="Street and number, or a nearby landmark"
          aria-invalid={errors.address !== undefined}
          aria-describedby="address-error"
          className={fieldClassName}
          {...register('address')}
        />
        <ReportFieldError id="address-error" message={errors.address?.message} />
      </div>

      <ReportLocationField
        latitude={watch('latitude')}
        longitude={watch('longitude')}
        onChange={(latitude, longitude) => {
          setValue('latitude', latitude, { shouldValidate: true, shouldDirty: true })
          setValue('longitude', longitude, { shouldValidate: true, shouldDirty: true })
        }}
        error={errors.latitude?.message ?? errors.longitude?.message}
      />

      <div className="flex flex-col gap-3">
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              value={field.value === undefined ? '' : String(field.value)}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger
                id="category"
                aria-invalid={errors.categoryId !== undefined}
                aria-describedby="category-error"
                className="w-full shadow-none data-[size=default]:h-11"
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <ReportFieldError id="category-error" message={errors.categoryId?.message} />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g. Deep pothole on the main road"
          aria-invalid={errors.title !== undefined}
          aria-describedby="title-error"
          className={fieldClassName}
          {...register('title')}
        />
        <ReportFieldError id="title-error" message={errors.title?.message} />
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="What is the problem, and how does it affect people?"
          aria-invalid={errors.description !== undefined}
          aria-describedby="description-error description-count"
          className="shadow-none"
          {...register('description')}
        />
        <div className="flex items-start justify-between gap-4">
          <ReportFieldError id="description-error" message={errors.description?.message} />
          <p
            id="description-count"
            className="ml-auto shrink-0 text-xs whitespace-nowrap text-muted-foreground"
          >
            {description.length} / 1000
          </p>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <Button type="submit" size="lg" className="h-11 w-full shadow-none md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : report ? 'Save changes' : 'Send report'}
        </Button>
        {report && (
          <Button asChild variant="outline" size="lg" className="h-11 w-full shadow-none md:w-auto">
            <Link to={`/reports/${report.id}`}>Cancel</Link>
          </Button>
        )}
      </div>
    </form>
  )
}

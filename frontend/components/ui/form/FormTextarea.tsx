import type React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
  description?: string
  hideLabel?: boolean
}

export function FormTextarea({
  id,
  label,
  error,
  description,
  hideLabel = false,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(hideLabel && "sr-only")}>
        {label}
      </Label>

      {description && (
        <p id={`${id}-description`} className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      <Textarea
        id={id}
        className={cn(error && "border-red-500 focus:ring-red-500", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

import type React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  options: SelectOption[]
  error?: string
  description?: string
  hideLabel?: boolean
}

export function FormSelect({
  id,
  label,
  options,
  error,
  description,
  hideLabel = false,
  className,
  ...props
}: FormSelectProps) {
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

      <select
        id={id}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

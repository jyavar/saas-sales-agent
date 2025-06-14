import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormCheckboxProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
  description?: string
  className?: string
}

export function FormCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
  error,
  description,
  className,
}: FormCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        />
        <Label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
      </div>

      {description && (
        <p id={`${id}-description`} className="text-sm text-slate-500 dark:text-slate-400 pl-6">
          {description}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500 dark:text-red-400 pl-6" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

"use client"

import { useState, type ChangeEvent } from "react"

type ValidationRules = {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  custom?: (value: string) => boolean
}

type ValidationErrors = {
  required?: boolean
  pattern?: boolean
  minLength?: boolean
  maxLength?: boolean
  custom?: boolean
}

export function useFormValidation(initialValue = "", rules: ValidationRules = {}) {
  const [value, setValue] = useState(initialValue)
  const [touched, setTouched] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validate = (value: string): boolean => {
    const newErrors: ValidationErrors = {}

    if (rules.required && !value) {
      newErrors.required = true
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      newErrors.pattern = true
    }

    if (rules.minLength && value.length < rules.minLength) {
      newErrors.minLength = true
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      newErrors.maxLength = true
    }

    if (rules.custom && !rules.custom(value)) {
      newErrors.custom = true
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (touched) {
      validate(newValue)
    }
  }

  const handleBlur = () => {
    setTouched(true)
    validate(value)
  }

  const reset = () => {
    setValue(initialValue)
    setTouched(false)
    setErrors({})
  }

  return {
    value,
    setValue,
    handleChange,
    handleBlur,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    reset,
    validate: () => validate(value),
  }
}

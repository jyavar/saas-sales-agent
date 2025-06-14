"use client"

import { useState, useRef, type FormEvent, type ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Loader2 } from "lucide-react"

export default function FinalCta() {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Validación de email con regex
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // Solo validamos si hay contenido para no mostrar error al inicio
    if (value) {
      setIsValid(validateEmail(value))
    } else {
      setIsValid(true) // Reseteamos la validación si está vacío
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validación final antes de enviar
    if (!email || !validateEmail(email)) {
      setIsValid(false)
      inputRef.current?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      // Simulamos la llamada al backend
      // En producción, aquí iría: await fetch("/api/onboard", { method: "POST", body: JSON.stringify({ email }) })
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulación de delay

      setIsSubmitted(true)
      setEmail("")
    } catch (error) {
      console.error("Error al procesar la solicitud:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Transform Your GitHub Into Sales?
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
            Most founders see their first qualified lead within 48 hours. Average setup time: 12 minutes.
          </p>

          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={handleSubmit}
                >
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={handleEmailChange}
                      className={`h-12 pr-4 ${!isValid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      aria-label="Correo electrónico"
                      aria-invalid={!isValid}
                      disabled={isSubmitting}
                    />
                    {!isValid && (
                      <p className="text-red-500 text-sm mt-1 text-left absolute">Please enter a valid email address</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 flex items-center justify-center gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-green-800 dark:text-green-400 font-medium">
                    Perfect! Check your email to get started 🚀
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
              Works with any GitHub repository • No credit card required • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

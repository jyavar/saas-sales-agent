import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Schema de validación
const onboardSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  company: z.string().min(1, "Empresa es requerida"),
  role: z.enum(["founder", "marketing", "sales", "other"]),
  teamSize: z.enum(["1-5", "6-20", "21-50", "50+"]),
  goals: z.array(z.string()).min(1, "Selecciona al menos un objetivo"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = onboardSchema.parse(body)

    // Simular procesamiento (aquí iría la lógica real)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Log para monitoreo
    console.log("New onboarding:", {
      email: validatedData.email,
      company: validatedData.company,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Onboarding completado exitosamente",
      data: {
        userId: `user_${Date.now()}`,
        nextSteps: ["Verificar email", "Completar perfil", "Configurar primera campaña"],
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Onboarding error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

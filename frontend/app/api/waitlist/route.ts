import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email("Email inválido"),
  source: z.string().optional(),
  referrer: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)

    // Verificar si el email ya existe (simulado)
    const existingUser = false // Aquí iría la verificación real

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Este email ya está en la lista de espera",
        },
        { status: 409 },
      )
    }

    // Simular guardado en base de datos
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Log para analytics
    console.log("New waitlist signup:", {
      email: validatedData.email,
      source: validatedData.source,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "¡Te has unido a la lista de espera!",
      data: {
        position: Math.floor(Math.random() * 1000) + 1,
        estimatedWait: "2-3 semanas",
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Email inválido",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Waitlist error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      totalSignups: 2847,
      recentSignups: 23,
      averageWaitTime: "2-3 semanas",
    },
  })
}

"use client"

import { useState } from "react"
import { useTenant } from "@/lib/contexts/TenantContext"
import { useAuth } from "@/hooks/use-auth"
import { authFetch } from "@/lib/client"
import { AuthGuard } from "@/components/testing/AuthGuard"

interface Message {
  sender: "user" | "ia"
  text: string
}

export default function AssistantPage() {
  const { tenant } = useTenant()
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // Simula historial por usuario/tenant (en real, fetch a backend)
  // useEffect(() => { ... }, [tenant, user])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input) return
    setLoading(true)
    setMessages(msgs => [...msgs, { sender: "user", text: input }])
    setInput("")
    // Simula streaming IA
    let iaText = ""
    setMessages(msgs => [...msgs, { sender: "ia", text: "..." }])
    for (const chunk of ["Pensando", "...", "Respuesta IA lista!"]) {
      await new Promise(res => setTimeout(res, 600))
      iaText += chunk + " "
      setMessages(msgs => [
        ...msgs.slice(0, -1),
        { sender: "ia", text: iaText.trim() },
      ])
    }
    setLoading(false)
  }

  return (
    <AuthGuard allowedRoles={["admin", "agent"]}>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Asistente IA</h2>
        <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
          {messages.length === 0 && <div className="text-gray-400">No hay mensajes aún.</div>}
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender === "user" ? "text-right" : "text-left text-blue-700"}>
              <span className="inline-block px-2 py-1 rounded bg-blue-50 mb-1">{msg.text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="input input-bordered flex-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
          />
          <button className="btn btn-primary" type="submit" disabled={loading || !input}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </AuthGuard>
  )
}

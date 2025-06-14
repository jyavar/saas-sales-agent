// Dispatch de campañas (email, webhook, etc.) 
import { CampaignOutput, DispatchPayloadSchema } from "../types";
import axios from "axios";

export async function dispatch(tenantId: string, campaign: CampaignOutput): Promise<void> {
  const payload = { tenantId, campaign };
  let validPayload;
  try {
    validPayload = DispatchPayloadSchema.parse(payload);
  } catch (e: any) {
    console.error("❌ Error de validación de payload en dispatch:", e.errors);
    throw e;
  }

  try {
    await axios.post(`${process.env.BACKEND_URL}/api/campaigns/send`, validPayload, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "X-Tenant-ID": tenantId
      }
    });
    console.log("📨 Campaña enviada con éxito.");
  } catch (error: any) {
    console.error("❌ Error al enviar campaña:", error.response?.data || error.message);
  }
} 
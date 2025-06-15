# Pipeline de Campaña StratoSalesAgent

1. Realiza un POST a `/api/campaigns` con los datos de la campaña y el `presetKey` deseado.
2. El backend valida los datos con Zod, selecciona el prompt y ejecuta el pipeline:
   - Llama a OpenAI con el prompt dinámico.
   - Persiste los resultados en la base de datos.
   - Envía el email usando Resend (con retry).
3. El frontend muestra el progreso y los resultados en tiempo real en el dashboard.

## Ejemplo de payload
```json
{
  "name": "Campaña de ventas",
  "presetKey": "sales",
  "target": "clientes@demo.com"
}
``` 
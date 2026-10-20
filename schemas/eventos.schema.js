import { z } from "zod"

// GET /bentovote/v1/eventos?data=2026-10-21   aqui o (o "data" é opcional)
export const eventosSchema = z.object({
    data: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato AAAA-MM-DD") // 4 dígitos-2 dígitos-2 dígitos
        .refine((valor) => !Number.isNaN(Date.parse(`${valor}T00:00:00-03:00`)), "Data inválida") // barra '2026-99-99'
        .optional()
})
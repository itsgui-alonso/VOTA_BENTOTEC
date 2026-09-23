import { z } from "zod"

export const sessionSchema = z.object({
    qrCode: z.string().trim().min(1, "O qrCode é obrigatório")
})
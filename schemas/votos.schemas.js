import { z } from "zod"

export const votosSchema = z.object({
    token: z.string().uuid('Token Inválido!'),
    projectId: z.string().uuid("ProjectId Inválido")
})
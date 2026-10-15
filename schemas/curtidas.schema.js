import { z } from "zod"

export const curtidaSchema = z.object({
    visitanteId: z.string().uuid('Visitante inválido!'),   // id anônimo gerado pelo front
    projectId: z.string().uuid('ProjectId inválido!')      // projeto curtido
})

export const minhasCurtidasSchema = z.object({
    visitanteId: z.string().uuid('Visitante inválido!')
})
import { z } from "zod"

export const webhookSchema = z.object({
    record: z.object({
        qr_texto: z.string().min(1, "qr_texto é obrigatório"),
        nome: campoOpcional,
        cpf: campoOpcional,
        email: campoOpcional,
        telefone: campoOpcional,
        tipoVisitante: campoOpcional,
        origem: campoOpcional,
        status: campoOpcional
    })
})
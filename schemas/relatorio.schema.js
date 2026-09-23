import { z } from "zod"

export const dataSchema = z.object({
    // Usei o coerce.date() diferentemente do z.date() ele tenta converter o valor recebido para um objeto Date de verdade
    // Só aceita se a conversão der realemnte certo
    data: z.coerce.date({ message: "Data é invalida, use o formato AAAA-MM-DD"}).optional()
})
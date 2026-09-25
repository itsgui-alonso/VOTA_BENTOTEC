import { z } from "zod"

// Aqui vamos usar o query params de GET bentovote/v1/projetos
// Como tudo vem como straing na URL, precisamos usar o z.course para trandormar categoria, page e limit em numero

export const projetosSchema = z.object({
    busca: z.string().trim().min(1, "A busca não pode ser vazia").max(100).optional(),
    categoria: z.coerce.number().int("A categoria deve ser um numero inteiro").positive().optional(),
    orientador: z.string().trim().min(1, "O nome do Orientador não pode ser vazio").max(100).optional(),
    page: z.coerce.number().int().positive('A page deve ser maior que 0').default(1),
    limit: z.coerce.number().int().positive("O limit deve ser maior que 0").max(100, "Limit maximo é de 100").default(20)
})
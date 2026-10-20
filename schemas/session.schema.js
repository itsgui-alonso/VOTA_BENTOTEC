import { z } from "zod"

export const sessionSchema = z.object({
    qrCode: z.string()
        .transform(t => t
            .normalize('NFKC')                              // normaliza caracteres especiais
            .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')    // remove invisíveis
            .replace(/[\u2010-\u2015\u2212]/g, '-')         // traços especiais viram hífen
            .trim())                                        // tira espaços das pontas
        .pipe(z.string().min(1, "O qrCode é obrigatório"))  // só depois de limpar confere se não está vazio
})
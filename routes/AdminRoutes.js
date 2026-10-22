import { Router } from "express";
import crypto from "crypto";
import { VotacaoService } from "../services/Votacao.services.js";
import { AppError } from "../models/errors/AppError.js";
import { success } from "../utils/Resposta.js";

const router = Router()

// Só passa quem mandar o header x-admin-key igual à ADMIN_KEY do servidor
function exigirAdmin(req, res, next){
    const enviada = Buffer.from(req.get('x-admin-key') || '')
    const correta = Buffer.from(process.env.ADMIN_KEY || '')

    const valida = correta.length > 0 &&
        enviada.length === correta.length &&
        crypto.timingSafeEqual(enviada, correta) // compara sem vazar informação pelo tempo de resposta

    if(!valida){
        throw new AppError('Não autorizado', 401)
    }
    next()
}

router.get('/votacao/status', exigirAdmin, async (req, res) => {
    return success(res, { encerrada: await VotacaoService.estaEncerrada() })
})

router.post('/votacao/encerrar', exigirAdmin, async (req, res) => {
    await VotacaoService.encerrar()
    return success(res, { encerrada: true })
})

router.post('/votacao/reabrir', exigirAdmin, async (req, res) => {
    await VotacaoService.reabrir()
    return success(res, { encerrada: false })
})

export default router
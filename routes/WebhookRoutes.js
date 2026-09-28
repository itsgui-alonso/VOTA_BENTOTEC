import { Router } from "express";
import { WebhookService } from "../services/Webhook.services.js";
import crypto from "node:crypto";
import { webhookSchema } from "../schemas/webhook.schema.js";
import { validate } from "../middlewares/validate.js";
import { success } from "../utils/Resposta.js";
import { AppError } from "../models/errors/AppError.js";
const router = Router()


function verificarSegredoWebhook(req, res, next){

    const secret = req.headers['x-webhook-secret']
    const envSecret = process.env.FISHVISION_WEBHOOK_SECRET

    // Se o usuario não enviar a chave (undefined) ou a variavel de ambiente n estiver
    // Configurada no servidor, assim depois não dá erro para converter para o Buffer
    if(!secret || !envSecret){
        return res.status(401).json({erro: 'Não Autorizado'})
    }

    // Transformação das varaiveis em Buffer(seuqencias de bytes na memória)
    // Temos que usar isso pois a crypto.timingSafeEqual só aceita esse formato
    const segredoRecebido = Buffer.from(secret)
    const segredoEsperado = Buffer.from(envSecret)

    // Checa o tamanho ANTES de chamar timingSafeEqual (ele lança erro se os
    // buffers tiverem tamanhos diferentes). Comparar o tamanho primeiro não
    // reabre o timing attack, porque o tamanho do segredo não revela nada
    // sobre o conteúdo dele.
    if(segredoRecebido.length !== segredoEsperado.length || !crypto.timingSafeEqual(segredoRecebido, segredoEsperado)){
        throw new AppError('Não autorizado', 401)
    }

    next()
}

router.post('/checkin', verificarSegredoWebhook, validate(webhookSchema), async (req, res,) => {
        await WebhookService.processarCadastro(req.body)

        return success(res)
    
})
export default router
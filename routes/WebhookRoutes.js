import { Router } from "express";
import { WebhookService } from "../services/Webhook.services.js";
import crypto from "node:crypto";
const router = Router()

router.post('/webhook/checkin', async (req, res) =>{
    try {
        const secret = req.headers['x-webhook-secret']
        const envSecret = process.env.FISHVISION_WEBHOOK_SECRET

        // Se o usuario não enviar a chave (undefined) ou a variavel de ambiente n estiver
        // Configurada no servidor, assim depois não dá erro para converter para o Buffer
        if(!secret || !envSecret){
            return res.status(401).json({erro: 'Não Autorizado'})
        }
        // Transformação das varaiveis em Buffer(seuqencias de bytes na memória)
        // Temos que usar isso pois a crypto.timingSafeEqual só aceita esse formato
        const a = Buffer.from(secret)
        const b = Buffer.from(envSecret)

        // Antes verifica se o tamanho é diferente, se sim ja da erro
        //Ou tambem se o tempo é diferente, assim não deixa invasores tentarem burlar por tempo de execução

        if(a.length !== b.length || !crypto.timingSafeEqual(a, b)){
            return res.status(401).json({erro: 'Não Autorizado'})
        }
        
        await WebhookService.processarCadastro(req.body)

        return res.status(200).json({sucesso: true})
    } catch (erro) {
        return res.status(400).json({erro: erro.message})
    }
})
export default router
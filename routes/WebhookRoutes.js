import { Router } from "express";
import { WebhookService } from "../services/Webhook.services.js";

const router = Router()

router.post('/webhook/checkin', async (req, res) =>{
    try {
        const secret = req.headers['x-webhook-secret']

        if(secret !== process.env.FISHVISION_WEBHOOK_SECRET){
            return res.status(401).json({erro: "Não autorizado"})
        }

        await WebhookService.processarCadastro(req.body)

        return res.status(200).json({sucesso: true})
    } catch (erro) {
        return res.status(400).json({erro: erro.message})
    }
})
export default router
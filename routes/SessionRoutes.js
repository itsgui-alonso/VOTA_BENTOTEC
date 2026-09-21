import { Router } from "express";
import { SessionService } from "../services/Session.services.js";

const router = Router()

router.post('/session', async(req, res) =>{
    try{
        const { qrCode } = req.body

        if(!qrCode){
            return res.status(400).json({erro: "O qrCode é obrigatorio! "})
        }

        const session = await SessionService.CriarSession(qrCode)

        return res.status(201).json({
            token: session.tokenSession,
            expira_em: session.expires_atSession
        })
    }
    catch(erro){
        return res.status(400).json({erro: erro.message})
    }
})

export default router
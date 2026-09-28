import { Router } from "express";
import { SessionService } from "../services/Session.services.js";
import { sessionSchema } from "../schemas/session.schema.js";
import { validate } from "../middlewares/validate.js";
import { success } from "../utils/Resposta.js";
const router = Router()

router.post('/validacao', validate(sessionSchema), async(req, res) =>{

        const { qrCode } = req.body

        const session = await SessionService.CriarSession(qrCode)

        return success(res, {
            token: session.tokenSession,
            expira_em: session.expires_atSession
        })
})

export default router
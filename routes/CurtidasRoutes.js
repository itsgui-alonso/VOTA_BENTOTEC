import { Router } from "express";
import { CurtidasService } from "../services/Curtidas.services.js";
import { curtidaSchema,  minhasCurtidasSchema } from "../schemas/curtidas.schema.js";
import { validate } from "../middlewares/validate.js";
import { success } from "../utils/Resposta.js";

const router = Router()

// POST /bentovote/v1/curtidas/alternar → curtir ou descurtir

router.post('/alternar', validate(curtidaSchema), async (req, res) => {
    const { visitanteId, projectId } = req.body
    return success(res, await CurtidasService.alternarCurtida(visitanteId, projectId))
})

// POST /bentovote/v1/curtidas/minhas → ids dos projetos que este aparelho curtiu

router.post('/minhas', validate(minhasCurtidasSchema), async (req, res) =>{
    const { visitanteId } = req.body
    return success(res, await CurtidasService.listarMinhasCurtidas(visitanteId))
})

export default router
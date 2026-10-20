import { Router } from "express";
import { EventosServices } from "../services/Eventos.services.js";
import { validate } from "../middlewares/validate.js";
import { eventosSchema } from "../schemas/eventos.schema.js";
import { success } from "../utils/Resposta.js";

const router = Router()

// GET /bentovote/v1/eventos?data=2026-10-21
router.get('/', validate(eventosSchema, 'query'), async (req, res) => {
    // req.queryValidado = os dados já limpos pelo Zod (o validate guarda ali)
    const resultado = await EventosServices.agenda(req.queryValidado.data)

    return success(res, resultado)
})

export default router
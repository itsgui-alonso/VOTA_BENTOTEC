import { Router } from "express";
import { ProjetoServices } from "../services/Projeto.services.js";
import { validate } from "../middlewares/validate.js";
import { projetosSchema } from "../schemas/projetos.schema.js";
import { success } from "../utils/Resposta.js";

const router = Router()

// GET /bentovote/v1/projetos?busca=&categoria=&orientador=&page=&limit=

router.get('/', validate(projetosSchema, 'query'), async (req, res) => {
    const resultado = await ProjetoServices.buscarProjetos(req.queryValidado)

    return success(res, projetosSchema, 200, { paginacao })
})

//GET /bentovote/v1/projetos/:id

router.get('/:id', async (req, res) => {
    const projeto = await ProjetoServices.buscarProjetoPorId(req.params.id)

    return success(res, projeto)
})

export default router
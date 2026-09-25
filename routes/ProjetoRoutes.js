import { Router } from "express";
import { ProjetoServices } from "../services/Projeto.services";
import { validate } from "../middlewares/validate.js";
import { projetosSchema } from "../schemas/projetos.schema";

const router = Router()

// GET /bentovote/v1/projetos?busca=&categoria=&orientador=&page=&limit=

router.get('/', validate(projetosSchema), 'query'), async (req, res) => {
    const resultado = await ProjetoServices.buscarProjetos(req.queryValidado)

    return res.status(200).json(resultado)
}

//GET /bentovote/v1/projetos/:id

router.get('/:id', async (req, res) => {
    const projeto = await ProjetoServices.buscarProjetoPorId(req.params.id)

    return res.status(200).json({ projeto })
})

export default router
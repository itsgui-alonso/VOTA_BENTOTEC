import { Router } from "express";
import { CategoriaServices } from "../services/Categoria.services.js";
import { success } from '../utils/Resposta.js'

const router = Router()

router.get('/', async (req, res) => {
    const categorias = await CategoriaServices.listar() // Express 5 já captura erros de funções async
    return success(res, categorias) // { sucesso: true, dados: [...] }
})

export default router
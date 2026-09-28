import { Router } from "express";
import { VotosService } from "../services/Votos.services.js";
import { votosSchema } from "../schemas/votos.schemas.js";
import { validate } from "../middlewares/validate.js";
import { success } from "../utils/Resposta.js";
const router = Router()

router.post('/votar', validate(votosSchema), async(req, res) =>{

        const {token, projectId} = req.body

        const voto = await VotosService.votarProjeto(token, projectId)

        return success(res, {
            mensagem: "Parabens, voto realizado com sucesso!!",
            voto:{
                id: voto.idVoto,
                projectId: voto.projectIdVoto,
                categoryId: voto.categoryIdVoto
            }
        })
})
export default router
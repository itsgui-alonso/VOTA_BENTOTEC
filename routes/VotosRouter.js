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

// POST /bentovote/v1/votos/restantes → quantos votos a pessoa ainda tem na categoria do projeto
router.post('/restantes', validate(votosSchema), async (req, res) => {
    const { token, projectId } = req.body // reaproveita o schema { token, projectId }
    const dados = await VotosService.consultarVotosRestantes(token, projectId) // dados já validados
    return success(res, dados) // { categoria, limite, usados, restantes, ... }
})
export default router
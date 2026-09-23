import { Router } from "express";
import { VotosService } from "../services/Votos.services.js";

const router = Router()

router.post('/votos', async(req, res) =>{
    try{
        const {token, projectId} = req.body

        if(!token || !projectId){
            return res.status(400).json({erro: "O Token e o ProjectId são obrigatórios para essa etapa!"})
        }

        const voto = await VotosService.votarProjeto(token, projectId)

        return res.status(201).json({
            mensagem: "Parabens, voto realizado com sucesso!!",
            voto:{
                id: voto.idVoto,
                projectId: voto.projectIdVoto,
                categoryId: voto.categoryIdVoto
            }
        })
    }
    catch(erro){
        return res.status(400).json({erro: erro.message})
    }
})
export default router
import { Router } from "express";
import { VotosRepository } from "../repositories/Votos.repository.js";
import { validate } from "../middlewares/validate.js";
import { dataSchema } from "../schemas/relatorio.schema.js";
import { success } from "../utils/Resposta.js";
const router = Router()

router.get('/categorias', async (req, res)=>{

        const resultado = await VotosRepository.totalVotosPorCategoria()
        return success(res, resultado)
})

router.get('/projetos', async (req, res) =>{
        const resultado = await VotosRepository.totalVotosPorProjeto()
        return success(res, resultado)
})

router.get('/data', validate(dataSchema, 'query'), async (req, res) =>{
        const DataConsultada = req.queryValidado.data ?? new Date()
        const votosData = await VotosRepository.verificarVotosDia(DataConsultada)

        return success(res, { 
                data: DataConsultada.toISOString().split('T')[0],
                total: votosData.length, //Deixa so a data tem as horas e etc,
                votos: votosData
        })
})

export default router
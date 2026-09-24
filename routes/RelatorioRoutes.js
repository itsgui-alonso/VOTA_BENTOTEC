import { Router } from "express";
import { VotosRepository } from "../repositories/Votos.repository.js";
import { validate } from "../middlewares/validate.js";
import { dataSchema } from "../schemas/relatorio.schema.js";
const router = Router()

router.get('/categorias', async (req, res)=>{

        const resultado = await VotosRepository.totalVotosPorCategoria()
        return res.status(200).json(resultado)
})

router.get('/projetos', async (req, res) =>{
        const resultado = await VotosRepository.totalVotosPorProjeto()
        return res.status(200).json(resultado)
})

router.get('/data', validate(dataSchema, 'query'), async (req, res) =>{
        const DataConsultada = req.queryValidada.data ?? new Date()
        const votosData = await VotosRepository.verificarVotosDia(DataConsultada)

        return res.status(200).json({
            data: DataConsultada.toISOString().split('T')[0],
            total: votosData.length, //Deixa so a data tem as horas e etc,
            votos: votosData
        })
})

export default router
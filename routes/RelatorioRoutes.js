import { Router } from "express";
import { VotosRepository } from "../repositories/Votos.repository.js";

const router = Router()

router.get('/relatorio/categorias', async (req, res)=>{
    try{
        const resultado = await VotosRepository.totalVotosPorCategoria()
        return res.status(200).json(resultado)
    }
    catch(erro){
        return res.status(400).json({erro: erro.message})
    }
})

router.get('/relatorio/projetos', async (req, res) =>{
    try{
        const resultado = await VotosRepository.totalVotosPorProjeto()
        return res.status(200).json(resultado)
    }
    catch(erro){
        return res.status(400).json({erro: erro.message})
    }
})

router.get('/relatorio/data', async (req, res) =>{
    try{
        const {data} = req.query
        let DataConsultada

        if(data){
            DataConsultada = new Date(data)
        } else{
            DataConsultada = new Date()
        }

        const votosData = await VotosRepository.verificarVotosDia(DataConsultada)

        return res.status(200).json({
            data: DataConsultada.toISOString().split('T')[0],
            total: votosData.length, //Deixa so a data tem as horas e etc,
            votos: votosData
        })
    }
    catch(erro){
        return res.status(400).json({erro: erro.message})
    }
})

export default router
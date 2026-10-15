import { CurtidasRepository } from "../repositories/Curtidas.repository.js";
import { ProjetoRepository } from "../repositories/Projeto.repository.js";
import { AppError } from "../models/errors/AppError.js";

export class CurtidasService{

    static async alternarCurtida(visitanteId, projetoId){
        const projeto = await ProjetoRepository.buscarProjetoID(projetoId) // confere se o projeto existe
        if(!projeto){
            throw new AppError('O Projeto não existe!', 404)
        }

        const jaCurtiu = await CurtidasRepository.buscarCurtida(visitanteId, projetoId)

        if(jaCurtiu){
            await CurtidasRepository.removerCurtida(visitanteId, projetoId)
        } else {
            await CurtidasRepository.criarCurtida(visitanteId, projetoId)
        }

        const total = await CurtidasRepository.contarPorProjeto(projetoId)
        return { curtido: !jaCurtiu, total }
    }

    static async listarMinhasCurtidas(visitanteId){
        const projetos = await CurtidasRepository.listarProjetosCurtidos(visitanteId)
        return { projetos }
    }
}
import { ProjetoRepository } from "../repositories/Projeto.repository.js";
import { AppError } from "../models/errors/AppError.js";
import prisma from "../database/prisma.js";

export class ProjetoServices {
    
    static async buscarProjetoPorId(id){
        const projeto = await ProjetoRepository.buscarProjetoID(id)

        if(!projeto){
            throw new AppError('Projeto não encontrado', 404)
        }
        return projeto
    }

    static async buscarNomeProjeto(nomeProjeto){

        const projeto = await ProjetoRepository.buscarNomeProjeto(nomeProjeto)

        if(!projeto){
            throw new AppError('Projeto não encontrado', 404)
        }
        return projeto
    }

    static async buscarNomeCompletoProjeto(nomeCompletoProjeto){
        const projeto = await ProjetoRepository.buscarNomeCompletoProjeto(nomeCompletoProjeto)
        
        if(!projeto){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projeto
    }

    static async buscarProjetosPorCategoria(categoriaId){
        const projetos = await ProjetoRepository.buscarProjetosCategoria(categoriaId)
        
        if(!projetos || projetos.length === 0){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projetos
    }

    static async buscarProjetoPorNumero(numeroProjeto){
        const projeto = await ProjetoRepository.buscarNumeroProjeto(numeroProjeto)
        
        if(!projeto){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projeto
    }

    static async buscarProjetoPorStand(standProjeto){
        const projeto = await ProjetoRepository.buscarStandProjeto(standProjeto)
        
        if(!projeto){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projeto
    }

    static async buscarPalavrasChavesProjetos(palavrasChaves){
        const projetos = await ProjetoRepository.buscarPalavraChaveProjetos(palavrasChaves)
        
        if(!projetos || projetos.length === 0){
            throw new AppError("Projeto não encontrado para essa palavra-chave", 404);
        }

        return projetos
    }

    static async buscarProjetosPorNomeOrientador(nomeOrientador){
        const projetos = await ProjetoRepository.buscarOrientadorProjetos(nomeOrientador)

        if(!projetos || projetos.length === 0){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projetos
    }

    static async buscarProjetosPorNomeCoOrientador(nomeCoOrientador){
        const projetos = await ProjetoRepository.buscarCoorientadorProjetos(nomeCoOrientador)

        if(!projetos || projetos.length === 0){
            throw new AppError("Projeto não encontrado", 404);
        }

        return projetos
    }

    
}
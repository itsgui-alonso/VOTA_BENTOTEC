import prisma from "../database/prisma.js";
import { Projeto } from "../models/Projetos.js";

export class ProjetoRepository{

    static async bucarProjetoID(projetoId){
        const projeto = await prisma.projetos.findFirst({
            where:{
                id: projetoId
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto) // Como estou usando o destructor, é mais facil. Desde que esteja com os mesmos nomes no BD
    }

    static async bucarNomeProjeto(nomeProjeto){
        const projeto = await prisma.projetos.findFirst({
            where:{
                nome_projeto: nomeProjeto
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto)
    }

    // Opção de buscar por nome completo do projeto

    static async buscarNomeCompletoProjeto(nomeCompletoProjeto){
        const projeto = await prisma.projetos.findFirst({
            where: {
                nome_completo_projeto: nomeCompletoProjeto
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto)
    }

    static async buscarProjetosCategoria(categoriaId){
        const projetos = await prisma.project.findMany({
            where:{
                categoria_id: categoriaId
            }
        })

        return projetos.map(projeto => new Projeto(projeto))
    }

    static async buscarNumeroProjeto(numeroProjeto){
        const projeto = await prisma.projetos.findMany({
            where: {
                numero_projeto: numeroProjeto
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto)
    }

    static async buscarStandProjeto(standProjeto){
        const projeto = await prisma.projetos.findMany({
            where: {
                stand_projeto: standProjeto
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto)
    }

    static async buscarPalavraChaveProjetos(palavraChaveProjetos){
        const projetos = await prisma.projetos.findMany({
            where: {
                palavras_chave: {
                    contains: palavraChaveProjetos,
                    mode: "insensitive"
                }
            }
        })

        if(!projetos){
            return null
        }

        return projetos.map(projeto => new Projeto(projeto))
    }

    static async buscarOrientadorProjetos(orientadorProjetos){
        const projetos = await prisma.projetos.findMany({
            where: {
                orientador: orientadorProjetos
            }
        })

        if(!projetos){
            return null
        }

        return projetos.map(projeto => new Projeto(projeto))
    }

    static async buscarCoorientadorProjetos(coorientadorProjetos){
        const projetos = await prisma.projetos.findMany({
            where: {
                co_orientador: coorientadorProjetos
            }
        })

        if(!projetos){
            return null
        }

        return projetos.map(projeto => new Projeto(projeto))
    }
}
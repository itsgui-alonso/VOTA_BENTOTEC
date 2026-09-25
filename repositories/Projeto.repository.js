import prisma from "../database/prisma.js";
import { Projeto } from "../models/Projetos.js";

export class ProjetoRepository{

    static async buscarProjetoID(projetoId){
        const projeto = await prisma.projetos.findUnique({
            where:{
                id: projetoId
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto) // Como estou usando o destructor, é mais facil. Desde que esteja com os mesmos nomes no BD
    }

    static async buscarNomeProjeto(nomeProjeto){
        const projeto = await prisma.projetos.findFirst({
            where:{
                nome_projeto: { contains: nomeProjeto, mode: 'insensitive'}
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
                nome_completo_projeto: { contains: nomeCompletoProjeto, mode: 'insensitive'}
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(projeto)
    }

    static async buscarProjetosCategoria(categoriaId){
        const projetos = await prisma.projetos.findMany({
            where:{
                categoria_id: categoriaId
            }
        })

        return projetos.map(projeto => new Projeto(projeto))
    }

    static async buscarNumeroProjeto(numeroProjeto){
        const projeto = await prisma.projetos.findFirst({
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
        const projeto = await prisma.projetos.findFirst({
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
                orientador: { contains: orientadorProjetos, mode: 'insensitive'}
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
                co_orientador: { contains: coorientadorProjetos, mode: 'insensitive'}
            }
        })

        if(!projetos){
            return null
        }

        return projetos.map(projeto => new Projeto(projeto))
    }

    static async buscarProjetosPaginado({busca, categoria, orientador, page, limit}){
        const filtros = {}

        if(busca){
            filtros.OR = [
                { nome_projeto: { contains: busca, mode: 'intensive'}},
                { palavras_chave: { contains: busca, mode: 'intensive'}}
            ]
        }


        if(categoria){
            filtros.categoria_id = categoria
        }

        if(orientador){
            filtros.orientador = { contains: busca, mode: 'intensive'}
        }

        const pular = (page - 1) * limit

        const [projetos, total] = await Promise.all([
            prisma.projetos.findMany({
                where: filtros,
                include: { categoria: true, integrantes: true },
                pular,
                take: limit,
                orderBy: { created_at: 'desc'}
            }),
            prisma.projetos.count({ where: filtros})
        ])

        return { projetos, total}
    }
}
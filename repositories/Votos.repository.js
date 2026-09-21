import prisma from "../database/prisma.js";
import { Votos } from "../models/Votos.js";

export class VotosRepository{

    static async salvarVoto(voto){
        const data = await prisma.vote.create({
            data: {
                userId: voto.userIdVoto,
                projectId: voto.projectIdVoto,
                categoryId: voto.categoryIdVoto,
                created_at: voto.createAtVoto
            }
        })

        return new Votos(
            data.id,
            data.userId,
            data.projectId,
            data.categoryId,
            data.created_at
        )
    }
    //Esse metodo vai verficar quantos votos o usuario ja fez na categoria
    static async verficarQuantosVotosUserCategoria(userId, categoryId){
        const votos = await prisma.vote.findMany({
            where: {
                userId,
                categoryId
            }
        })

        return votos.map(voto => new Votos(
            voto.id,
            voto.userId,
            voto.projectId,
            voto.categoryId,
            voto.created_at
        ))
    }

    static async verificarVotosDia(dataDesejada){
        const inicioDia = new Date(dataDesejada)
        inicioDia.setHours(0,0,0,0)

        const fimDia = new Date(dataDesejada)
        fimDia.setHours(23,59,59,999)

        const votos = await prisma.vote.findMany({
            where: {
                created_at:{
                    gte: inicioDia, // Aqui seria maior ou igual ao inicio do dia
                    lte: fimDia // Menor ou igual ao fim do dia
                }
            }
        })

        return votos.map(voto => new Votos(
            voto.id,
            voto.userId,
            voto.projectId,
            voto.categoryId,
            voto.created_at
        ))
    }

    static async verficarVotosCategoria(categoryId){
        const votos = await prisma.vote.findMany({
            where: {
                categoryId
            }
        })

        return votos.map(voto => new Votos(
            voto.id,
            voto.userId,
            voto.projectId,
            voto.categoryId,
            voto.created_at
        ))
    }

    static async verficarVotosProjeto(projectId){
        const votos = await prisma.vote.findMany({
            where: {
                projectId
            }
        })

        return votos.map(voto => new Votos(
            voto.id,
            voto.userId,
            voto.projectId,
            voto.categoryId,
            voto.created_at
        ))
    }

    static async totalVotosPorCategoria(){
        const resultado = await prisma.vote.groupBy({
            by: ["categoryId"],
            _count: {id: true}
        })

        return resultado.map( result =>({
            categoryId: result.categoryId,
            total: result._count.id
        }))
    }

    static async totalVotosPorProjeto(){
        const resultado = await prisma.vote.groupBy({
            by: ["projectId"],
            _count: {id: true},
            orderBy: {_count: {id: 'desc'}}
        })

        return resultado.map(result =>({
            projectId: result.projectId,
            total: result._count.id
        }))
    }
    
}

    
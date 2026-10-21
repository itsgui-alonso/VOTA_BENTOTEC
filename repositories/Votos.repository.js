import prisma from "../database/prisma.js";
import { Votos } from "../models/Votos.js";

export class VotosRepository{

    static async salvarVoto(voto){
        const data = await prisma.vote.create({
            data: {
                userId: voto.userIdVoto,
                projectId: voto.projectIdVoto,
                categoryId: voto.categoryIdVoto,
            }
        })

        return new Votos(data)
    }
    //Esse metodo vai verficar quantos votos o usuario ja fez na categoria
    static async verficarQuantosVotosUserCategoria(userId, categoryId){
        const votos = await prisma.vote.count({
            where: {
                userId,
                categoryId
            }
        })

        return votos
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

        return votos.map(voto => new Votos(voto))
    }
    // Ele vai pegar todos os votos da categoria 3 por exemplo
    static async verficarVotosCategoria(categoryId){
        const votos = await prisma.vote.findMany({
            where: {
                categoryId
            }
        })

        return votos.map(voto => new Votos(voto))
    }
    // Ele vai pegar todos os votos feitos nesse projeto
    static async verficarVotosProjeto(projectId){
        const votos = await prisma.vote.findMany({
            where: {
                projectId
            }
        })

        return votos.map(voto => new Votos(voto))
    }
    // Fala quantos votos cada categoria recebeu
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

    static async totalVotosPorDia(){
        const linhas = await prisma.$queryRaw`
        SELECT to_char(("created_at" AT TIME ZONE 'UTC') AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD') AS data,
               COUNT(*)::int AS total
        FROM "Vote"
        GROUP BY data
        ORDER BY data`
    return linhas // [{ data: '2026-10-22', total: 611 }, ...]
    }
    
    // Fala quantos votos cada projeto recebeu
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
    
    static async buscarVotoUserProjeto(userId, projectId){
        return prisma.vote.findUnique({
            where: { userId_projectId: { userId, projectId } }
        })
    }
}

    
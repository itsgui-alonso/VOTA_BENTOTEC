import prisma from "../database/prisma.js";

const FUSO = '-03:00' // aqui defeni o fuso fixo, pois não tem mais horario de verão

// só uso o que a tela vai usar mesmo
const CAMPOS_EVENTO = {
    id: true,
    titulo: true,
    descricao: true,
    inicio: true,
    fim: true,
    local: { select: { id: true, nome: true}} // traz o local junto, já com o nome
}

export class EventosRepository {

    static async listarDias(){
        // $queryRaw = SQL direto, porque o Prisma não agrupa por "dia" sozinho.
        // O banco guarda em UTC, então convertemos para São Paulo ANTES de pegar o dia.
        return prisma.$queryRaw`
            SELECT DISTINCT to_char("inicio" AT TIME ZONE 'America/Sao_Paulo', 'YYYY-MM-DD') AS data
            FROM "eventos"
            ORDER BY data`
    }

    static async listarPorDia(data){
        const inicioDoDia = new Date(`${data}T00:00:00${FUSO}`) // aqui seria meia noite
        const fimDoDia = new Date(inicioDoDia.getTime() + 24 * 60 * 60 * 1000)   // + 24 horas

        return prisma.eventos.findMany({
            where: { inicio: { gte: inicioDoDia, lt: fimDoDia } }, // gte = maior ou igual / lt = menor que
            select: CAMPOS_EVENTO,
            orderBy: [{ inicio: 'asc' }, { fim: 'asc' }, { id: 'asc' }] // id desempata: a ordem nunca varia
        })
    }

    // seria os eventos que estão acontecendo no momento atual!
    static listarAgora(){
        const agora = new Date()

        return prisma.eventos.findMany({
            where: { inicio: { lte: agora }, fim: { gt: agora } }, // lte = menor ou igual / gt = maior que
            select: CAMPOS_EVENTO,
            orderBy: [{ fim: 'asc' }, { id: 'asc' }] // o que termina primeiro aparece primeiro
        })
    }
}
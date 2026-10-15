import prisma from "../database/prisma.js";

export class CurtidasRepository {

    static async buscarCurtida(visitanteId, projetoId) {
        return prisma.curtidas.findUnique({
            where: { visitante_id_projeto_id: { visitante_id: visitanteId, projeto_id: projetoId } }
        })
    }

    static async criarCurtida(visitanteId, projetoId){
        return prisma.curtidas.createMany({
            data: [{ visitante_id: visitanteId, projeto_id: projetoId}],
            skipDuplicates: true //  toque duplo rapido não gera eero
        })
    }

    static async removerCurtida(visitanteId, projetoId){ // apaga a curtida (não dá erro se não existir)
        return prisma.curtidas.deleteMany({
            where: { visitante_id: visitanteId, projeto_id: projetoId }
        })
    }

    static async contarPorProjeto(projetoId){
        return prisma.curtidas.count({
            where: { projeto_id: projetoId } //  total de curtidas por projetos
        })
    }

    static async listarProjetosCurtidos(visitanteId){
        const linhas = await prisma.curtidas.findMany({ // tudo o que esse aparelho curtiu
            where: { visitante_id: visitanteId },
            select: { projeto_id: true }
        })
        return linhas.map(linha => linha.projeto_id)
    }


}
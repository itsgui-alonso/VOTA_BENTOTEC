import { VotosRepository } from "../repositories/Votos.repository.js";
import { CurtidasRepository } from "../repositories/Curtidas.repository.js";
import redis from "../database/redis.js";



const TTL_CACHE_RELATORIO = 30 // 30 segundo porque vai  ter que atuazlair mais rapido

const CHAVE_CATEGORIAS = "relatorio:categorias"
const CHAVE_PROJETOS = "relatorio:projetos"
const CHAVE_RESUMO = 'relatorio:resumo'

export class RelatorioServices{
    static async totalVotosPorCategoria(){
        const cacheado = await redis.get(CHAVE_CATEGORIAS)

        if(cacheado){
            return JSON.parse(cacheado)
        }

        const resultado = await VotosRepository.totalVotosPorCategoria()

        await redis.set(CHAVE_CATEGORIAS, JSON.stringify(resultado), "EX", TTL_CACHE_RELATORIO)

        return resultado
    }

    static async totalVotosPorProjeto(){
        const cacheado = await redis.get(CHAVE_PROJETOS)

        if(cacheado){
            return JSON.parse(cacheado)
        }

        const resultado = await VotosRepository.totalVotosPorProjeto()

        await redis.set(CHAVE_PROJETOS, JSON.stringify(resultado), "EX", TTL_CACHE_RELATORIO)

        return resultado
    }

    static async resumo(){
        const cacheado = await redis.get(CHAVE_RESUMO)
        if(cacheado){
            return JSON.parse(cacheado) // tranforma para objeto
        }

        const [porDia, maisCurtidos] = await Promise.all([
            VotosRepository.totalVotosPorDia(), 
            CurtidasRepository.maisCurtidos(4)
        ])

        const resultado = {
            total: porDia.reduce((soma, d) => soma + d.total, 0),
            dias: porDia.map(d => ({
                data: d.data,
                dia: Number(d.data.slice(8, 10)),
                total: d.total
            })),
            maisCurtidos
        }

        await redis.set(CHAVE_RESUMO, JSON.stringify(resultado), 'EX', TTL_CACHE_RELATORIO)
        return resultado
    }
}
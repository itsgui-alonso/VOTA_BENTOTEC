import { VotosRepository } from "../repositories/Votos.repository.js";
import redis from "../database/redis.js";
import { cache } from "react";

const TTL_CACHE_RELATORIO = 30 // 30 segundo porque vai  ter que atuazlair mais rapido

const CHAVE_CATEGORIAS = "relatorio:categorias"
const CHAVE_PROJETOS = "relatorio:projetos"

export class RelatorioServices{
    static async totalVotosPorCategoria(){
        const cacheado = await redis.get(cacheado)

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
}
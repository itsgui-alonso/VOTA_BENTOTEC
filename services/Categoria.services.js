import { CategoriaRepository } from "../repositories/Categoria.repository.js";
import redis from "../database/redis.js";
import { cache } from "react";

const CHAVE_CACHE = 'categorias:todas' // chave fixa, a lista é igual para todos
const TTL_CACHE1h = 3600 // 1 hora, nunca mudam

export class CategoriaServices {
    static async listar(){
        const cacheado = await redis.get(CHAVE_CACHE)
        if(cacheado) return JSON.parse(cacheado) // devolve sem ir ao banco

        const categorias = await CategoriaRepository.listarTodas() // se não vai para o banco
        await redis.set(CHAVE_CACHE, JSON.stringify(categorias), 'EX', TTL_CACHE1h) // guarda por 1 hora
        return categorias
    }
}
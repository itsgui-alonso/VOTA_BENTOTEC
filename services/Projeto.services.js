import { ProjetoRepository } from "../repositories/Projeto.repository.js";
import { AppError } from "../models/errors/AppError.js";
import redis from "../database/redis.js";
import { cache } from "react";


const TTL_CACHE_PROJETOS90 = 90 // segundos que o cache fica valendo. TTL = tempo de vida -  1min e 30
const TTL_CACHE_PROJETOS300 = 300 // segundos que o cache fica valendo. TTL = tempo de vida - 5 min

const PREFIXO_CACHE_PROJETOS = 'projetos:busca:' // prefixo que vamos criar para a chave. Para facilitar achar/apagar essa chave depois

function montarChaveCacheProjetos({ busca, categoria, orientador, page, limit }){
    return `${PREFIXO_CACHE_PROJETOS}${JSON.stringify({ busca, categoria, orientador, page, limit })}`
}
export class ProjetoServices {
    
    static async buscarProjetoPorId(id){
        const chave = `projeto:id:${id}`
        
        const cacheado = await redis.get(chave)

        if(cacheado){
            return  JSON.parse(cacheado) // Tranforma em objeto JSON - veio String
        }

        const projeto = await ProjetoRepository.buscarProjetoID(id)

        if(!projeto){
            throw new AppError('Projeto não encontrado', 404)
        }

        await redis.set(chave, JSON.stringify(projeto), "EX", TTL_CACHE_PROJETOS300) // Usei um TTL de 5 min por ser uma busca extremamente especifica de ID

        return projeto
    }

    static async buscarNomeProjeto(nomeProjeto){
        const chave = `projeto:nome:${nomeProjeto.toLowerCase()}` // tudo para minusculo

        const cacheado = await redis.get(cacheado)

        if(cacheado){
            return JSON.parse(cacheado)
        }

        const projeto = await ProjetoRepository.buscarNomeProjeto(nomeProjeto)

        if(!projeto){
            throw new AppError('Projeto não encontrado', 404)
        }

        await redis.set(chave, JSON.stringify(projeto), "EX", TTL_CACHE_PROJETOS300)

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
        const chave = `projetos:categoria:${categoriaId}`

        const cacheado = await redis.get(chave)

        if(cacheado){
            return JSON.parse(cacheado)
        }

        const projetos = await ProjetoRepository.buscarProjetosCategoria(categoriaId)
        
        if(!projetos || projetos.length === 0){
            throw new AppError("Projeto não encontrado", 404);
        }
        
        await redis.set(chave, JSON.stringify(projetos), "EX", TTL_CACHE_PROJETOS300)
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

    // Aqui vai ser usado na rota GET bentovote/v1/projetos

    static async buscarProjetos({busca, categoria, orientador, page, limit}){

        const chave = montarChaveCacheProjetos({ busca, categoria, orientador, page, limit })
        // Variavel cacheado = cria a chave de cache dentro do redis
        const cacheado = await redis.get(chave)
        
        // Se existir esse cache já no redis, ele só devolve e é isso
        if(cacheado){
            return JSON.parse(cacheado) // aquilo que era texto, tranforma para objeto JSON novamente
        }

        // Caso não tenha o cache já criado: vai buscar no Postgres, antes de mandar a informação salva no redis para depois já ter aqula info no redis
        const { projetos, total } = await ProjetoRepository.buscarProjetosPaginado({ busca, categoria, orientador, page, limit})

        const resultado = {
            projetos, 
            paginacao: {
                page,
                limit, 
                total, 
                totalPaginas: Math.ceil(total / limit) || 1 // Aqui ele nunca pode ser zero, ele vaia arrendonadr sempre o numero para inteiro
                // Ou se não ele vai colocar 1
            }
        }

        // Como eu falei, pega do banco e antes de devolver a resposta salva em um cache do redis
        await redis.set(chave, JSON.stringify(resultado), 'EX', TTL_CACHE_PROJETOS90) // JSON.stringify tranforma para texto pois a chave trabalha somente com texto

        return resultado
    }
}
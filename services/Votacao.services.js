import redis from "../database/redis.js"
import { AppError } from "../models/errors/AppError.js"

const CHAVE_ENCERRADA = 'votacao:encerrada'

export class VotacaoService {

    static async estaEncerrada(){
        if(process.env.VOTACAO_ENCERRADA === 'true') return true // trava de emergência (Render)
        return (await redis.get(CHAVE_ENCERRADA)) === '1'        // trava do Redis
    }

    // Chamada no começo das ações de voto: se estiver encerrada, para tudo aqui
    static async garantirAberta(){
        if(await VotacaoService.estaEncerrada()){
            throw new AppError('A votação foi encerrada!', 403)
        }
    }

    static async encerrar(){
        await redis.set(CHAVE_ENCERRADA, '1') // sem 'EX': não expira sozinha
    }

    static async reabrir(){
        await redis.del(CHAVE_ENCERRADA)
    }
}
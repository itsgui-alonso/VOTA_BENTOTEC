import redis from "../database/redis.js"
import { Session } from "../models/Session.js"

function chaveToken(token){
    return `session:token:${token}`
}

function chaveUsuario(userId){
    return `session:user:${userId}`
}
export class SessionRepository{

    static async salvarSessao(session){
        const token = session.tokenSession
        const userId = session.userIdSession
        const createAt = session.create_atSession
        const expiresAt = session.expires_atSession

        const TTLSegundos = Math.max(1, Math.round((expiresAt.getTime() - Date.now()) / 1000 ))
        const dados = { userId, token, create_at: createAt, expires_at: expiresAt }

        await redis.set(chaveToken(token), JSON.stringify(dados), "EX", TTLSegundos)
        await redis.set(chaveUsuario(userId), token, 'EX', TTLSegundos)

        return new Session({ id: null, userId, token, create_at: createAt, expires_at: expiresAt })
    }

    static async buscarSession(token, userId){
        const dado = await redis.get(chaveToken(token))

        if(!dado){
            return null
        }

        const dados = JSON.parse(cru)

        if(userId !== null && dados.userId !== userId){
            return null
        }

        return new Session({
            id: null,
            userId: dados.userId,
            token: dados.token,
            create_at: new Date(dados.create_at),
            expires_at: new Date(dados.expires_at)
        })
    }

    static async buscarSessionPorId(userId){
        const token = await redis.get(chaveUsuario(userId))

        if(!token){
            return null
        }

        const session = await this.buscarSession(token, userId)

        if(!session){
            await redis.del(chaveUsuario(userId))
        }

        return session
    }

    static async deletarSession(tokenDelete){
        await redis.del(chaveToken(tokenDelete))
    }

}
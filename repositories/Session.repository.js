import prisma from "../database/prisma.js";
import { Session } from "../models/Session.js"

export class SessionRepository{

    static async salvarSessao(session){
        const data = await prisma.session.create({
            data: {
                userId: session.userIdSession,
                token: session.tokenSession,
                create_at: session.create_atSession,
                expires_at: session.expires_atSession
            }
        })

        return new Session(data)
    }

    static async buscarSession(token, userId){
        const session = await prisma.session.findUnique({
            where:{
                token: token
            }
        })

        if(!session){
            return null
        }

        if(userId !== null && session.userId !== userId){
            return null
        }

        return new Session(session)
    }

    static async buscarSessionPorId(userId){
        const session = await prisma.session.findFirst({
            where:{
                userId: userId
            }
        })

        if(!session){
            return null
        }

        return new Session(session)
    }

    static async deletarSession(tokenDelete){
        const session = await prisma.session.delete({
            where:{
                token: tokenDelete
            }
        })
    }

}
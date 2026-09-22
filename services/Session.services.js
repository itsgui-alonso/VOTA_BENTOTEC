import { UserRepository } from "../repositories/User.repository.js";
import { SessionRepository } from "../repositories/Session.repository.js";
import { Session } from "../models/Session.js";
import crypto  from "crypto"

export class SessionService{

    static async CriarSession(qrCodeEscaneado){
        // Olha se existe o qrcode sacaneado
        const crachaUser = await UserRepository.verificarQrCode(qrCodeEscaneado)

        if(!crachaUser){
            throw new Error('Usuario não existe! QrCode invalido!')
        }

        // Olha se a session esta ativa, se sim deleta 

        const sessionAtiva = await SessionRepository.buscarSessionPorId(crachaUser.idUsuario)

        if(sessionAtiva){
            await SessionRepository.deletarSession(sessionAtiva.tokenSession)
        }

        // Cria o token e o tempo

        const tokenCriado = crypto.randomUUID()

        const expiresAt = new Date()

        expiresAt.setMinutes( expiresAt.getMinutes() + 10)

        //Cria a sessao em objeto para mandar para o banco

        const session = new Session({
            id: null, 
            userId: crachaUser.idUsuario,
            token: tokenCriado,
            create_at: new Date(),
            expires_at: expiresAt 
            
    })

        const sessionCriada = await SessionRepository.salvarSessao(session)

        return sessionCriada

    }
}
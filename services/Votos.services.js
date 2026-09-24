import { Votos } from "../models/Votos.js"
import { VotosRepository } from "../repositories/Votos.repository.js"
import { ProjetoRepository } from "../repositories/Projeto.repository.js"
import { SessionRepository } from "../repositories/Session.repository.js"
import { AppError } from "../models/errors/AppError.js"
export class VotosService{

    // Verifica se a session existe
    static async votarProjeto(token, projectId){
        const session = await SessionRepository.buscarSession(token, null)

        if(!session){
            throw new AppError('Sessão Invalida! Precisa de um Token válido ou existente para votar', 401)
        }
        // Verfica se a session expirou
        const dataHoraHoje = new Date()

        if(dataHoraHoje > session.expires_atSession){
            await SessionRepository.deletarSession(token)
            throw new AppError('Sessão Expirou! Tente novamente', 401)
        }

        // Verfica se o projeto existe
        const projeto = await ProjetoRepository.bucarProjetoID(projectId)

        if(!projeto){
            throw new AppError('O Projeto não existe! Busque por um projeto existente', 404)
        }

        const votosCategoria = await VotosRepository.verficarQuantosVotosUserCategoria(
            session.userIdSession,
            projeto.categoriaIdProjeto
        )
        // O maximo por categoria é 1 voto
        if(votosCategoria >= 1){
            throw new AppError('Limite de votos atingido nessa categoria! O maximo permitido é 1 voto por categoria!', 409)
        }


        const voto = new Votos({
            id: null,
            userId: session.userIdSession,
            projectId: projeto.idProjeto,
            categoryId: projeto.categoriaIdProjeto,
            create_at: new Date()
        })

        const votoFeito = await VotosRepository.salvarVoto(voto)
        // Ele deleta pois após o voto, ele não vai usar a mesmo token de session
        await SessionRepository.deletarSession(token)
        return votoFeito
    }
    
}
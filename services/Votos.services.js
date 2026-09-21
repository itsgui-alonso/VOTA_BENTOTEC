import { Votos } from "../models/Votos.js"
import { VotosRepository } from "../repositories/Votos.repository.js"
import { ProjetoRepository } from "../repositories/Projeto.repository.js"
import { SessionRepository } from "../repositories/Session.repository.js"

export class VotosService{

    // Verifica se a session existe
    static async votarProjeto(token, projectId){
        const session = await SessionRepository.buscarSession(token, null)

        if(!session){
            throw new Error ('Sessão Invalida!')
        }
        // Verfica se a session expirou
        const dataHoraHoje = new Date()

        if(dataHoraHoje > session.expires_atSession){
            await SessionRepository.deletarSession(token)
            throw new Error ('Sessão Expirou! Tente novamente')
        }

        // Verfica se o projeto existe
        const projeto = await ProjetoRepository.bucarProjetoID(projectId)

        if(!projeto){
            throw new Error ('O projeto não existe!')
        }

        const votosCategoria = await VotosRepository.verficarQuantosVotosUserCategoria(
            session.userIdSession, projeto.categoryIdProjeto
        )
        // Verfica quantos 
        if(votosCategoria.length >= 3){
            throw new Error ('Limite de votos atingido nessa categoria! O maximo são 3 votos por categoria!')
        }

        // limite de 1 voto por projeto

        const projetoVotado = votosCategoria.find(voto => voto.projectIdVoto === projectId)

        if(projetoVotado){
            throw new Error('Você ja votou nesse projeto! Vote em outro projeto!')
        }

        const voto = new Votos(
            null,
            session.userIdSession,
            projeto.idProjeto,
            projeto.categoryIdProjeto,
            new Date()
        )

        const votoFeito = await VotosRepository.salvarVoto(voto)
        await SessionRepository.deletarSession(token)
        return votoFeito
    }
    
}
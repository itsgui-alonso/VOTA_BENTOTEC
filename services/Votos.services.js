import { Votos } from "../models/Votos.js"
import { VotosRepository } from "../repositories/Votos.repository.js"
import { ProjetoRepository } from "../repositories/Projeto.repository.js"
import { SessionRepository } from "../repositories/Session.repository.js"
import { AppError } from "../models/errors/AppError.js"
export const LIMITE_VOTOS_CATEGORIA = 1
export class VotosService{

    // Verifica se a session existe
    static async votarProjeto(token, projectId){
        const session = await SessionRepository.buscarSession(token, null)

        if(!session){
            throw new AppError('Sessão inválida ou expirada! Escaneie novamente para votar', 401)
        }

        // Verfica se o projeto existe
        const projeto = await ProjetoRepository.buscarProjetoID(projectId)

        if(!projeto){
            throw new AppError('O Projeto não existe! Busque por um projeto existente', 404)
        }

        const votosCategoria = await VotosRepository.verficarQuantosVotosUserCategoria(
            session.userIdSession,
            projeto.categoriaIdProjeto
        )
        // O maximo por categoria é 1 voto

           

        if(votosCategoria >= LIMITE_VOTOS_CATEGORIA){
            throw new AppError(`Limite de votos atingido nessa categoria!  O máximo permitido é ${LIMITE_VOTOS_CATEGORIA} voto(s) por categoria!`, 409)
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
    
    static async consultarVotosRestantes(token, projectId) {
        const session = await SessionRepository.buscarSession(token, null) // confere o token
        if(!session){
            throw new AppError('Sessão inválida ou expirada! Escaneie novamente', 401)
        }

        const projeto = await ProjetoRepository.buscarProjetoID(projectId) // confere o projeto
        if(!projeto){
            throw new AppError('O Projeto não existe!', 404)
        }

        const categoria = await ProjetoRepository.buscarCategoria(projeto.categoriaIdProjeto)

        const usados = await VotosRepository.verficarQuantosVotosUserCategoria(
            session.userIdSession,
            projeto.categoriaIdProjeto
        )

        const restantes = Math.max(0, LIMITE_VOTOS_CATEGORIA - usados) // nunca vai ser negativo

        return {
            categoria: { id: projeto.categoriaIdProjeto, nome: categoria?.nome_categoria ?? 'Sem categoria' },
            limite: LIMITE_VOTOS_CATEGORIA, // quantos votos por categoria
            usados, // votos usados
            restantes, // votos restantes
            restantes_apos_voto: Math.max(0, restantes - 1), // quantos votos sobram apos votar nesse
            pode_votar: restantes > 0 // false = já esgotou a categoria
        }
    }
}
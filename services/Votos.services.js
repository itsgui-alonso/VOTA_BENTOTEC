import { Votos } from "../models/Votos.js"
import { VotosRepository } from "../repositories/Votos.repository.js"
import { ProjetoRepository } from "../repositories/Projeto.repository.js"
import { SessionRepository } from "../repositories/Session.repository.js"
import { AppError } from "../models/errors/AppError.js"
import redis from "../database/redis.js"

export const LIMITE_VOTOS_CATEGORIA = 3 // <- era 1

export class VotosService{

    static async votarProjeto(token, projectId){
        const session = await SessionRepository.buscarSession(token, null)

        if(!session){
            throw new AppError('Sessão inválida ou expirada! Escaneie novamente para votar', 401)
        }

        const projeto = await ProjetoRepository.buscarProjetoID(projectId)

        if(!projeto){
            throw new AppError('O Projeto não existe! Busque por um projeto existente', 404)
        }

        // Trava curta por usuário + categoria: impede dois votos simultâneos (duplo clique, duas abas)
        const chaveTrava = `trava:voto:${session.userIdSession}:${projeto.categoriaIdProjeto}`
        const conseguiuTrava = await redis.set(chaveTrava, '1', 'EX', 5, 'NX')

        if(!conseguiuTrava){
            throw new AppError('Seu voto está sendo processado, aguarde um instante', 429)
        }

        try{
            // 1) Já votou NESSE projeto? (checa antes de salvar para dar uma mensagem amigável)
            const votoExistente = await VotosRepository.buscarVotoUserProjeto(
                session.userIdSession,
                projeto.idProjeto
            )

            if(votoExistente){
                throw new AppError('Você já votou nesse projeto! Escolha outro projeto', 409)
            }

            // 2) Ainda tem voto sobrando nessa categoria?
            const votosCategoria = await VotosRepository.verficarQuantosVotosUserCategoria(
                session.userIdSession,
                projeto.categoriaIdProjeto
            )

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

            // 3) Rede de segurança: se mesmo assim o banco recusar por duplicidade, vira 409 e não 500
            try{
                return await VotosRepository.salvarVoto(voto)
            }catch(erro){
                if(erro.code === 'P2002'){ // código do Prisma para "violou um @@unique"
                    throw new AppError('Você já votou nesse projeto! Escolha outro projeto', 409)
                }
                throw erro // qualquer outro erro continua sendo tratado como erro de verdade
            }
            // NÃO deleta mais a sessão aqui: ela vale pelos 10 minutos do TTL
        }finally{
            await redis.del(chaveTrava) // libera a trava, deu certo ou errado
        }
    }

    static async consultarVotosRestantes(token, projectId) {
        const session = await SessionRepository.buscarSession(token, null)
        if(!session){
            throw new AppError('Sessão inválida ou expirada! Escaneie novamente', 401)
        }

        const projeto = await ProjetoRepository.buscarProjetoID(projectId)
        if(!projeto){
            throw new AppError('O Projeto não existe!', 404)
        }

        const categoria = await ProjetoRepository.buscarCategoria(projeto.categoriaIdProjeto)

        const usados = await VotosRepository.verficarQuantosVotosUserCategoria(
            session.userIdSession,
            projeto.categoriaIdProjeto
        )

        const votoExistente = await VotosRepository.buscarVotoUserProjeto(
            session.userIdSession,
            projeto.idProjeto
        )

        const restantes = Math.max(0, LIMITE_VOTOS_CATEGORIA - usados)

        return {
            categoria: { id: projeto.categoriaIdProjeto, nome: categoria?.nome_categoria ?? 'Sem categoria' },
            limite: LIMITE_VOTOS_CATEGORIA,
            usados,
            restantes,
            restantes_apos_voto: Math.max(0, restantes - 1),
            pode_votar: restantes > 0,
            ja_votou_projeto: !!votoExistente // novo: o front usa para avisar antes de tentar votar
        }
    }
}
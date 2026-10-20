import { EventosRepository } from "../repositories/Eventos.repository.js";
import redis from "../database/redis.js";

const TTL_CACHE_EVENTOS = 60 // segundos. Se mudar um evento no banco, a tela atualiza em até 1 min
const TTL_CACHE_AGORA = 15   // "acontecendo agora" muda mais rápido, então o cache é menor

async function comCache(chave, ttl, buscar) {
    const cacheado = await redis.get(chave)

    if(cacheado){
        return JSON.parse(cacheado)
    }

    const resultado = await buscar()
    await redis.set(chave, JSON.stringify(resultado), "EX", ttl)

    return resultado
}

export class EventosServices {
    static async agenda(dataPedida){
        // Dias que têm evento, no formato da tela: { data: '2026-10-21', dia: 21 }
        const dias = await comCache('eventos:dias', TTL_CACHE_EVENTOS, async () => {
            const linhas = await EventosRepository.listarDias()
            return linhas.map(l => ({ data: l.data, dia: Number(l.data.slice(8, 10)) }))
        })

        const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })

        // Qual dia mostrar?  1º o que o front pediu  →  2º hoje (se for dia de evento)  →  3º o primeiro dia
        const diaEscolhido = dataPedida
            ?? (dias.some(d => d.data === hoje) ? hoje : dias[0]?.data ?? null)

        // As duas buscas rodam AO MESMO TEMPO (Promise.all), não uma esperando a outra
        const [eventos, agora] = await Promise.all([
            diaEscolhido
                ? comCache(`eventos:dia:${diaEscolhido}`, TTL_CACHE_EVENTOS, () => EventosRepository.listarPorDia(diaEscolhido))
                : [],
            comCache('eventos:agora', TTL_CACHE_AGORA, () => EventosRepository.listarAgora())
        ])

        return { hoje, data: diaEscolhido, dias, agora, eventos }
    }
}
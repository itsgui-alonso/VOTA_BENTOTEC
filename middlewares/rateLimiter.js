import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../database/redis.js";

// Cada limiter precisa de um prefixo proprio no Redis
// Senão os contadores de rotas diferentes se misturam
function criarLimiter({ prefixo, limite, janelaMS, mensagem }){
    return rateLimit({
        windowMs: janelaMS, // tamanho da janela de contagem
        limit: limite, // maximo de requisiçoes de um IP dentro de uma janela de tempo
        standardHeaders: 'draft-8', // devolve o RateLimit para saber quantas restam
        legacyHeaders: false, // desliga os hearders antigos
        passOnStoreError: true, // Se o redis carir deixa passar (se nao ele travaria o sistema inteiro)
        message: { erro: mensagem }, // Corpo do 429
        store: new RedisStore({
            prefix: `rl:${prefixo}:`,
            // Ponte entre a lib e o ioredis: repassa o comando cru para o Redis
            sendCommand: (...args) => redis.call(...args),
        })
    })
}

// Rede de segurança para a API inteira
export const LimiterGlobal = criarLimiter({
    prefixo: 'global',
    limite: 100,
    janelaMS: 60 * 1000,
    mensagem: 'Muitas requisições. Tente novamente em instantes.'
})

// Impde de testar QrCodes aleatorios em sequencia
export const LimiterSession = criarLimiter({
    prefixo: 'session',
    limite: 10,
    janelaMS: 60 * 1000,
    mensagem: 'Muitas tentativas de validação! Aguarde um minuto'
})

// Impede a tentaiva de varios votos em um unico momento
export const LimiterVotos = criarLimiter({
    prefixo: 'votos',
    limite: 10,
    janelaMS: 60 * 1000,
    mensagem: 'Muitas tentativas de votos. Aguarde um minuto'
})

// Limita o cara adivinhar varias vezes o FISHVISION_WEBHOOK_SECRET 
export const LimiterWebhook = criarLimiter({
    prefixo: 'webhook',
    limite: 20,
    janelaMS: 60 *  1000,
    mensagem: 'Muitas requisições do webhook'
})
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2, // desiste do comando após 2 tentativas
    connectTimeout: 10000, // espera até 10 segundos para conectar
    keepAlive: 10000, // manda um sinal a cada 10s para a conexão nao ficar osiosa
    retryStrategy: (tentativa) => Math.min(tentativa * 500, 5000) // reconecta a cada 0,5s até 5s
})

redis.on('error', (erro) => {
    console.error('Erro na conexão com o Redis: ', erro.message)
})

export default redis
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

redis.on('error', (erro) => {
    console.error('Erro na conexão com o Redis: ', erro.message)
})

export default redis
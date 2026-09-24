import "dotenv/config";
import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import SessionRoutes from '../routes/SessionRoutes.js'
import VotosRoutes from '../routes/VotosRouter.js'
import RelatorioRoutes from '../routes/RelatorioRoutes.js'
import WebhookRoutes from '../routes/WebhookRoutes.js'
import { errorHandler } from "../middlewares/errorHandler.js";
const app = express();
const PORT = process.env.PORT || 3000
// Header de segurança nas respostas
app.use(helmet())

const origensPermitidas = (process.env.CORS_ORIGENS || '')
.split(',') // Spara aonde tem virgula
.map((origem) => origem.trim()) // Tira os espaços de cada item
.filter(Boolean) // Remove ites vazios

app.use(cors({
    origin(origin, callback){
        // Sem header Origin (webhook, Postman, curl): não é navegador, deixa passar
        if(origin) return callback(null, true)
        // A origem está na lista, então deixa passar
        if(origensPermitidas.includes(origin)) return callback(null, true)
        //Qualquer coisa, sem ser esses dois acima - NAvegador Bloqueia
        return callback(null, false)
    }
}))
// MIDDLEWARE: Essencial para o Express conseguir ler o JSON enviado no corpo (body)
// Leitura com limite de tamanho, ideal para o que estamos usando
app.use(express.json({limit: '10kb'}));

app.use('bentovote/v1/relatorio', RelatorioRoutes)
app.use('bentovote/v1/session', SessionRoutes)
app.use('bentovote/v1/votos', VotosRoutes)
app.use('bentotec/v1/webhook', WebhookRoutes)

app.use(errorHandler)
// Tratador de erro simples, depois da rota
app.use((erro, req, res, next) => {
    if(erro.type === 'entity.too.large') {
        return res.status(413).json({erro: 'O corpo da requisição é muito grande! O limite é de 10kb'})
    }
    return res.status(erro.status || 500).json({erro: erro.message})
})
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
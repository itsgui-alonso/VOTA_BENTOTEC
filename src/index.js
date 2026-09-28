import "dotenv/config";
import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import SessionRoutes from '../routes/SessionRoutes.js'
import VotosRoutes from '../routes/VotosRouter.js'
import RelatorioRoutes from '../routes/RelatorioRoutes.js'
import WebhookRoutes from '../routes/WebhookRoutes.js'
import ProjetoRoutes from '../routes/ProjetoRoutes.js'
import { errorHandler, RotaNaoEncontrada } from "../middlewares/errorHandler.js";
import { LimiterGlobal, LimiterSession, LimiterVotos, LimiterWebhook } from "../middlewares/rateLimiter.js";
const app = express();
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3000
// Header de segurança nas respostas
app.use(helmet())

app.use(LimiterGlobal)

const origensPermitidas = (process.env.CORS_ORIGENS || '')
.split(',') // Spara aonde tem virgula
.map((origem) => origem.trim()) // Tira os espaços de cada item
.filter(Boolean) // Remove ites vazios

app.use(cors({
    origin(origin, callback){
        // Sem header Origin (webhook, Postman, curl): não é navegador, deixa passar
        if(!origin) return callback(null, true)
        // A origem está na lista, então deixa passar
        if(origensPermitidas.includes(origin)) return callback(null, true)
        //Qualquer coisa, sem ser esses dois acima - NAvegador Bloqueia
        return callback(null, false)
    }
}))
// MIDDLEWARE: Essencial para o Express conseguir ler o JSON enviado no corpo (body)
// Leitura com limite de tamanho, ideal para o que estamos usando
app.use(express.json({limit: '10kb'}));

app.use('/bentovote/v1/relatorio', RelatorioRoutes)
app.use('/bentovote/v1/session', LimiterSession, SessionRoutes)
app.use('/bentovote/v1/votos', LimiterVotos, VotosRoutes)
app.use('/bentovote/v1/webhook', LimiterWebhook, WebhookRoutes)
app.use('/bentovote/v1/projetos', ProjetoRoutes)

// RotaNaoEncontrada vem depois de todas as rotas. errorHandler vem por último, porque só recebe erros vindos de tudo que está antes dele.
app.use(RotaNaoEncontrada)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
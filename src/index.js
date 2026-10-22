import "dotenv/config";
import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import SessionRoutes from '../routes/SessionRoutes.js'
import VotosRoutes from '../routes/VotosRouter.js'
import RelatorioRoutes from '../routes/RelatorioRoutes.js'
import WebhookRoutes from '../routes/WebhookRoutes.js'
import ProjetoRoutes from '../routes/ProjetoRoutes.js'
import CurtidasRoutes from '../routes/CurtidasRoutes.js'
import CategoriaRoutes from '../routes/CategoriaRoutes.js'
import EventosRoutes from '../routes/EventosRoutes.js'
import AdminRoutes from '../routes/AdminRoutes.js'
import { errorHandler, RotaNaoEncontrada } from "../middlewares/errorHandler.js";
import { LimiterGlobal, LimiterSession, LimiterVotos, LimiterWebhook, LimiterCurtidas } from "../middlewares/rateLimiter.js";

const app = express();
app.set('trust proxy', 1)
const PORT = process.env.PORT || 3000

// Header de segurança nas respostas
app.use(helmet())

const origensPermitidas = (process.env.CORS_ORIGENS || '')
    .split(',')
    .map(origem => origem.trim())
    .filter(Boolean);

app.use(cors({
    origin(origem, callback) {
        // Permite requisições sem Origin
        if (!origem) return callback(null, true);

        // Permite origens cadastradas
        if (origensPermitidas.includes(origem)) {
            return callback(null, true);
        }

        // Bloqueia outras origens
        return callback(new Error('Origem não permitida pelo CORS'));
    }
}));

// MIDDLEWARE: Essencial para o Express conseguir ler o JSON enviado no corpo (body)
// Leitura com limite de tamanho, ideal para o que estamos usando
app.use(express.json({limit: '10kb'}));
app.use(LimiterGlobal)

// ROTAS
app.use('/bentovote/v1/relatorio', RelatorioRoutes)
app.use('/bentovote/v1/session', LimiterSession, SessionRoutes)
app.use('/bentovote/v1/votos', LimiterVotos, VotosRoutes)
app.use('/bentovote/v1/webhook', LimiterWebhook, WebhookRoutes)
app.use('/bentovote/v1/projetos', ProjetoRoutes)
app.use('/bentovote/v1/categorias', CategoriaRoutes)
app.use('/bentovote/v1/curtidas', LimiterCurtidas, CurtidasRoutes)
app.use('/bentovote/v1/eventos', EventosRoutes)
app.use('/bentovote/v1/admin', AdminRoutes)

// RotaNaoEncontrada vem depois de todas as rotas. errorHandler vem por último.
app.use(RotaNaoEncontrada)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
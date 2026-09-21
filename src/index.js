import express from 'express';
import SessionRoutes from '../routes/SessionRoutes.js'
import VotosRoutes from '../routes/VotosRouter.js'
import RelatorioRoutes from '../routes/RelatorioRoutes.js'
import WebhookRoutes from '../routes/WebhookRoutes.js'
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 3000

// MIDDLEWARE: Essencial para o Express conseguir ler o JSON enviado no corpo (body)
app.use(express.json());

app.use(WebhookRoutes)
app.use(SessionRoutes)
app.use(VotosRoutes)
app.use(RelatorioRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
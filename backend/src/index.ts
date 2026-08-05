import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import orderRoutes from './routes/orders';
import apiRoutes from './routes/api'; // Importando a rota antiga de artes/baking

const app = express();

/**
 * 🔒 Regra de Segurança OpenAI: Proteção de Headers, CORS e Request Limits
 */
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Impede que sites terceiros enviem requests pro seu servidor, exceto o seu próprio Next.js
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
}));

// Limita o tamanho do JSON recebido evitando Buffer Overallocation / DOS
app.use(express.json({ limit: '5mb' }));

/**
 * Rate Limit Global
 * (Evita que pessoas façam scrap/derrubem as outras APIs da loja)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Requisitou demais pro Backend! Vai descansar.' },
});
app.use(generalLimiter);

// ----------------------------------------------------
// Rotas da Nossa Loja ("API B2C & Baking")
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Texture Baking / Orders Bastião Operacional 🔥' });
});

app.use('/api/orders', orderRoutes);
app.use('/api', apiRoutes); // Registrando as rotas de busca de artes e simulador!

// Catch Error Default (Impede que o servidor crashe e vaze a Stack Trace de erros para os clientes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]:', err.message);
  res.status(500).json({ error: 'Erro de processamento interno no servidor.' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Baking Service running on port ${PORT}`);
});

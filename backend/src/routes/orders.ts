import { Router } from 'express';
import { createOrder } from '../controllers/orderController';
import rateLimit from 'express-rate-limit';

const router = Router();

/**
 * 🔒 Regra de Segurança OpenAI: Rate Limiting
 * Limita tentativas massivas/botting especificamente na rota de Checkout/Pedidos
 */
const checkoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // Janela de 5 minutos
  max: 10, // Máximo de 10 requisições (tentativas de carrinho) por rota IP
  message: { error: 'Muitas tentativas de compras simultâneas para este IP. Tente novamente em 5 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// A rota oficial B2C (A Sacola 3D clica em comprar, e salva no Supabase)
router.post('/', checkoutLimiter, createOrder);

export default router;

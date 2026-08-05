import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { supabase } from '../config/supabase';

/**
 * Validar estritamente o Payload de entrada
 * Prática de segurança: Zod Parser (Impede Injeções NOSQL / Arbitrary Code Execution via body)
 */
const OrderSchema = z.object({
  total_amount: z.number().positive(),
  shipping_address: z.object({
    fullname: z.string().min(3).max(100),
    zipCode: z.string().min(8).max(10), // CEP
    street: z.string().min(3).max(150),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string().length(2),
  }),
  items: z.array(
    z.object({
      color: z.string(),
      size: z.string(),
      fabric: z.string().optional(),
      baked_texture_url: z.string().url().optional(),
      customization_details: z.any().optional(), // { scale, posX, face }
      quantity: z.number().int().positive().max(500),
      unit_price: z.number().positive(),
    })
  ).min(1),
  user_id: z.string().uuid().optional(), // Caso já venha autenticado futuramente
});

// Tabela MOCK de preços reais para impedir injeção (No futuro isso pode vir do banco de dados)
const PRICE_TABLE = {
  materials: {
    '100% Algodão': 70, // Base
    'Pv': 65,
    'Poliester': 50,
  } as Record<string, number>,
  collars: {
    'Gola-Redonda': 0, // Sem ajuste
    'Gola-V': 5,
    'Ribana-Premium': 10,
    'Gola-Alta': 15,
  } as Record<string, number>,
  baseMarkup: 89.90, // Falback de segurança caso a matemática zere
};

export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Zod vai quebrar o código e pular pro Catch se um campo malicioso ou faltando for enviado
    const parsedBody = OrderSchema.parse(req.body);

    const orderId = uuidv4();

    // [SECURITY FIX] Cálculo rígido de preço blindado no Backend (Ignorando valores do user)
    // O backend pega cada item que o usuário quer comprar e constrói o preço da tabela privada.
    const itemsToInsert = parsedBody.items.map((item) => {
      // Ex: item.customization_details.collar <- assumindo que gravamos no payload do form
      const collarType = item.customization_details?.collar || 'Gola-Redonda';
      const parsedMaterial = item.fabric || '100% Algodão';

      const basePrice = PRICE_TABLE.materials[parsedMaterial] || PRICE_TABLE.baseMarkup;
      const collarAditional = PRICE_TABLE.collars[collarType] || 0;

      const realUnitPrice = basePrice + collarAditional;

      return {
        id: uuidv4(),
        order_id: orderId,
        color: item.color,
        size: item.size,
        fabric: parsedMaterial,
        baked_texture_url: item.baked_texture_url || null,
        customization_details: item.customization_details || null,
        quantity: item.quantity,
        unit_price: realUnitPrice, // Ignora parsedBody.items[x].unit_price malicioso!
      };
    });

    // Calcula o total matematicamente em cima do que a máquina fechou (jamais sobre `parsedBody.total_amount`)
    const calculatedTotalAmount = itemsToInsert.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // 2. Insere o Pedido principal (Capa / Checkout)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: parsedBody.user_id || null, // Null no DB = Guest checkout
        status: 'pending',
        total_amount: calculatedTotalAmount,
        shipping_address: parsedBody.shipping_address, // O Postgres (Supabase) arquiva como JSONB
        freight_cost: 0, // Mock, poderia vir calculado ou da API dos Correios
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Supabase Error - Order]:', orderError);
      return res.status(500).json({ error: 'Erro ao criar a fatura do checkout.' });
    }

    // 4. Salva as camisetas que saíram lá do Simulador 3D (Carrinho)
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('[Supabase Error - Items]:', itemsError);
      return res.status(500).json({ error: 'Fatura criada, mas erro ao salvar os itens 3D.' });
    }

    // 5. Sucesso! Retorna o ID pro Frontend fechar o fluxo (ex: enviar pro Stripe ou WhatsApp)
    return res.status(201).json({
      success: true,
      order: orderData,
      message: 'Pedido criado com sucesso! Aguardando pagamento.',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Payload malformado ou campos vazios durante checkout.',
        details: error.issues
      });
    }
    console.error('[Critical createOrder error]', error);
    return res.status(500).json({ error: 'Erro generalizado de servidor (Checkout).' });
  }
};

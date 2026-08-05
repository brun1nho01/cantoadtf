import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente com base na raiz do backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ SUPABASE_URL ou SUPABASE_SERVICE_KEY não encontradas no arquivo .env');
}

// Cria a instância do client para utilizarmos nos Controllers
export const supabase = createClient(supabaseUrl, supabaseKey);

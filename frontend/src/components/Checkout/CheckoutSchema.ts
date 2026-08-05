import { z } from "zod";

// Mesmo Schema Zod que botamos lá no Backend no orderController.ts
// Vamos validar no frontend também antes mesmo de bater a requisição!
export const checkoutSchema = z.object({
  fullname: z.string().min(3, "Digite seu nome completo").max(100),
  zipCode: z.string().min(8, "CEP inválido").max(10),
  street: z.string().min(3, "Rua muito curta").max(150),
  number: z.string().min(1, "Obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "Digite a sigla (ex: SP)"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
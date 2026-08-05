"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

import { checkoutSchema, CheckoutFormData } from "./CheckoutSchema";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutFormProps {
  onBack: () => void;
}

export default function CheckoutForm({ onBack }: CheckoutFormProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetchingZip, setIsFetchingZip] = useState(false);
  const [cepError, setCepError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Impedir letras enquanto o usuário digita nos campos apenas numéricos
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  };

  const checkCEP = async (e: React.FocusEvent<HTMLInputElement>) => {
    const rawZip = e.target.value.replace(/\D/g, "");
    if (rawZip.length !== 8) return;

    setIsFetchingZip(true);
    setCepError(""); // Limpa o erro ao tentar buscar de novo

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${rawZip}/json/`);
      if (response.data && !response.data.erro) {
        setValue("street", response.data.logradouro);
        setValue("neighborhood", response.data.bairro);
        setValue("city", response.data.localidade);
        setValue("state", response.data.uf);
        // Colocando foco no número
        document.getElementById("number")?.focus();
      } else {
        setCepError("CEP não encontrado");
      }
    } catch (error) {
      console.error("Falha ao buscar o CEP", error);
      setCepError("Serviço de CEP indisponível");
    } finally {
      setIsFetchingZip(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Prepara a mesma estrutura que o Zod do nosso Backend exige!
      const payload = {
        total_amount: getTotalPrice(),
        shipping_address: data, // Todos os campos do Form
        items: items.map(item => ({
          color: item.shirtColor,
          size: "M", // Temporário, caso não exista no item mockado
          fabric: item.material,
          quantity: item.quantity,
          unit_price: item.price,
          // Para uma gráfica DTF real, o baked_texture_url é a chave. Aqui vai o pass-through.
          baked_texture_url: "https://minha-bucket.com/arte-protegida.webp",
          customization_details: {
            collar: item.collar,
            artworkSize: item.artworkSize
          }
        }))
      };

      // 2. Chama a API do Node.js (Nosso bastião protegido da porta 3333)
      // Como o site roda na porta 3000, apontamos direto. Em prod, vira a URL da Vercel/Render
      const response = await axios.post("http://localhost:3333/api/orders", payload);

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          clearCart(); // Limpa depois de mostrar a tela de sucesso rapidin
        }, 3000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        setErrorMsg("Você está indo muito rápido. Aguarde 5 minutos."); // Rate Limit do Backend rodou
      } else {
        setErrorMsg("Ocorreu um erro ao gerar o pedido. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-serif text-white mb-2">Pedido Emitido!</h3>
        <p className="text-white/50 text-center mb-8 text-sm">
          Sua arte está segura em nossos servidores. Aguarde o link de pagamento do Stripe no seu e-mail.
        </p>
        <Button onClick={() => window.location.href = '/'} className="w-full bg-white text-black hover:bg-gray-200 uppercase tracking-widest text-xs font-bold h-12">
          Voltar a Loja
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      <div className="p-6 border-b border-white/10 flex items-center gap-4">
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-white">Endereço de Entrega</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-xs uppercase tracking-wider text-white/70">Nome Completo</Label>
          <Input id="fullname" {...register("fullname")} className="bg-white/5 border-white/10 text-white h-12" placeholder="João da Silva" />
          {errors.fullname && <p className="text-red-400 text-xs">{errors.fullname.message}</p>}
        </div>

        {/* CEP e Número na mesma linha */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-xs uppercase tracking-wider text-white/70">CEP</Label>
            <div className="relative">
              <Input
                id="zipCode"
                {...register("zipCode")}
                onChange={(e) => {
                  handleNumericInput(e);
                  setValue("zipCode", e.target.value);
                }}
                onBlur={(e) => checkCEP(e)}
                maxLength={8}
                className="bg-white/5 border-white/10 text-white h-12"
                placeholder="00000000"
              />
              {isFetchingZip && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                </div>
              )}
            </div>
            {errors.zipCode ? (
              <p className="text-red-400 text-xs">{errors.zipCode.message}</p>
            ) : cepError ? (
              <p className="text-yellow-400 text-xs font-bold">{cepError}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="number" className="text-xs uppercase tracking-wider text-white/70">Número</Label>
            <Input
               id="number"
               {...register("number")}
               onChange={(e) => {
                 handleNumericInput(e);
                 setValue("number", e.target.value);
               }}
               maxLength={6}
               className="bg-white/5 border-white/10 text-white h-12"
               placeholder="123"
            />
            {errors.number && <p className="text-red-400 text-xs">{errors.number.message}</p>}
          </div>
        </div>

        {/* Rua */}
        <div className="space-y-2">
          <Label htmlFor="street" className="text-xs uppercase tracking-wider text-white/70">Rua</Label>
          <Input id="street" {...register("street")} className="bg-white/5 border-white/10 text-white h-12" placeholder="Av. Paulista" />
          {errors.street && <p className="text-red-400 text-xs">{errors.street.message}</p>}
        </div>

        {/* Bairro e Complemento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="text-xs uppercase tracking-wider text-white/70">Bairro</Label>
            <Input id="neighborhood" {...register("neighborhood")} className="bg-white/5 border-white/10 text-white h-12" />
            {errors.neighborhood && <p className="text-red-400 text-xs">{errors.neighborhood.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement" className="text-xs uppercase tracking-wider text-white/70">Complemento (Op)</Label>
            <Input id="complement" {...register("complement")} className="bg-white/5 border-white/10 text-white h-12" placeholder="Apto 42" />
          </div>
        </div>

        {/* Cidade e Estado */}
        <div className="grid grid-cols-[2fr_1fr] gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-xs uppercase tracking-wider text-white/70">Cidade</Label>
            <Input id="city" {...register("city")} className="bg-white/5 border-white/10 text-white h-12" />
            {errors.city && <p className="text-red-400 text-xs">{errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-xs uppercase tracking-wider text-white/70">UF</Label>
            <Input id="state" {...register("state")} className="bg-white/5 border-white/10 text-white h-12 uppercase" placeholder="SP" maxLength={2} />
            {errors.state && <p className="text-red-400 text-xs">{errors.state.message}</p>}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Espaçador para o footer fixo */}
        <div className="h-10"></div>
      </form>

      {/* FOOTER FIXO (Igual ao carrinho) */}
      <div className="p-6 border-t border-white/10 bg-black/80 backdrop-blur-md">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full h-16 rounded-xl bg-white text-black hover:bg-gray-200 text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando e Salvando...
            </>
          ) : (
            `Confirmar e Enviar - R$ ${getTotalPrice().toFixed(2).replace('.', ',')}`
          )}
        </Button>
      </div>

    </div>
  );
}
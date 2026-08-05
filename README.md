# CantoA - Confecção Premium DTF & Simulador 3D

Este projeto abriga o E-Commerce B2C focado na venda de roupas com estampas DTF e malhas premium, além de agir como esteira visual para Captação Corporativa (B2B/Atacado). A arquitetura visual segue diretrizes "AAA Brutalist & Editorial Luxury" inspiradas em grandes montadoras e grifes.

Para conferir todas as decisões de projeto primárias, verifique:
- **Design Spec Mestre:** `docs/superpowers/specs/2026-07-29-store-dtf-3d-simulator-design.md`
- **Draft de Banco de Dados:** `docs/architecture/database-schema-supabase.md`

---

## 💎 Status da Arquitetura & Entregas Concluídas

**1. Landing Page B2C (O Palco):**
- UI Premium repensada do absoluto zero. Abolido o visual genérico (SaaS) antigo.
- Sistema de cores **Midnight Studio** (`#050505`). Tipografia Serifada Colossal contrastando com elementos geométricos mínimos.
- **Hero "Cinematic Frame":** Implementado um placeholder Glassmorphism 3D de altíssimo nível (`[ Área do Canvas 3D / Render ]`) projetado para receber o futuro vídeo da máquina, um banner ou um `<Viewer3D/>` passivo.
- Funcionalidades expostas em **Brutalist Full Width Rows** (seções de tela inteira com numeração background maciça).

**2. Landing Page B2B / Wholesale:**
- O roteamento `/b2b-atacado` foi polido para conversão agressiva sem formulários maçantes.
- Redirecionamento autônomo e imediato acoplado à API do WhatsApp.
- Botões gêmeos para segregamento rápido e inteligente de Setores (*DTF/Private Label* vs *Silk/Sublimação*). 

**3. O Simulador 3D (Coração da Loja):**
- Layout repensado para **Fullscreen Canvas**. O modelo tridimensional agora domina o plano de fundo da tela inteira.
- Painel de Customização flutuante utilizando altíssima densidade de **Glassmorphism** (`backdrop-blur-3xl`).
- Iluminação do R3F (`Viewer3D.tsx`) formatada com setup realista: `preset="studio"`, *directional rim lights* e ajustes corretos de pino de sombra.

**4. O Motor de Regras & Segurança Node.js (Baking):**
- O backend de Texture Baking via Express já está blindado (**Helmet**, **Rate Limiting** imposto).
- **Anti-Theft System:** A arte crua (em alta resolução) nunca transita para o frontend. O servidor Sharp cria texturas amassadas (*UV Mapped WebP*) protegendo a propriedade intelectual da loja.
- **Aesthetic Lock (Trava de Halftone):** Implementado bloqueio rígido na UI e Backend (Alpha-channel checker) para impedir que artes "Dark Halftones" (Reticuladas Escuras) sejam aplicadas e fundidas em malhas extremamente claras (`#ffffff`), prevenindo erros grotescos de impressão.

**5. Sistema de Carrinho "O Cofre" (Zustand):**
- Infraestrutura completa no frontend baseada em Cache Local Permanente (`localStorage` do Zustand). Se o usuário fechar o site, a camisa continua salva na memória.
- Side Drawer espetacular (Gaveta lateral) espelhando a mesma estética fumê de marcas de ponta, permitindo gestão de quantidade e preço base dinâmico.

**6. Infraestrutura de Pedidos B2C (Checkout / Backend):**
- Banco centralizado utilizando Supabase / PostgreSQL.
- API blindada rodando em Express (`POST /api/orders`) utilizando Validação Zod estrita para interceptar Injection. 
- UI Checkout Mode inserida dentro da *CartDrawer* (Frontend) mapeando campos de Entrega (Transportadora/Correios) e validando no ato do envio.

---

## ⏳ PENDÊNCIAS RESTANTES (Congeladas / Aguardando Maquinário / Próxima Sessão)

Ao longo do desenvolvimento comissionado, os fluxos avançaram e resolvemos a etapa de logística/banco. As frentes de código restantes que paralisamos intencionalmente para depois:

1. **Responsividade Urgente (Mobile & Tablet):**
   - Refatorar Layout da Landing Page brutalista e da malha flexbox do Simulador, pois o site quebrou visualmente fora dos limites do Desktop. Urgência número 1 da próxima sessão.

2. **Injeção do Visual Hero B2C:**
   - Inserir a mídia definitiva que vai habitar The Glass Container na `app/page.tsx` (Substituir o wireframe por WebGL rotativo ou gravação cinematográfica do DTF).

3. **Cálculo Dinâmico dos Preços Base (Frontend Zustand):**
   - O preço mockado no cart ($89.90 visual) precisa refletir visualmente no app as variações de estado do simulador que aplicamos hoje na camada Express do NodeJS.

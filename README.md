# Vendas Ghost Studio

Loja/e-commerce completa dentro do Discord. Venda produtos digitais com entrega automática, PIX via MercadoPago, carrinho de compras, cupons, painel administrativo e sistema de tickets opcional.

## Requisitos

- Node.js 20+
- Discord Bot Token
- Access Token do MercadoPago
- npm ou yarn

## Instalação

```bash
# Clonar e instalar
git clone https://github.com/icarofffffts/vendas-ghost-studio.git
cd vendas-ghost-studio
npm install

# Configurar variáveis
cp .env.example .env
# Edite .env com seu DISCORD_TOKEN

# Iniciar
npm run start
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DISCORD_TOKEN` | Token do bot Discord | Sim |
| `TICKET_ENABLED` | Ativar sistema de tickets (`true`/`false`) | Não (padrão: false) |

## Docker

```bash
docker build -t vendas-ghost-studio .
docker run -d --name vendas-ghost-studio --env-file .env vendas-ghost-studio
```

## Comandos Slash

| Comando | Descrição |
|---------|-----------|
| `/painel` | Painel administrativo principal |
| `/manage_product` | Gerenciar produtos |
| `/manage_stock` | Gerenciar estoque |
| `/entregar` | Entrega manual de produto |
| `/rank` | Ranking de vendas |
| `/perm_add / perm_list / perm_remove` | Gerenciar permissões |
| `/create_emojis` | Criar emojis em massa |
| `/dm` | Enviar DM para usuário |
| `/say` | Enviar mensagem no canal |
| `/lock / unlock` | Trancar/destrancar canal |
| `/verify` | Sistema de verificação |
| `/nitro_free` | Sistema Nitro Free |
| `/vincular_clientes` | Vincular clientes |
| `/clear` | Limpar mensagens |
| `/profile` | Perfil do usuário |

## Context Menus (clique direito)

- **ManageItemMessage** — Gerenciar item
- **ManageProductMessage** — Gerenciar produto
- **ManageStockMessage** — Gerenciar estoque
- **UserProfileMessage** — Perfil do usuário

## Funcionalidades

- **Loja de produtos digitais** — Cadastre produtos com nome, valor, estoque, descrição
- **Entrega automática** — Produtos `.txt` enviados via DM após pagamento
- **Cupons** — Desconto percentual com cupons reutilizáveis
- **Carrinho de compras** — Threads privadas com botões interativos
- **PIX via MercadoPago** — QR Code PIX com verificação automática
- **Webhook de pagamento** — Confirmação via webhook (mp-webhook-portable)
- **Webhook de venda** — Notificação para cada venda realizada
- **Vitrine de produtos** — Embed atualizado dinamicamente
- **Rastreamento de pedidos** — Histórico de pedidos por usuário
- **Tickets (opcional)** — Sistema de suporte, desabilitado por padrão (`TICKET_ENABLED=false`)
- **Nitro Free** — Sistema de distribuição de Nitro
- **Rastreamento de convites** — Invite tracker do servidor

## Estrutura do Projeto

```
index.js                  # Entry point + Express server
ComandosSlash/            # Slash commands (admin + user)
Eventos/                  # Discord event handlers
Functions/                # Core business logic (Painel, Carrinho, etc.)
Handler/                  # Auto-loaders (slash.js, events.js)
routes/                   # Express routes (OAuth, callback)
DataBaseJson/             # wio.db JSON databases
```

## Deploy

O bot usa JavaScript direto (não precisa compilar). Use `npm run start` = `node index.js`.

Para Coolify: start command `npm run start`.

### Tickets (opcional)

Para habilitar o sistema de tickets, defina `TICKET_ENABLED=true` na variável de ambiente. Quando ativo, adiciona R$ 20,00 ao valor da compra.
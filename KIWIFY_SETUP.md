# Configuração do Kiwify - PegadaZero

## 📋 Visão Geral

Este guia explica como configurar completamente a integração com o Kiwify para processar pagamentos no PegadaZero.

## 🔗 Link de Pagamento Atual

**URL do Kiwify:** `https://pay.kiwify.com.br/a58ev1P`

## 🛠️ Configuração no Painel Kiwify

### 1. Acesso ao Painel
1. Acesse [kiwify.com.br](https://kiwify.com.br)
2. Faça login na sua conta
3. Navegue até o produto configurado

### 2. Configurar URLs de Redirecionamento

No painel do Kiwify, configure as seguintes URLs:

#### URLs de Sucesso
- **Pagamento Aprovado:** `https://seudominio.com/payment/success`
- **Pagamento Pendente:** `https://seudominio.com/payment/success?status=pending`

#### URLs de Cancelamento
- **Pagamento Cancelado:** `https://seudominio.com/payment/cancel`
- **Pagamento Rejeitado:** `https://seudominio.com/payment/cancel?status=rejected`

### 3. Configurar Webhook

Configure o webhook para receber notificações automáticas:

**URL do Webhook:** `https://seudominio.com/api/payments/webhook`

#### Eventos para Monitorar:
- `payment.approved` - Pagamento aprovado
- `payment.refused` - Pagamento recusado
- `payment.refunded` - Pagamento estornado
- `payment.chargeback` - Chargeback

## 🔧 Configuração no Backend

### 1. Variáveis de Ambiente

Adicione no arquivo `.env.production`:

```env
# Kiwify Configuration
KIWIFY_API_KEY=sua_api_key_aqui
KIWIFY_WEBHOOK_SECRET=seu_webhook_secret_aqui
KIWIFY_PRODUCT_ID=a58ev1P
```

### 2. Endpoints Disponíveis

#### Webhook (POST /api/payments/webhook)
Recebe notificações do Kiwify sobre mudanças de status dos pagamentos.

**Payload esperado:**
```json
{
  "order_id": "string",
  "status": "approved|refused|refunded|chargeback"
}
```

## 🎨 Frontend - Componentes Criados

### 1. PaymentButton Component
Localização: `src/components/PaymentButton.tsx`

**Uso:**
```tsx
<PaymentButton 
  planName="Profissional" 
  price={79.90} 
  className="w-full"
/>
```

### 2. Página de Preços
Localização: `src/pages/Pricing.tsx`
- Exibe os planos disponíveis
- Integra com o PaymentButton
- Design responsivo

### 3. Páginas de Resultado

#### Sucesso (PaymentSuccess.tsx)
- Rota: `/payment/success`
- Exibe confirmação de pagamento
- Redireciona para dashboard

#### Cancelamento (PaymentCancel.tsx)
- Rota: `/payment/cancel`
- Informa sobre cancelamento
- Opção de tentar novamente

## 🔄 Fluxo de Pagamento

1. **Usuário clica em "Assinar Plano"**
   - PaymentButton redireciona para Kiwify
   - Adiciona parâmetros UTM para tracking

2. **Processamento no Kiwify**
   - Usuário preenche dados de pagamento
   - Kiwify processa a transação

3. **Redirecionamento**
   - **Sucesso:** `/payment/success`
   - **Cancelamento:** `/payment/cancel`

4. **Webhook (Automático)**
   - Kiwify envia notificação para `/api/payments/webhook`
   - Backend atualiza status do pagamento
   - Ativa/desativa acesso do usuário

## 📊 Tracking e Analytics

### Parâmetros UTM Automáticos
- `utm_source=pegadazero`
- `utm_medium=website`
- `utm_campaign=[nome_do_plano]`

### Logs de Auditoria
Todos os webhooks são logados para auditoria:
```
Webhook recebido - Order ID: [id], Status: [status]
```

## 🔒 Segurança

### Validação de Webhook
- Verificação de assinatura (se disponível)
- Validação de payload
- Log de tentativas suspeitas

### Dados Sensíveis
- API keys em variáveis de ambiente
- Nunca expor credenciais no frontend
- HTTPS obrigatório em produção

## 🚀 Deploy e Produção

### 1. Atualizar URLs no Kiwify
Substitua `seudominio.com` pelas URLs reais:
- Vercel: `https://pegadazero.vercel.app`
- Domínio customizado: `https://pegadazero.com`

### 2. Testar Integração
1. Fazer um pagamento de teste
2. Verificar redirecionamentos
3. Confirmar recebimento de webhooks
4. Validar logs no backend

## 📞 Suporte

### Kiwify
- Documentação: [docs.kiwify.com.br](https://docs.kiwify.com.br)
- Suporte: suporte@kiwify.com.br

### PegadaZero
- Email: suporte@pegadazero.com
- WhatsApp: (11) 99999-9999

## ✅ Checklist de Configuração

- [ ] Produto configurado no Kiwify
- [ ] URLs de redirecionamento configuradas
- [ ] Webhook configurado
- [ ] Variáveis de ambiente definidas
- [ ] Componentes frontend implementados
- [ ] Rotas backend configuradas
- [ ] Testes de pagamento realizados
- [ ] URLs de produção atualizadas
- [ ] Monitoramento ativo

## 🔄 Próximos Passos

1. **Configurar planos múltiplos** - Diferentes produtos no Kiwify
2. **Implementar assinaturas recorrentes** - Pagamentos mensais automáticos
3. **Dashboard de pagamentos** - Interface para gerenciar transações
4. **Relatórios financeiros** - Analytics de vendas e receita
5. **Integração com CRM** - Sincronizar dados de clientes
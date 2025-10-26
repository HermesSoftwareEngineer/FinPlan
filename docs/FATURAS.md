# Módulo de Faturas de Cartão de Crédito

## Visão Geral

Sistema completo para gerenciamento de faturas de cartões de crédito, permitindo criar, visualizar, pagar e excluir faturas mensais.

## Arquivos Criados

### 1. **Services**

#### `src/services/faturaService.js`
Serviço de comunicação com a API de faturas.

**Métodos:**
- `listarFaturas(filtros)` - Lista faturas com filtros opcionais
- `buscarFatura(id)` - Busca fatura específica por ID
- `criarFatura(dados)` - Cria nova fatura
- `atualizarFatura(id, dados)` - Atualiza fatura existente
- `deletarFatura(id)` - Remove fatura
- `pagarFatura(id, valorPago)` - Marca fatura como paga
- `fecharFatura(id)` - Fecha fatura para novos lançamentos

**Filtros Suportados:**
```javascript
{
  cartao_id: 1,
  status: 'aberta',
  mes_referencia: 10,
  ano_referencia: 2025
}
```

### 2. **Components**

#### `src/components/ModalNovaFatura.jsx`
Modal para criação de novas faturas.

**Campos:**
- Cartão de crédito (select com cartões ativos)
- Mês de referência (1-12)
- Ano de referência (2020-2100)
- Data de fechamento
- Data de vencimento

**Validações:**
- Todos os campos obrigatórios
- Seleciona apenas cartões ativos
- Mês atual pré-selecionado

#### `src/components/ModalPagarFatura.jsx`
Modal para registro de pagamento de faturas.

**Funcionalidades:**
- Exibe informações da fatura (cartão, referência, vencimento, valor)
- Permite pagar valor diferente do total
- Valor total pré-preenchido
- Confirmação de pagamento

### 3. **Pages**

#### `src/Pages/Faturas.jsx`
Página principal de gerenciamento de faturas.

**Estrutura:**
- Header com título e theme toggle
- Estatísticas gerais
- Filtros (busca, status, cartão)
- Grid de cards de faturas
- Ações por card (pagar, fechar, excluir)

## Status de Faturas

### Estados Disponíveis

1. **Aberta** 🔵
   - Fatura criada e aceitando novos lançamentos
   - Cor: Azul
   - Ações: Fechar, Excluir

2. **Fechada** 🟠
   - Fatura fechada, aguardando pagamento
   - Não aceita novos lançamentos
   - Cor: Laranja
   - Ações: Pagar, Excluir

3. **Paga** 🟢
   - Fatura quitada
   - Exibe valor pago
   - Cor: Verde
   - Ações: Excluir

4. **Atrasada** 🔴
   - Vencimento passou e não foi paga
   - Cor: Vermelho
   - Ações: Pagar, Excluir

## Estatísticas

### Dashboard de Faturas

**Cards de Estatísticas:**

1. **Total de Faturas**
   - Contagem total de faturas

2. **Abertas/Fechadas**
   - Número de faturas em aberto ou fechadas
   - Gradient: Azul → Laranja

3. **Valor em Aberto**
   - Soma de todas as faturas não pagas
   - Gradient: Vermelho
   - Indicador de dívida pendente

4. **Valor Pago**
   - Total já quitado
   - Gradient: Verde → Emerald
   - Indicador de saúde financeira

## Filtros e Busca

### Opções de Filtro

**Busca Textual:**
- Nome do cartão
- Mês/Ano de referência

**Filtro de Status:**
- Todas
- Abertas
- Fechadas
- Pagas
- Atrasadas

**Filtro de Cartão:**
- Todos os cartões
- Cartões individuais

## Layout dos Cards

### Estrutura do Card de Fatura

```
┌──────────────────────────────────┐
│ Nubank Mastercard     [Status]   │
│ Visa •••• 1234                   │
│                                  │
│ Referência: 10/2025              │
│ Fechamento: 15/10/2025           │
│ Vencimento: 25/10/2025           │
│ ──────────────────────           │
│ Valor Total: R$ 1.234,56         │
│                                  │
│ [Pagar]  [Excluir]               │
└──────────────────────────────────┘
```

## Fluxo de Uso

### 1. Criar Fatura

```
Usuário → Botão "Nova Fatura"
       → Modal abre
       → Seleciona cartão
       → Define mês/ano
       → Define datas
       → Confirma
       → Fatura criada com status "aberta"
```

### 2. Fechar Fatura

```
Fatura "aberta" → Botão "Fechar"
                → Confirmação
                → Status muda para "fechada"
                → Não aceita mais lançamentos
```

### 3. Pagar Fatura

```
Fatura "fechada/atrasada" → Botão "Pagar"
                          → Modal de pagamento
                          → Informa valor pago
                          → Confirma
                          → Status muda para "paga"
```

### 4. Excluir Fatura

```
Qualquer fatura → Botão "Excluir"
                → Confirmação
                → Fatura removida
```

## Integração com Backend

### Endpoints Esperados

```http
GET    /faturas
GET    /faturas?cartao_id=1&status=aberta
GET    /faturas/:id
POST   /faturas
PUT    /faturas/:id
DELETE /faturas/:id
```

### Estrutura de Dados

**Fatura:**
```json
{
  "id": 1,
  "mes_referencia": 10,
  "ano_referencia": 2025,
  "data_fechamento": "2025-10-15",
  "data_vencimento": "2025-10-25",
  "valor_total": 1234.56,
  "valor_pago": 1234.56,
  "status": "paga",
  "cartao_id": 1,
  "cartao": {
    "id": 1,
    "nome": "Nubank",
    "bandeira": "Mastercard",
    "ultimos_digitos": "1234"
  }
}
```

## Responsividade

### Breakpoints

- **Mobile**: 1 coluna
- **Tablet (md)**: 2 colunas
- **Desktop (lg)**: 2 colunas
- **Large (xl)**: 3 colunas

### Sidebar

- Mobile: Overlay com backdrop
- Desktop: Sempre visível (≥1024px)

## Theme Support

### Cores por Tema

**Light Mode:**
- Background: gray-50
- Cards: white
- Borders: gray-200
- Text: gray-900

**Dark Mode:**
- Background: slate-900
- Cards: slate-800
- Borders: slate-700
- Text: white

### Status Colors

Mantém cores consistentes em ambos os temas usando sistema de gradientes.

## Validações

### Frontend

- Campos obrigatórios marcados com *
- Cartão deve estar ativo
- Ano entre 2020-2100
- Datas no formato correto
- Valor pago > 0

### Mensagens de Erro

- Erro de rede: "Erro ao carregar faturas"
- Erro de criação: "Erro ao criar fatura. Verifique os dados."
- Erro de pagamento: "Erro ao processar pagamento."

## Melhorias Futuras

1. **Detalhamento de Fatura**
   - Visualizar movimentos incluídos na fatura
   - Download de PDF da fatura
   - Envio por email

2. **Parcelamento**
   - Suporte a parcelas de compras
   - Visualização de parcelas pendentes

3. **Pagamento Parcial**
   - Registro de múltiplos pagamentos
   - Controle de saldo devedor

4. **Análise de Gastos**
   - Gráficos de evolução mensal
   - Comparativo entre meses
   - Categorização de gastos por cartão

5. **Alertas**
   - Notificação de vencimento próximo
   - Alerta de atraso
   - Lembrete de fechamento

---

**Status**: ✅ Implementado e funcional  
**Versão**: 1.0  
**Data**: 26/10/2025

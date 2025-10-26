# Atualização da API de Movimentos

## Mudanças Implementadas

### Campos de Data

A API agora utiliza dois campos distintos para datas:

1. **`data_competencia`** (obrigatório)
   - Data de competência/vencimento
   - Usada para relatórios de DRE (regime de competência)
   - Para contas: data em que a transação ocorreu
   - Para cartões: data da compra

2. **`data_pagamento`** (opcional)
   - Data em que foi efetivamente pago
   - Se não informada e `pago=true`, é preenchida automaticamente com a data atual
   - Se `pago=false`, este campo é automaticamente limpo

### Lógica de Pagamento

#### Flag `pago`
- `true`: Movimento foi pago
  - Se `data_pagamento` não for informada, a API preenche automaticamente com a data atual
  - Permite informar `data_pagamento` manualmente
- `false`: Movimento não foi pago
  - Campo `data_pagamento` é limpo automaticamente pela API

### Campo `origem`

O campo `origem` identifica a fonte do movimento e controla permissões de edição/exclusão:

1. **`origem: "fatura"`**
   - Movimentos criados automaticamente pelo pagamento de faturas de cartão
   - **Não podem ser excluídos** diretamente pelo usuário
   - Devem ser gerenciados através das faturas
   - Frontend oculta o botão de exclusão para esses movimentos
   - Exibe mensagem informativa explicando a restrição

2. **`origem: "manual"` ou `null`**
   - Movimentos criados manualmente pelo usuário
   - Podem ser editados e excluídos livremente
   - Comportamento padrão do sistema

### Integração com Cartões de Crédito

Quando um movimento é criado com `cartao_id`:

1. **Criação Automática de Fatura**
   - A API cria ou atualiza a fatura do cartão automaticamente
   - Agrupa movimentos por mês de vencimento

2. **Atualização de Limite**
   - O `limite_utilizado` do cartão é ajustado automaticamente
   - Reflete o saldo pendente de pagamento

3. **Estatísticas**
   - Endpoint `GET /cartoes` retorna:
     ```json
     {
       "estatisticas": {
         "total_cartoes": 3,
         "cartoes_ativos": 2,
         "limite_total": 15000.00,
         "limite_utilizado": 3500.00,
         "limite_disponivel": 11500.00
       },
       "cartoes": [...]
     }
     ```

## Exemplo de Requisição

### Criar Movimento com Conta Bancária

```json
POST /movimentos
{
  "descricao": "Supermercado",
  "valor": 150.50,
  "tipo": "despesa",
  "data_competencia": "2025-10-26",
  "data_pagamento": "2025-10-26",  // Opcional
  "observacao": "Compras do mês",
  "pago": true,
  "recorrente": false,
  "parcelado": false,
  "conta_id": 1,
  "categoria_id": 2
}
```

### Criar Movimento com Cartão de Crédito

```json
POST /movimentos
{
  "descricao": "Restaurante",
  "valor": 85.00,
  "tipo": "despesa",
  "data_competencia": "2025-10-26",
  // data_pagamento não precisa ser informada para cartões
  "observacao": "Jantar",
  "pago": true,
  "recorrente": false,
  "parcelado": false,
  "cartao_id": 2,  // Ao invés de conta_id
  "categoria_id": 8
}
```

## Alterações no Frontend

### ModalNovoMovimento.jsx

**Campos do FormData:**
```javascript
{
  data_competencia: '2025-10-26',  // Anteriormente era apenas 'data'
  data_pagamento: '',              // Novo campo opcional
  pago: true,                       // Controla se data_pagamento está habilitada
  forma_pagamento: 'conta',         // 'conta' ou 'cartao'
  conta_id: '',
  cartao_id: '',
  // ... outros campos
}
```

**Lógica de Envio:**
```javascript
const dados = {
  descricao: formData.descricao,
  valor: parseFloat(formData.valor),
  tipo: formData.tipo,
  data_competencia: formData.data_competencia,
  observacao: formData.observacao || undefined,
  pago: formData.pago,
  recorrente: formData.recorrente,
  parcelado: formData.parcelado,
  categoria_id: parseInt(formData.categoria_id) || undefined,
};

// Adiciona data_pagamento apenas se pago = true e foi informada
if (formData.pago && formData.data_pagamento) {
  dados.data_pagamento = formData.data_pagamento;
}

// Adiciona conta_id OU cartao_id
if (formData.forma_pagamento === 'conta' && formData.conta_id) {
  dados.conta_id = parseInt(formData.conta_id);
} else if (formData.forma_pagamento === 'cartao' && formData.cartao_id) {
  dados.cartao_id = parseInt(formData.cartao_id);
}
```

**Interface de Usuário:**
- Campo "Data de Competência" (obrigatório)
- Campo "Data de Pagamento" (opcional, desabilitado se `pago=false`)
- Mensagem de ajuda explicativa para cada campo
- Remoção do cálculo manual de vencimento de fatura (agora feito pela API)

### ModalEditarMovimento.jsx

Mesmas alterações aplicadas:
- Suporte a `data_competencia` e `data_pagamento`
- Detecção automática de forma de pagamento
- Interface atualizada com novos campos
- Validação de `pago` para habilitar/desabilitar `data_pagamento`

## Compatibilidade

### Parsing de Cartões
O frontend agora suporta duas estruturas de resposta:

```javascript
// Nova estrutura (com estatísticas)
{
  estatisticas: { ... },
  cartoes: [...]
}

// Estrutura antiga (array direto)
[...]

// Código de compatibilidade:
const cartoesAtivos = (cartoesResponse.cartoes || cartoesResponse)
  .filter(c => c.ativo);
```

### Migração de Dados Antigos
O campo `data_competencia` pode receber dados do campo antigo `data`:

```javascript
data_competencia: movimento.data_competencia || movimento.data || ''
```

## Validações

### Backend Esperado
- Validar que movimento tem OU `conta_id` OU `cartao_id`, nunca ambos
- Se `pago=false`, limpar automaticamente `data_pagamento`
- Se `pago=true` e `data_pagamento` não informada, preencher com data atual
- Para cartões, criar/atualizar fatura automaticamente
- Atualizar `limite_utilizado` do cartão

### Frontend
- Desabilita campo `data_pagamento` quando `pago=false`
- Limpa `cartao_id` ao selecionar conta
- Limpa `conta_id` ao selecionar cartão
- Mostra mensagem informativa sobre gerenciamento automático de faturas

## Benefícios

1. **Regime de Competência**: Separação clara entre quando a despesa é reconhecida (competência) e quando é paga (caixa)
2. **Gestão Automática de Faturas**: Backend gerencia faturas de cartão sem intervenção manual
3. **Limite em Tempo Real**: Estatísticas de limite sempre atualizadas
4. **UX Melhorada**: Campos claros e ajudas contextuais
5. **Flexibilidade**: Data de pagamento opcional permite registrar despesas não pagas

---

**Data da Atualização**: 26/10/2025  
**Versão**: 2.0  
**Status**: ✅ Implementado

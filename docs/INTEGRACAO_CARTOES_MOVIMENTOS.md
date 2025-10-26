# Integração de Cartões de Crédito nos Movimentos

## Alterações Implementadas

### Objetivo
Permitir que ao cadastrar ou editar um movimento financeiro, o usuário possa escolher entre pagar com uma **Conta Bancária** ou com um **Cartão de Crédito**. Quando for cartão, a data de pagamento será automaticamente calculada como o vencimento da fatura.

## Arquivos Modificados

### 1. ModalNovoMovimento.jsx

#### Imports Adicionados
```javascript
import { cartaoService } from '../services';
```

#### Novos Estados
- `cartoes` - Array para armazenar os cartões de crédito
- `forma_pagamento` - Campo no formData para controlar se é 'conta' ou 'cartao'
- `cartao_id` - ID do cartão selecionado

#### Função de Cálculo de Vencimento
```javascript
const calcularDataVencimentoFatura = (dataCompra, diaFechamento, diaVencimento) => {
  const data = new Date(dataCompra + 'T00:00:00');
  const diaCompra = data.getDate();
  
  // Se a compra foi feita após o fechamento, vai para a próxima fatura
  let mesVencimento = data.getMonth();
  let anoVencimento = data.getFullYear();
  
  if (diaCompra > diaFechamento) {
    // Compra entra na próxima fatura
    mesVencimento++;
    if (mesVencimento > 11) {
      mesVencimento = 0;
      anoVencimento++;
    }
  }
  
  // Criar data de vencimento
  const dataVencimento = new Date(anoVencimento, mesVencimento, diaVencimento);
  
  // Formatar como YYYY-MM-DD
  return dataVencimento.toISOString().split('T')[0];
};
```

#### Mudanças no Carregamento de Dados
```javascript
const [contasData, cartoesData, categoriasData] = await Promise.all([
  contaService.listar(),
  cartaoService.listarCartoes(),  // Novo
  categoriaService.listar(...)
]);
```

#### Interface do Formulário
- **Seletor de Forma de Pagamento**: Radio buttons para escolher entre Conta ou Cartão
- **Seleção Condicional**: 
  - Se "Conta Bancária" → Mostra dropdown de contas
  - Se "Cartão de Crédito" → Mostra dropdown de cartões
- **Preview da Data de Vencimento**: Card informativo mostrando quando será o pagamento da fatura

#### Lógica de Envio
```javascript
// Calcular data de pagamento baseado na forma de pagamento
let dataPagamento = formData.data;

if (formData.forma_pagamento === 'cartao' && formData.cartao_id) {
  const cartaoSelecionado = cartoes.find(c => c.id === parseInt(formData.cartao_id));
  if (cartaoSelecionado) {
    dataPagamento = calcularDataVencimentoFatura(
      formData.data,
      cartaoSelecionado.dia_fechamento,
      cartaoSelecionado.dia_vencimento
    );
  }
}

const dados = {
  // ...
  conta_id: formData.forma_pagamento === 'conta' ? parseInt(formData.conta_id) : undefined,
  cartao_id: formData.forma_pagamento === 'cartao' ? parseInt(formData.cartao_id) : undefined,
  data_competencia: formData.data,  // Data da compra
  data_pagamento: dataPagamento,    // Vencimento da fatura (cartão) ou mesma data (conta)
};
```

### 2. ModalEditarMovimento.jsx

#### Mesmas Mudanças do ModalNovoMovimento
- Import do cartaoService
- Novos estados (cartoes, forma_pagamento, cartao_id)
- Carregamento de cartões
- Interface com radio buttons
- Lógica de envio atualizada

#### Detecção Automática
Ao carregar um movimento existente, o sistema detecta automaticamente a forma de pagamento:
```javascript
const formaPagamento = movimento.cartao_id ? 'cartao' : 'conta';
```

## Comportamento do Sistema

### Ao Criar Movimento

1. **Usuário seleciona a forma de pagamento**:
   - 💰 Conta Bancária
   - 💳 Cartão de Crédito

2. **Sistema exibe apenas contas ou cartões ativos**

3. **Dropdown mostra informações relevantes**:
   - **Contas**: Nome + Saldo atual
   - **Cartões**: Nome + Bandeira + Últimos 4 dígitos + Limite

4. **Ao enviar**:
   - Se Conta: `conta_id` é enviado
   - Se Cartão: `cartao_id` é enviado

### Ao Editar Movimento

1. **Sistema detecta automaticamente** qual foi a forma de pagamento usada

2. **Pré-seleciona o radio button** correto (Conta ou Cartão)

3. **Pré-seleciona a conta ou cartão** usado originalmente

4. **Permite alteração** entre conta e cartão se necessário

## Validações

- Apenas contas **ativas** são listadas
- Apenas cartões **ativos** são listados
- Campos mutuamente exclusivos: se `cartao_id` está preenchido, `conta_id` não vai para API e vice-versa

## Mensagens ao Usuário

### Para Cartões
Quando um cartão é selecionado, aparece a mensagem:
```
"O pagamento será registrado na fatura do cartão"
```

### Informação sobre Data
```
"Para contas: data de competência e pagamento. Para cartões: data de competência."
```

## Estrutura dos Dados Enviados à API

### Movimento com Conta
```json
{
  "descricao": "Compra no supermercado",
  "valor": 150.00,
  "tipo": "despesa",
  "data_competencia": "2024-10-26",
  "data_pagamento": "2024-10-26",
  "conta_id": 1,
  "categoria_id": 5
}
```

### Movimento com Cartão
```json
{
  "descricao": "Compra online",
  "valor": 299.90,
  "tipo": "despesa",
  "data_competencia": "2024-10-26",
  "data_pagamento": "2024-10-26",
  "cartao_id": 2,
  "categoria_id": 8
}
```

## Compatibilidade

- ✅ Movimentos antigos (sem `cartao_id`) continuam funcionando normalmente
- ✅ Sistema detecta automaticamente se o movimento é de conta ou cartão ao editar
- ✅ Interface responsiva e adaptável
- ✅ Suporte a tema claro e escuro mantido

## Benefícios

1. **Controle Financeiro Completo**: Usuário pode gerenciar tanto contas quanto cartões no mesmo local
2. **Fácil Diferenciação**: Interface clara mostrando o tipo de pagamento
3. **Informações Relevantes**: Exibe saldo para contas e limite para cartões
4. **Flexibilidade**: Permite alterar a forma de pagamento ao editar
5. **Integração Total**: Funciona em harmonia com o sistema de cartões já implementado

## Próximos Passos Sugeridos

1. **Controle de Fatura**: Agrupar movimentos por fatura do cartão
2. **Limite Disponível**: Calcular e exibir limite disponível considerando movimentos
3. **Parcelamento no Cartão**: Suporte para compras parceladas
4. **Melhor Data de Pagamento**: Para cartões, usar o vencimento da fatura automaticamente
5. **Relatórios por Cartão**: Análises específicas de gastos por cartão

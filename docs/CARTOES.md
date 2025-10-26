# Documentação - Cartões de Crédito

## Visão Geral

A funcionalidade de Cartões de Crédito permite aos usuários gerenciar seus cartões, incluindo informações como limite, datas de fechamento e vencimento, bandeira, e muito mais.

## Arquivos Criados

### Services
- `src/services/cartaoService.js` - Service para comunicação com a API de cartões

### Components
- `src/components/ModalNovoCartao.jsx` - Modal para criar novos cartões
- `src/components/ModalEditarCartao.jsx` - Modal para editar cartões existentes

### Pages
- `src/Pages/Cartoes.jsx` - Página principal de gerenciamento de cartões

## Estrutura de Dados

### Cartão de Crédito

```javascript
{
  id: number,
  nome: string,              // Ex: "Nubank", "Inter"
  limite: number,            // Limite total do cartão
  dia_fechamento: number,    // Dia do fechamento da fatura (1-31)
  dia_vencimento: number,    // Dia do vencimento da fatura (1-31)
  bandeira: string,          // Ex: "Visa", "Mastercard", "Elo"
  ultimos_digitos: string,   // Últimos 4 dígitos do cartão
  conta_id: number,          // ID da conta de débito principal (obrigatório)
  cor: string,              // Cor em hexadecimal para personalização
  ativo: boolean            // Status do cartão
}
```

## Endpoints da API

### Listar Cartões
```http
GET /cartoes
Authorization: Bearer {token}
```

### Buscar Cartão
```http
GET /cartoes/:id
Authorization: Bearer {token}
```

### Criar Cartão
```http
POST /cartoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Nubank",
  "limite": 5000.00,
  "dia_fechamento": 15,
  "dia_vencimento": 25,
  "bandeira": "Mastercard",
  "ultimos_digitos": "1234",
  "conta_id": 1,
  "cor": "#8B10AE",
  "ativo": true
}
```

### Atualizar Cartão
```http
PUT /cartoes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "limite": 7000.00,
  "dia_vencimento": 28,
  "conta_id": 2
}
```

### Deletar Cartão
```http
DELETE /cartoes/:id
Authorization: Bearer {token}
```

## Funcionalidades

### Página de Cartões (`Cartoes.jsx`)

#### Recursos Principais:
1. **Listagem de Cartões**
   - Visualização em cards estilizados
   - Informações do cartão (nome, bandeira, últimos dígitos)
   - Indicador de limite e utilização
   - Status (ativo/inativo)

2. **Filtros e Busca**
   - Busca por nome, bandeira ou últimos dígitos
   - Filtro por status (todos, ativos, inativos)
   - Filtro por bandeira

3. **Ações**
   - Criar novo cartão
   - Editar cartão existente
   - Deletar cartão (com confirmação)

4. **Estatísticas**
   - Total de cartões
   - Cartões ativos
   - Limite total
   - Limite disponível

### Modal Novo Cartão (`ModalNovoCartao.jsx`)

#### Campos do Formulário:
- **Informações Básicas**
  - Nome do cartão (obrigatório)
  - Bandeira (select com opções pré-definidas)
  - Últimos 4 dígitos (validação numérica)
  - Limite de crédito (valor decimal)
  - Conta de débito principal (obrigatório) - Seleciona a conta bancária que será utilizada para débito das faturas

- **Datas de Faturamento**
  - Dia de fechamento (1-31)
  - Dia de vencimento (1-31)

- **Personalização**
  - Seletor de cores (8 opções pré-definidas)
  - Status ativo/inativo

#### Validações:
- Campos obrigatórios marcados com *
- Validação de formato para últimos dígitos (4 números)
- Validação de valores numéricos para limite
- Validação de dias do mês (1-31)
- Conta de débito obrigatória (select de contas ativas)

### Modal Editar Cartão (`ModalEditarCartao.jsx`)

Similar ao modal de criação, mas:
- Pré-preenche os campos com dados existentes
- Permite edição de todos os campos
- Botão "Salvar Alterações" em vez de "Criar Cartão"

## Service de Cartões (`cartaoService.js`)

### Métodos Disponíveis:

#### `listarCartoes()`
Retorna todos os cartões do usuário autenticado.

```javascript
const cartoes = await cartaoService.listarCartoes();
```

#### `buscarCartao(id)`
Retorna um cartão específico por ID.

```javascript
const cartao = await cartaoService.buscarCartao(1);
```

#### `criarCartao(dados)`
Cria um novo cartão.

```javascript
const novoCartao = await cartaoService.criarCartao({
  nome: "Nubank",
  limite: 5000.00,
  dia_fechamento: 15,
  dia_vencimento: 25,
  bandeira: "Mastercard",
  ultimos_digitos: "1234",
  cor: "#8B10AE",
  ativo: true
});
```

#### `atualizarCartao(id, dados)`
Atualiza um cartão existente.

```javascript
await cartaoService.atualizarCartao(1, {
  limite: 7000.00,
  dia_vencimento: 28
});
```

#### `deletarCartao(id)`
Deleta um cartão.

```javascript
await cartaoService.deletarCartao(1);
```

## Bandeiras Suportadas

- Visa
- Mastercard
- Elo
- American Express
- Hipercard
- Diners Club
- Discover
- Outra

## Cores Padrão para Cartões

| Nome     | Código Hex |
|----------|-----------|
| Roxo     | #8B10AE   |
| Azul     | #1E40AF   |
| Verde    | #059669   |
| Vermelho | #DC2626   |
| Laranja  | #EA580C   |
| Rosa     | #DB2777   |
| Cinza    | #4B5563   |
| Preto    | #1F2937   |

## Navegação

A página de Cartões foi adicionada ao menu principal da aplicação através da Sidebar com o ícone 💳.

**Rota:** `/cartoes`

## Melhorias Futuras

1. **Integração com Faturas**
   - Visualizar faturas do cartão
   - Calcular limite disponível real baseado em compras
   - Histórico de pagamentos

2. **Alertas e Notificações**
   - Alerta de proximidade do vencimento
   - Alerta de limite próximo do total
   - Notificação de fechamento de fatura

3. **Análises e Relatórios**
   - Gráfico de utilização por período
   - Comparação entre cartões
   - Cashback e benefícios

4. **Parcelamentos**
   - Controle de compras parceladas
   - Previsão de faturas futuras
   - Total de parcelas em aberto

5. **Importação de Fatura**
   - Upload de fatura em PDF
   - Categorização automática
   - Reconciliação com movimentos

## Observações

- A autenticação é necessária para todas as operações
- O token JWT é enviado automaticamente através do interceptor do axios
- Todas as operações incluem tratamento de erros
- A interface é responsiva e suporta tema claro/escuro
- As cores dos cartões são personalizáveis para facilitar identificação visual

# Pagamento de Faturas via Transferência Bancária

## Visão Geral
Sistema de pagamento de faturas de cartão de crédito via transferência de conta bancária, integrado à página de detalhes da fatura.

## Componente: ModalPagarFaturaTransferencia

### Localização
`src/components/ModalPagarFaturaTransferencia.jsx`

### Funcionalidades

#### 1. Preenchimento Automático
- **Descrição**: Auto-gerada com padrão `Pagamento Fatura {Cartão} - {Mês}/{Ano}`
- **Valor**: Pré-preenchido com o valor total da fatura
- **Observação**: Referência ao período da fatura (MM/AAAA)

#### 2. Seleção de Conta Bancária
- Lista todas as contas ativas do usuário
- Exibe saldo atual de cada conta
- Campo obrigatório para concluir o pagamento

#### 3. Datas Configuráveis
- **Data de Competência**: Data de registro contábil (padrão: hoje)
- **Data de Pagamento**: Data efetiva do débito (padrão: hoje)

#### 4. Validações
- Todos os campos obrigatórios devem ser preenchidos
- Valor deve ser maior que zero
- Conta bancária deve ser selecionada

### Fluxo de Dados

```
1. Usuário clica em "Pagar Fatura via Transferência"
   ↓
2. Modal abre com dados pré-preenchidos
   ↓
3. Usuário seleciona conta bancária e ajusta dados se necessário
   ↓
4. Ao confirmar:
   - Cria movimento de DESPESA na conta selecionada
   - Chama callback onSuccess com ID da fatura e valor pago
   ↓
5. Página DetalhesFatura:
   - Chama faturaService.pagarFatura() para atualizar status
   - Recarrega dados da fatura
   ↓
6. Fatura aparece como "Paga" com valor pago exibido
```

### Props do Modal

```javascript
{
  isOpen: boolean,           // Controla visibilidade do modal
  onClose: () => void,       // Callback ao fechar
  fatura: Object,            // Dados da fatura a ser paga
  cartao: Object,            // Dados do cartão de crédito
  onSuccess: (faturaId, valorPago) => Promise<void>  // Callback após pagamento
}
```

### Estrutura do Movimento Criado

```javascript
{
  descricao: "Pagamento Fatura Nubank - Outubro/2025",
  valor: 1500.00,
  tipo: "despesa",              // Sempre despesa
  data_competencia: "2025-10-26",
  data_pagamento: "2025-10-26",
  observacao: "Ref: 10/2025",
  pago: true,                   // Sempre pago
  recorrente: false,
  parcelado: false,
  conta_id: 5
}
```

## Integração na Página DetalhesFatura

### Localização
`src/Pages/DetalhesFatura.jsx`

### Implementação

#### 1. Estado do Modal
```javascript
const [modalPagarOpen, setModalPagarOpen] = useState(false);
```

#### 2. Botão de Ação
- Aparece apenas se `fatura.status !== 'paga'`
- Localizado entre cards de informação e lista de movimentos
- Design: Botão verde com ícone de Banknote
- Responsivo: Largura total em mobile, auto em desktop

#### 3. Handler de Sucesso
```javascript
const handlePagamentoSuccess = async (faturaId, valorPago) => {
  await faturaService.pagarFatura(faturaId, { valor_pago: valorPago });
  await carregarDadosFatura();
};
```

## API Backend Necessária

### Endpoint: `POST /faturas/:id/pagar`

**Request Body:**
```json
{
  "valor_pago": 1500.00
}
```

**Response:**
```json
{
  "id": 123,
  "status": "paga",
  "valor_pago": 1500.00,
  "data_pagamento": "2025-10-26",
  ...
}
```

**Ações do Backend:**
1. Validar se fatura existe e não está paga
2. Atualizar status para "paga"
3. Registrar valor_pago e data_pagamento
4. Retornar fatura atualizada

## UX/UI

### Visual do Botão
```
┌─────────────────────────────────────────────────┐
│  💵 Pagar Fatura via Transferência              │
│  (Gradiente Verde: #059669 → #10b981)           │
└─────────────────────────────────────────────────┘
   Registre o pagamento desta fatura debitando
   de uma conta bancária
```

### Layout do Modal
- **Header**: Título + subtítulo explicativo
- **Informações da Fatura**: Card azul com detalhes (cartão, período, vencimento, valor)
- **Formulário**: Campos de entrada com labels claros
- **Aviso**: Alert amarelo sobre a ação a ser tomada
- **Ações**: Botões Cancelar (cinza) e Confirmar (verde)

### Estados do Botão "Pagar"
- ✅ **Visível**: Fatura com status "aberta", "fechada" ou "atrasada"
- ❌ **Oculto**: Fatura com status "paga"

### Responsividade
- **Mobile**: Botão ocupa largura total, campos empilhados
- **Tablet**: Grid 2 colunas para datas
- **Desktop**: Layout compacto com max-width

## Temas (Dark Mode)

### Light Mode
- Background: Branco (#FFFFFF)
- Bordas: Cinza claro (#E5E7EB)
- Textos: Cinza escuro (#111827)

### Dark Mode
- Background: Slate escuro (#1E293B)
- Bordas: Slate médio (#475569)
- Textos: Branco (#FFFFFF)

## Dependências

### Serviços
- `contaService` - Listar contas bancárias ativas
- `movimentoService` - Criar movimento de despesa
- `faturaService` - Atualizar status da fatura

### Componentes
- `lucide-react` - Ícone Banknote, X

### Bibliotecas
- `react` - useState, useEffect
- `react-router-dom` - Navegação (indireta)

## Melhorias Futuras

1. **Validação de Saldo**
   - Verificar se conta tem saldo suficiente
   - Exibir aviso se saldo insuficiente

2. **Histórico de Pagamentos**
   - Mostrar pagamentos parciais anteriores
   - Calcular saldo devedor

3. **Sugestão de Conta**
   - Auto-selecionar conta com maior saldo
   - Lembrar última conta usada

4. **Confirmação Visual**
   - Toast notification de sucesso
   - Animação de conclusão

5. **Agendamento**
   - Permitir agendar pagamento futuro
   - Integrar com sistema de lembretes

6. **Comprovante**
   - Gerar PDF do comprovante de pagamento
   - Enviar por e-mail

7. **Pagamento Parcial**
   - Permitir pagar menos que o valor total
   - Registrar parcelas de pagamento
   - Calcular juros/multa se atrasado

## Notas Importantes

⚠️ **IMPORTANTE**: O sistema cria um movimento de despesa mas NÃO debita automaticamente o saldo da conta. Isso deve ser feito pelo backend ao processar o movimento.

⚠️ **VALIDAÇÃO**: O modal não valida se a conta tem saldo suficiente. Implementar no backend.

⚠️ **DUPLO LANÇAMENTO**: Evitar que o usuário pague a mesma fatura múltiplas vezes verificando o status antes de abrir o modal.

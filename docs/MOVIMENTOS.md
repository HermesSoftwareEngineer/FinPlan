# 💸 Página de Movimentos - FinPlan

## 📋 Descrição

Página completa para gerenciamento de movimentos financeiros (receitas, despesas e transferências) com integração total ao backend.

## ✨ Funcionalidades

### 📊 Listagem de Movimentos
- Tabela responsiva com todos os movimentos
- Exibição de: data, descrição, tipo, valor, status e ações
- Formatação automática de valores em BRL
- Indicadores visuais por tipo (receita, despesa, transferência)
- Estado vazio com call-to-action

### 🔍 Filtros Avançados
- **Por Tipo**: Receitas, Despesas, Transferências ou Todos
- **Por Status**: Pagos, Pendentes ou Todos
- **Por Período**: Data de início e data de fim
- Aplicação automática dos filtros ao alterar

### ➕ Criar Movimento
- Modal completo com formulário
- Campos obrigatórios: descrição, tipo, valor, data
- Campos opcionais: observação, conta, categoria
- Opções:
  - ✅ Marcar como pago
  - 🔄 Movimento recorrente
  - 📅 Movimento parcelado (com número e total de parcelas)

### ✏️ Editar Movimento
- Carrega dados existentes no formulário
- Mesma interface do criar
- Atualização via PUT no backend

### 🗑️ Deletar Movimento
- Confirmação antes de excluir
- Exclusão permanente via DELETE
- **Restrição**: Movimentos com origem "fatura" não podem ser excluídos
  - Botão de exclusão é ocultado para esses movimentos
  - Mensagem informativa é exibida explicando a restrição
  - Esses movimentos devem ser gerenciados através das faturas

### ✓ Toggle Status Pago
- Botão rápido para alternar pago/pendente
- Visual diferenciado:
  - ✓ Pago: Verde
  - ⏱ Pendente: Amarelo
- Atualização via PATCH

## 🎨 Design

### Cores por Tipo
- **Receita**: Verde (green-600)
- **Despesa**: Vermelho (red-600)
- **Transferência**: Azul (blue-600)

### Layout
- Header fixo com título e filtros
- Tabela responsiva com scroll horizontal
- Modal centralizado para criar/editar
- Animações suaves de transição

### Responsividade
- Desktop: Tabela completa
- Mobile: Tabela com scroll horizontal
- Sidebar responsiva integrada

## 🔌 Integração Backend

### Endpoints Utilizados

```javascript
// Listar com filtros
GET /movimentos?tipo=despesa&pago=true&data_inicio=2025-10-01&data_fim=2025-10-31

// Criar
POST /movimentos
{
  "descricao": "Supermercado",
  "valor": 150.50,
  "tipo": "despesa",
  "data": "2025-10-26",
  "observacao": "Compras do mês",
  "pago": true,
  "recorrente": false,
  "parcelado": false,
  "conta_id": 1,
  "categoria_id": 2
}

// Atualizar
PUT /movimentos/:id
{
  "descricao": "Supermercado Atualizado",
  "valor": 180.00
}

// Toggle Pago
PATCH /movimentos/:id/toggle-pago

// Deletar
DELETE /movimentos/:id
```

## 📦 Serviço (movimentoService.js)

### Métodos Disponíveis

```javascript
// Listar com filtros opcionais
movimentoService.listar({
  tipo: 'despesa',
  pago: true,
  data_inicio: '2025-10-01',
  data_fim: '2025-10-31',
  conta_id: 1,
  categoria_id: 2
});

// Buscar por ID
movimentoService.buscar(id);

// Criar novo
movimentoService.criar(dados);

// Atualizar existente
movimentoService.atualizar(id, dados);

// Alternar status pago/pendente
movimentoService.togglePago(id);

// Deletar
movimentoService.deletar(id);
```

## 🔐 Autenticação

- Verifica autenticação ao carregar
- Redireciona para /login se não autenticado
- Token enviado automaticamente nos headers

## 🎯 Estados do Componente

```javascript
const [movimentos, setMovimentos] = useState([]);      // Lista de movimentos
const [loading, setLoading] = useState(true);          // Loading state
const [showModal, setShowModal] = useState(false);     // Modal aberto/fechado
const [editando, setEditando] = useState(null);        // Movimento sendo editado
const [filtros, setFiltros] = useState({...});         // Filtros ativos
const [formData, setFormData] = useState({...});       // Dados do formulário
```

## 🚀 Como Usar

1. **Acessar**: Clique em "Movimentos" na sidebar
2. **Filtrar**: Use os filtros no topo da página
3. **Criar**: Clique em "+ Novo Movimento"
4. **Editar**: Clique no ícone ✏️ na linha do movimento
5. **Deletar**: Clique no ícone 🗑️ e confirme
6. **Toggle Pago**: Clique no badge de status

## 📱 Mobile

- Sidebar responsiva com overlay
- Formulário adaptado para telas pequenas
- Tabela com scroll horizontal
- Filtros empilhados verticalmente

## ⚡ Performance

- Carregamento assíncrono
- Loading spinner durante requisições
- Atualização otimista da UI
- Debounce nos filtros (próxima melhoria)

## 🔮 Melhorias Futuras

- [ ] Paginação da lista
- [ ] Busca por texto
- [ ] Exportar para Excel/PDF
- [ ] Gráficos de resumo
- [ ] Drag & drop para reordenar
- [ ] Bulk actions (marcar múltiplos como pagos)
- [ ] Upload de comprovantes
- [ ] Tags personalizadas

## 📝 Notas de Desenvolvimento

- Criado em: 26/10/2025
- Arquivo: `src/Pages/Movimentos.jsx`
- Serviço: `src/services/movimentoService.js`
- Rota: `/movimentos`
- Componentes usados: Sidebar, ThemeToggle

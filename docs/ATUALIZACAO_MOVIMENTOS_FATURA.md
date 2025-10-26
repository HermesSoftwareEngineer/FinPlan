# Atualização: Movimentos da Fatura

## 📋 Resumo
Atualização do serviço de faturas e componentes relacionados para utilizar os novos endpoints da API de movimentos de fatura.

## 🔧 Alterações Realizadas

### 1. `faturaService.js`
**Novos métodos adicionados:**

#### `incluirMovimentoFatura(faturaId, dadosMovimento)`
- **Endpoint:** `POST /faturas/:id/movimentos`
- **Descrição:** Inclui um novo movimento (compra) em uma fatura específica
- **Parâmetros obrigatórios:**
  - `descricao` - Descrição da compra
  - `valor` - Valor da compra (deve ser > 0)
  - `data_competencia` - Data da competência/compra
- **Parâmetros opcionais:**
  - `categoria_id` - ID da categoria
  - `observacao` - Observações adicionais
  - `parcelado` - Se é parcelado (padrão: false)
  - `numero_parcela` - Número da parcela atual
  - `total_parcelas` - Total de parcelas

**Efeitos Automáticos:**
- ✅ Atualiza `valor_total` da fatura
- ✅ Atualiza `limite_utilizado` do cartão
- ✅ Define automaticamente: `tipo: "despesa"`, `origem: "cartao"`, `pago: false`

**Validações:**
- ❌ Fatura não pode estar fechada ou paga
- ❌ Valor deve ser maior que zero
- ✅ Fatura deve pertencer ao usuário autenticado

#### `atualizarMovimentoFatura(faturaId, movimentoId, dadosMovimento)`
- **Endpoint:** `PUT /faturas/:id/movimentos/:movimento_id`
- **Descrição:** Atualiza um movimento existente de uma fatura
- **Campos Atualizáveis:**
  - `descricao` - Nova descrição
  - `valor` - Novo valor (recalcula total da fatura e limite do cartão)
  - `data_competencia` - Nova data
  - `categoria_id` - Nova categoria
  - `observacao` - Nova observação

**Efeitos Automáticos (quando valor é alterado):**
- ✅ Recalcula `valor_total` da fatura (aplica a diferença)
- ✅ Recalcula `limite_utilizado` do cartão (aplica a diferença)

**Validações:**
- ❌ Fatura não pode estar fechada ou paga
- ❌ Movimento deve pertencer à fatura especificada
- ❌ Valor deve ser maior que zero (se informado)
- ✅ Fatura deve pertencer ao usuário autenticado

#### `buscarMovimentosFatura(id)` - Atualizado
- **Endpoint:** `GET /faturas/:id/movimentos`
- **Descrição:** Retorna todos os movimentos vinculados à fatura
- **Recursos:**
  - ✅ Verifica se a fatura pertence ao usuário autenticado
  - ✅ Inclui dados de categoria e conta associados
  - ✅ Ordenado por data de competência (ascendente)

---

### 2. `DetalhesFatura.jsx`
**Alterações:**
- Agora usa `faturaService.buscarMovimentosFatura(id)` para buscar os movimentos
- Fallback para `fatura.movimentos` caso o endpoint falhe (compatibilidade)
- Melhor tratamento de erros ao buscar movimentos

---

### 3. `ModalNovoMovimentoFatura.jsx`
**Alterações principais:**

1. **Uso do novo endpoint:**
   - Agora usa `faturaService.incluirMovimentoFatura()` ao invés de `movimentoService.criar()`
   - Remove campos automáticos (`tipo`, `origem`, `pago`) que são definidos pela API

2. **Filtro de faturas:**
   - Lista apenas faturas **abertas** (não fechadas ou pagas)
   - Validação no frontend antes de permitir criação

3. **Avisos ao usuário:**
   - Informa sobre efeitos automáticos (atualização de valor_total e limite_utilizado)
   - Avisa que só é possível adicionar em faturas abertas

4. **Parcelamento:**
   - Simplificado: envia apenas `total_parcelas`
   - API cria automaticamente as parcelas subsequentes

---

### 4. `ModalEditarMovimentoFatura.jsx`
**Alterações principais:**

1. **Uso do novo endpoint:**
   - Agora usa `faturaService.atualizarMovimentoFatura()` ao invés de `movimentoService.atualizar()`
   - Envia apenas campos editáveis conforme a API

2. **Filtro de faturas:**
   - Lista apenas faturas **abertas** (não fechadas ou pagas)
   - Validação no frontend antes de permitir edição

3. **Remoção de edição de parcelamento:**
   - Campos de parcelamento removidos do formulário
   - Informação de parcela exibida apenas como visualização
   - Aviso: "Informações de parcelamento não podem ser editadas após a criação"

4. **Avisos ao usuário:**
   - Informa sobre efeitos automáticos ao alterar valor
   - Avisa que só é possível editar movimentos de faturas abertas

5. **FormData simplificado:**
   - Removidos campos: `parcelado`, `numero_parcela`, `total_parcelas`
   - Mantidos apenas: `descricao`, `valor`, `data_competencia`, `observacao`, `categoria_id`, `fatura_id`

---

## 🎯 Benefícios das Alterações

### 1. **Integridade de Dados**
- API garante automaticamente a consistência entre fatura e cartão
- Validações no backend evitam estados inválidos

### 2. **Melhor UX**
- Usuário informado sobre efeitos automáticos
- Filtros impedem ações inválidas (editar fatura fechada)
- Avisos claros sobre limitações

### 3. **Código mais Limpo**
- Endpoints específicos para operações de fatura
- Lógica de negócio centralizada no backend
- Frontend mais enxuto e focado em apresentação

### 4. **Segurança**
- Validações de propriedade da fatura no backend
- Impossível editar faturas de outros usuários
- Validações de estado (aberta/fechada/paga)

---

## 📊 Fluxo de Dados

### Criar Movimento na Fatura
```
ModalNovoMovimentoFatura
    ↓ (dados do movimento)
faturaService.incluirMovimentoFatura(faturaId, dados)
    ↓ (POST /faturas/:id/movimentos)
API Backend
    ↓ (movimento criado + efeitos automáticos)
    ✅ Movimento criado
    ✅ valor_total da fatura atualizado
    ✅ limite_utilizado do cartão atualizado
```

### Editar Movimento da Fatura
```
ModalEditarMovimentoFatura
    ↓ (dados atualizados)
faturaService.atualizarMovimentoFatura(faturaId, movimentoId, dados)
    ↓ (PUT /faturas/:id/movimentos/:movimento_id)
API Backend
    ↓ (movimento atualizado + efeitos automáticos)
    ✅ Movimento atualizado
    ✅ diferença de valor aplicada à fatura
    ✅ diferença de valor aplicada ao limite do cartão
```

### Buscar Movimentos da Fatura
```
DetalhesFatura
    ↓
faturaService.buscarMovimentosFatura(faturaId)
    ↓ (GET /faturas/:id/movimentos)
API Backend
    ↓ (movimentos com categoria e conta)
Lista de movimentos ordenada por data
```

---

## ⚠️ Validações Implementadas

### No Frontend (Pré-validação)
- ✅ Filtro de faturas abertas nos selects
- ✅ Validação de campos obrigatórios (HTML5)
- ✅ Validação de valor mínimo (> 0)
- ✅ Mensagens de aviso sobre limitações

### No Backend (API)
- ✅ Fatura não pode estar fechada ou paga
- ✅ Movimento deve pertencer à fatura especificada
- ✅ Valor deve ser maior que zero
- ✅ Fatura deve pertencer ao usuário autenticado
- ✅ Categoria deve pertencer ao usuário (se informada)

---

## 🧪 Testes Sugeridos

1. **Criar movimento em fatura aberta** ✓
2. **Tentar criar movimento em fatura fechada** (deve falhar)
3. **Tentar criar movimento em fatura paga** (deve falhar)
4. **Editar valor de movimento** (verificar recálculo da fatura e cartão)
5. **Editar descrição/categoria** (sem afetar valores)
6. **Criar movimento parcelado** (verificar criação de parcelas subsequentes)
7. **Visualizar movimento parcelado** (verificar info de parcela)
8. **Tentar editar parcela de movimento** (info deve ser somente leitura)

---

## 📝 Notas Importantes

1. **Parcelamento:**
   - Na criação: envia `total_parcelas`, API cria as demais automaticamente
   - Na edição: info de parcela é somente leitura, não editável

2. **Status da Fatura:**
   - Apenas faturas **abertas** permitem adição/edição de movimentos
   - Validação no frontend e backend

3. **Recálculo Automático:**
   - Ao criar: `valor_total` += `valor`
   - Ao editar: `valor_total` += `(novo_valor - valor_antigo)`
   - Mesmo para `limite_utilizado` do cartão

4. **Compatibilidade:**
   - Mantido fallback para `fatura.movimentos` caso endpoint falhe
   - Suporta tanto API antiga quanto nova

---

## 🔄 Migração de Código Antigo

### Antes:
```javascript
// Criar movimento
await movimentoService.criar({
  descricao: 'Compra',
  valor: 100,
  tipo: 'despesa',
  origem: 'cartao',
  pago: false,
  fatura_id: faturaId
});
```

### Depois:
```javascript
// Criar movimento na fatura
await faturaService.incluirMovimentoFatura(faturaId, {
  descricao: 'Compra',
  valor: 100,
  // tipo, origem e pago são definidos automaticamente
});
```

---

## ✅ Checklist de Implementação

- [x] Adicionar métodos no `faturaService.js`
- [x] Atualizar `DetalhesFatura.jsx` para usar novo endpoint
- [x] Atualizar `ModalNovoMovimentoFatura.jsx`
  - [x] Usar `incluirMovimentoFatura()`
  - [x] Filtrar faturas abertas
  - [x] Adicionar avisos
- [x] Atualizar `ModalEditarMovimentoFatura.jsx`
  - [x] Usar `atualizarMovimentoFatura()`
  - [x] Filtrar faturas abertas
  - [x] Remover edição de parcelamento
  - [x] Adicionar avisos
- [x] Adicionar validações e tratamento de erros
- [x] Documentar alterações

---

**Data da Atualização:** 26/10/2025  
**Versão da API:** Conforme documentação fornecida

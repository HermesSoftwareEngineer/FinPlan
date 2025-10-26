# Paleta de Cores - FinPlan

## 🎨 Tema Principal

### Verde Financeiro (Primary)
Representa crescimento, prosperidade e saúde financeira.
- **50-200**: Tons claros para backgrounds e highlights
- **500**: Verde principal `#22c55e`
- **600-700**: Tons mais escuros para hover e active states
- **900-950**: Tons muito escuros para texto em modo claro

### Azul Confiança (Secondary)
Transmite confiança, segurança e profissionalismo.
- **50-200**: Tons claros para backgrounds secundários
- **500**: Azul principal `#3b82f6`
- **600-700**: Tons para elementos interativos
- **900-950**: Tons escuros para contraste

### Verde Esmeralda (Accent)
Acento moderno e vibrante para CTAs e destaques.
- **50-200**: Backgrounds sutis
- **500**: Esmeralda `#10b981`
- **600-700**: Hover states e botões secundários
- **900-950**: Elementos de texto

## 🎯 Cores Semânticas

### Success (Verde)
- Usado para: transações positivas, receitas, ganhos
- Tom principal: `#22c55e`

### Danger (Vermelho)
- Usado para: despesas, alertas, valores negativos
- Tom principal: `#ef4444`

### Warning (Amarelo/Laranja)
- Usado para: avisos, pendências, metas próximas do vencimento
- Tom principal: `#f59e0b`

## 🌓 Temas

### Tema Claro
- **Background**: `#ffffff` (branco puro)
- **Background Secondary**: `#f9fafb` (cinza muito claro)
- **Background Tertiary**: `#f3f4f6` (cinza claro)
- **Text**: `#111827` (quase preto)
- **Text Secondary**: `#6b7280` (cinza médio)
- **Border**: `#e5e7eb` (cinza claro)

### Tema Escuro
- **Background**: `#0f172a` (azul escuro profundo)
- **Background Secondary**: `#1e293b` (azul escuro médio)
- **Background Tertiary**: `#334155` (azul acinzentado)
- **Text**: `#f8fafc` (branco suave)
- **Text Secondary**: `#cbd5e1` (cinza claro)
- **Border**: `#334155` (bordas sutis)

## 💡 Uso Recomendado

### Gradientes
- Hero: `from-primary-600 to-accent-600`
- Cards: `from-primary-100 to-accent-100` (claro) / `from-primary-900/30 to-accent-900/30` (escuro)
- Botões: `from-primary-600 to-accent-600`

### Sombras
- Cards: `shadow-lg shadow-primary-500/30`
- Botões: `shadow-xl shadow-primary-500/30`
- Hover: Aumentar intensidade da sombra

### Bordas
- Padrão: `border-light-border` / `dark:border-dark-border`
- Hover: `hover:border-primary-500`
- Focus: `focus:ring-2 focus:ring-primary-500`

## 🔄 Alternância de Tema

Para alternar entre claro e escuro, adicione/remova a classe `dark` no elemento `<html>`:

```javascript
// Ativar tema escuro
document.documentElement.classList.add('dark')

// Ativar tema claro
document.documentElement.classList.remove('dark')
```

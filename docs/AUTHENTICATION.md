# 🔐 Autenticação - FinPlan

## Páginas Criadas

### 1. **Login** (`/login`)
Página de autenticação de usuários existentes.

**Recursos:**
- ✉️ Campo de e-mail
- 🔒 Campo de senha
- ☑️ Checkbox "Lembrar-me"
- 🔗 Link "Esqueceu a senha?"
- 🚀 Botão de login com gradiente
- 🌐 Opções de login social (Google e GitHub)
- 🔗 Link para cadastro

**Validações:**
- E-mail e senha obrigatórios
- Formato de e-mail válido

### 2. **Cadastrar** (`/cadastrar`)
Página de registro de novos usuários.

**Recursos:**
- 👤 Campo de nome completo
- ✉️ Campo de e-mail
- 🔒 Campo de senha
- 🔁 Confirmação de senha
- ☑️ Aceitação de termos e condições
- 🚀 Botão de cadastro com gradiente
- 🌐 Opções de cadastro social (Google e GitHub)
- 🔗 Link para login

**Validações:**
- Todos os campos obrigatórios
- E-mail em formato válido
- Senha mínima de 8 caracteres
- Senhas devem coincidir
- Termos devem ser aceitos
- Mensagens de erro específicas para cada campo

## Rotas Configuradas

```javascript
/ - Home (Landing Page)
/login - Página de Login
/cadastrar - Página de Cadastro
```

## Design

Ambas as páginas seguem o design system do FinPlan:

### 🎨 Elementos Visuais
- Gradientes verde-esmeralda
- Tema claro/escuro (preparado para toggle)
- Cards com glassmorphism
- Inputs com focus states customizados
- Botões com hover animations
- Validação visual de erros (bordas vermelhas)

### 📱 Responsividade
- Layout centralizado
- Padding adaptativo
- Funciona em mobile, tablet e desktop

### ♿ Acessibilidade
- Labels apropriados
- IDs vinculados
- Placeholders informativos
- Mensagens de erro claras
- Estados de foco visíveis

## Próximos Passos

Para implementar autenticação real:

1. **Backend/API:**
   ```javascript
   // Substituir console.log por chamada de API
   const response = await fetch('/api/login', {
     method: 'POST',
     body: JSON.stringify(formData)
   });
   ```

2. **Gerenciamento de Estado:**
   - Adicionar Context API ou Redux para estado global
   - Armazenar token de autenticação
   - Gerenciar estado do usuário logado

3. **Proteção de Rotas:**
   - Criar componente PrivateRoute
   - Verificar autenticação antes de acessar rotas protegidas
   - Redirecionar para login se não autenticado

4. **Integração OAuth:**
   - Configurar Google OAuth
   - Configurar GitHub OAuth
   - Implementar callbacks de autenticação

## Uso

Navegue entre as páginas usando os links:
- Da Home → Login/Cadastrar (header ou botão hero)
- Do Login → Cadastrar (link no rodapé)
- Do Cadastrar → Login (link no rodapé)

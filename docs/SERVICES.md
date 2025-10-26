# 🔌 Serviços de Integração com Backend - FinPlan

## 📁 Estrutura de Serviços

```
src/services/
├── api.js              # Configuração base da API e função de requisição
├── authService.js      # Serviços de autenticação
├── userService.js      # Serviços de usuário
└── index.js            # Exportação central dos serviços
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## 📡 Serviços Disponíveis

### 1. **AuthService** - Autenticação

#### `login(credentials)`
Realiza o login do usuário.

**Parâmetros:**
```javascript
{
  email: string,
  password: string
}
```

**Exemplo de uso:**
```javascript
import { authService } from '../services';

const response = await authService.login({
  email: 'joao@exemplo.com',
  password: 'senha123'
});
```

**Endpoint:** `POST /auth/login`

---

#### `register(userData)`
Registra um novo usuário.

**Parâmetros:**
```javascript
{
  name: string,
  email: string,
  password: string
}
```

**Exemplo de uso:**
```javascript
const response = await authService.register({
  name: 'João Silva',
  email: 'joao@exemplo.com',
  password: 'senha123'
});
```

**Endpoint:** `POST /auth/register`

---

#### `logout()`
Remove os dados de autenticação do localStorage.

**Exemplo de uso:**
```javascript
authService.logout();
```

---

#### `isAuthenticated()`
Verifica se o usuário está autenticado.

**Retorno:** `boolean`

**Exemplo de uso:**
```javascript
if (authService.isAuthenticated()) {
  // Usuário logado
}
```

---

#### `getToken()`
Obtém o token de autenticação.

**Retorno:** `string | null`

---

#### `getUser()`
Obtém os dados do usuário logado.

**Retorno:** `Object | null`

---

### 2. **UserService** - Usuário

#### `getProfile()`
Obtém o perfil do usuário logado (rota protegida).

**Exemplo de uso:**
```javascript
import { userService } from '../services';

const profile = await userService.getProfile();
```

**Endpoint:** `GET /user/profile`  
**Headers:** `Authorization: Bearer {token}`

---

#### `updateProfile(userData)`
Atualiza o perfil do usuário.

**Parâmetros:**
```javascript
{
  name?: string,
  email?: string,
  // outros campos...
}
```

**Endpoint:** `PUT /user/profile`  
**Headers:** `Authorization: Bearer {token}`

---

## 🎯 Uso nas Páginas

### Login.jsx
```javascript
import { authService } from '../services';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await authService.login({
      email: formData.email,
      password: formData.password
    });
    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};
```

### Cadastrar.jsx
```javascript
import { authService } from '../services';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await authService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    navigate('/dashboard');
  } catch (err) {
    setApiError(err.message);
  }
};
```

## 🔐 Gestão de Tokens

Os tokens são automaticamente:
- **Salvos** no `localStorage` após login/cadastro bem-sucedido
- **Incluídos** nas requisições que necessitam autenticação
- **Removidos** no logout ou quando expirados (401)

## ⚠️ Tratamento de Erros

A classe `ApiError` fornece informações detalhadas sobre erros:

```javascript
try {
  await authService.login(credentials);
} catch (error) {
  if (error.status === 401) {
    // Credenciais inválidas
  } else if (error.status === 0) {
    // Erro de conexão
  } else {
    // Outro erro
  }
}
```

## 🚀 Endpoints Backend Esperados

```http
### Cadastro
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}

### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senha123"
}

### Perfil (Protegido)
GET http://localhost:3000/user/profile
Authorization: Bearer {seu_token}
```

## 📦 Resposta Esperada

### Login/Register
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

### Profile
```json
{
  "id": "123",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "createdAt": "2025-10-26T00:00:00.000Z"
}
```

## 🔄 Próximas Funcionalidades

- [ ] Refresh token automático
- [ ] Interceptor para renovação de token
- [ ] Cache de requisições
- [ ] Retry automático em caso de falha
- [ ] Upload de arquivos (avatar)

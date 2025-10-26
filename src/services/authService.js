import api from './api';

// Serviço de autenticação
const authService = {
  /**
   * Realiza o login do usuário
   * @param {Object} credentials - Credenciais do usuário
   * @param {string} credentials.email - E-mail do usuário
   * @param {string} credentials.password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      // Salva o token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Realiza o cadastro de um novo usuário
   * @param {Object} userData - Dados do usuário
   * @param {string} userData.name - Nome completo
   * @param {string} userData.email - E-mail
   * @param {string} userData.password - Senha
   * @returns {Promise<Object>} Dados do usuário criado e token
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      // Salva o token no localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  },

  /**
   * Realiza o logout do usuário
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtém o token de autenticação
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Obtém os dados do usuário logado
   * @returns {Object|null}
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;

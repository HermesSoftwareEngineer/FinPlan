import api from './api';
import authService from './authService';

// Serviço de usuário
const userService = {
  /**
   * Obtém o perfil do usuário logado
   * @returns {Promise<Object>} Dados do perfil
   */
  async getProfile() {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      
      // Se o token for inválido, faz logout
      if (error.response?.status === 401) {
        authService.logout();
      }
      
      throw error;
    }
  },

  /**
   * Atualiza o perfil do usuário
   * @param {Object} userData - Dados a serem atualizados
   * @returns {Promise<Object>} Dados atualizados
   */
  async updateProfile(userData) {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await api.put('/user/profile', userData);
      const data = response.data;

      // Atualiza os dados no localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },
};

export default userService;

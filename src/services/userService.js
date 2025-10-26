import apiRequest from './api';
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
      const data = await apiRequest('/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      
      // Se o token for inválido, faz logout
      if (error.status === 401) {
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
      const data = await apiRequest('/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

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

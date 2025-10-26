import api from './api';

/**
 * Serviço para gerenciamento de contas bancárias
 */
const contaService = {
  /**
   * Lista todas as contas
   * @returns {Promise} Lista de contas
   */
  async listar() {
    try {
      const response = await api.get('/contas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar contas:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Busca uma conta específica por ID
   * @param {number} id - ID da conta
   * @returns {Promise} Dados da conta
   */
  async buscar(id) {
    try {
      const response = await api.get(`/contas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      throw error;
    }
  },

  /**
   * Cria uma nova conta
   * @param {Object} dados - Dados da conta
   * @returns {Promise} Conta criada
   */
  async criar(dados) {
    try {
      console.log('Criando conta com dados:', dados);
      const response = await api.post('/contas', dados);
      console.log('Conta criada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Dados enviados:', dados);
      throw error;
    }
  },

  /**
   * Atualiza uma conta existente
   * @param {number} id - ID da conta
   * @param {Object} dados - Dados a atualizar
   * @returns {Promise} Conta atualizada
   */
  async atualizar(id, dados) {
    try {
      console.log(`Atualizando conta ${id} com dados:`, dados);
      const response = await api.put(`/contas/${id}`, dados);
      console.log('Conta atualizada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('ID:', id);
      console.error('Dados enviados:', dados);
      throw error;
    }
  },

  /**
   * Deleta uma conta
   * @param {number} id - ID da conta
   * @returns {Promise}
   */
  async deletar(id) {
    try {
      console.log(`Deletando conta com ID: ${id}`);
      const response = await api.delete(`/contas/${id}`);
      console.log('Conta deletada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('ID:', id);
      throw error;
    }
  },
};

export default contaService;

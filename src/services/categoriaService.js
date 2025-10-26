import api from './api';

/**
 * Serviço para gerenciamento de categorias
 */
const categoriaService = {
  /**
   * Lista todas as categorias com filtro opcional por tipo
   * @param {string} tipo - Filtro por tipo (receita/despesa)
   * @returns {Promise} Lista de categorias
   */
  async listar(tipo = '') {
    try {
      const url = tipo ? `/categorias?tipo=${tipo}` : '/categorias';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      throw error;
    }
  },

  /**
   * Busca uma categoria específica por ID
   * @param {number} id - ID da categoria
   * @returns {Promise} Dados da categoria
   */
  async buscar(id) {
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      throw error;
    }
  },

  /**
   * Cria uma nova categoria
   * @param {Object} dados - Dados da categoria
   * @returns {Promise} Categoria criada
   */
  async criar(dados) {
    try {
      console.log('Criando categoria com dados:', dados);
      const response = await api.post('/categorias', dados);
      console.log('Categoria criada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      console.error('Dados enviados:', dados);
      throw error;
    }
  },

  /**
   * Atualiza uma categoria existente
   * @param {number} id - ID da categoria
   * @param {Object} dados - Dados a atualizar
   * @returns {Promise} Categoria atualizada
   */
  async atualizar(id, dados) {
    try {
      console.log(`Atualizando categoria ${id} com dados:`, dados);
      const response = await api.put(`/categorias/${id}`, dados);
      console.log('Categoria atualizada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      console.error('ID:', id);
      console.error('Dados enviados:', dados);
      throw error;
    }
  },

  /**
   * Deleta uma categoria
   * @param {number} id - ID da categoria
   * @returns {Promise}
   */
  async deletar(id) {
    try {
      console.log(`Deletando categoria com ID: ${id}`);
      const response = await api.delete(`/categorias/${id}`);
      console.log('Categoria deletada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      console.error('ID:', id);
      throw error;
    }
  },
};

export default categoriaService;

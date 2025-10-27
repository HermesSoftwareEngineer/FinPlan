import api from './api';

/**
 * Serviço para gerenciamento de movimentos financeiros
 */
const movimentoService = {
  /**
   * Lista todos os movimentos com filtros opcionais
   * @param {Object} filtros - Filtros de busca
   * @returns {Promise} Lista de movimentos
   */
  async listar(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.pago !== '' && filtros.pago !== undefined && filtros.pago !== null) {
        params.append('pago', filtros.pago);
      }
      if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
      if (filtros.conta_id) params.append('conta_id', filtros.conta_id);
      if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id);
      
      // Filtro de múltiplas categorias - API espera formato: categorias=1,2,3
      if (filtros.categorias && Array.isArray(filtros.categorias) && filtros.categorias.length > 0) {
        params.append('categorias', filtros.categorias.join(','));
      }

      const queryString = params.toString();
      const url = queryString ? `/movimentos?${queryString}` : '/movimentos';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar movimentos:', error);
      throw error;
    }
  },

  /**
   * Lista movimentos agrupados por dia com saldos calculados
   * @param {Object} filtros - Filtros de busca (conta_id, data_inicio, data_fim, categorias)
   * @returns {Promise} Objeto com saldos e movimentos agrupados por dia
   */
  async listarComSaldo(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filtros.conta_id) params.append('conta_id', filtros.conta_id);
      if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
      
      // Filtro de múltiplas categorias
      if (filtros.categorias && Array.isArray(filtros.categorias) && filtros.categorias.length > 0) {
        params.append('categorias', filtros.categorias.join(','));
      }

      const queryString = params.toString();
      const url = queryString ? `/movimentos/com-saldo?${queryString}` : '/movimentos/com-saldo';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar movimentos com saldo:', error);
      throw error;
    }
  },

  /**
   * Busca um movimento específico por ID
   * @param {number} id - ID do movimento
   * @returns {Promise} Dados do movimento
   */
  async buscar(id) {
    try {
      const response = await api.get(`/movimentos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar movimento:', error);
      throw error;
    }
  },

  /**
   * Cria um novo movimento
   * @param {Object} dados - Dados do movimento
   * @returns {Promise} Movimento criado
   */
  async criar(dados) {
    try {
      console.log("Cadastrando movimento: ", dados)
      const response = await api.post('/movimentos', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar movimento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um movimento existente
   * @param {number} id - ID do movimento
   * @param {Object} dados - Dados a atualizar
   * @returns {Promise} Movimento atualizado
   */
  async atualizar(id, dados) {
    try {
      let url = `/movimentos/${id}`;
      const response = await api.put(url, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar movimento:', error);
      throw error;
    }
  },

  /**
   * Alterna o status de pago/não pago
   * @param {number} id - ID do movimento
   * @returns {Promise} Movimento atualizado
   */
  async togglePago(id) {
    try {
      const response = await api.patch(`/movimentos/${id}/toggle-pago`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alternar status de pagamento:', error);
      throw error;
    }
  },

  /**
   * Deleta um movimento
   * @param {number} id - ID do movimento
   * @param {string} [impactar] - Escopo de exclusão para recorrentes
   * @returns {Promise}
   */
  async deletar(id, impactar) {
    try {
      let url = `/movimentos/${id}`;
      // Envia impactar no body, não na query string
      const body = impactar ? { impactar } : undefined;
      const response = await api.delete(url, body ? { data: body } : undefined);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar movimento:', error);
      throw error;
    }
  },
};

export default movimentoService;

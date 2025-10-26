import api from './api';

/**
 * Serviço para obter dados consolidados do dashboard
 */
const dashboardService = {
  /**
   * Busca os dados do dashboard com filtros opcionais de período
   * @param {Object} filtros
   * @param {string} [filtros.data_inicio]
   * @param {string} [filtros.data_fim]
   * @returns {Promise<Object>} Dados consolidados
   */
  async obter(filtros = {}) {
    try {
      const params = {};

      if (filtros.data_inicio) {
        params.data_inicio = filtros.data_inicio;
      }

      if (filtros.data_fim) {
        params.data_fim = filtros.data_fim;
      }

      const response = await api.get('/dashboard', {
        params: Object.keys(params).length ? params : undefined,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },
};

export default dashboardService;

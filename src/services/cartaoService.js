import api from './api';

const cartaoService = {
  // Listar todos os cartões
  listarCartoes: async () => {
    try {
      const response = await api.get('/cartoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cartões:', error);
      throw error;
    }
  },

  // Buscar cartão por ID
  buscarCartao: async (id) => {
    try {
      const response = await api.get(`/cartoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cartão:', error);
      throw error;
    }
  },

  // Criar novo cartão
  criarCartao: async (dados) => {
    try {
      const response = await api.post('/cartoes', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cartão:', error);
      throw error;
    }
  },

  // Atualizar cartão
  atualizarCartao: async (id, dados) => {
    try {
      const response = await api.put(`/cartoes/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
      throw error;
    }
  },

  // Deletar cartão
  deletarCartao: async (id) => {
    try {
      const response = await api.delete(`/cartoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
      throw error;
    }
  }
};

export default cartaoService;

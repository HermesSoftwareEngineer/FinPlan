import api from './api';

const grupoCategoriaService = {
  // Listar todos os grupos de categorias
  listar: async () => {
    const response = await api.get('/grupos-categorias');
    return response.data;
  },

  // Buscar um grupo específico
  buscar: async (id) => {
    const response = await api.get(`/grupos-categorias/${id}`);
    return response.data;
  },

  // Criar novo grupo
  criar: async (dados) => {
    const response = await api.post('/grupos-categorias', dados);
    return response.data;
  },

  // Atualizar grupo
  atualizar: async (id, dados) => {
    const response = await api.put(`/grupos-categorias/${id}`, dados);
    return response.data;
  },

  // Deletar grupo
  deletar: async (id) => {
    const response = await api.delete(`/grupos-categorias/${id}`);
    return response.data;
  },
};

export default grupoCategoriaService;

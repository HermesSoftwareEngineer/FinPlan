import api from './api';

const faturaService = {
  // Listar faturas com filtros opcionais
  listarFaturas: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.cartao_id) {
        params.append('cartao_id', filtros.cartao_id);
      }
      if (filtros.status) {
        params.append('status', filtros.status);
      }
      if (filtros.mes_referencia) {
        params.append('mes_referencia', filtros.mes_referencia);
      }
      if (filtros.ano_referencia) {
        params.append('ano_referencia', filtros.ano_referencia);
      }

      const queryString = params.toString();
      const url = queryString ? `/faturas?${queryString}` : '/faturas';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar faturas:', error);
      throw error;
    }
  },

  // Buscar fatura por ID
  buscarFatura: async (id) => {
    try {
      const response = await api.get(`/faturas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fatura:', error);
      throw error;
    }
  },

  // Criar nova fatura
  criarFatura: async (dados) => {
    try {
      const response = await api.post('/faturas', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      throw error;
    }
  },

  // Atualizar fatura
  atualizarFatura: async (id, dados) => {
    try {
      const response = await api.put(`/faturas/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar fatura:', error);
      throw error;
    }
  },

  // Deletar fatura
  deletarFatura: async (id) => {
    try {
      const response = await api.delete(`/faturas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar fatura:', error);
      throw error;
    }
  },

  /**
   * Pagar fatura - Suporta pagamentos parciais e múltiplas contas
   * @param {number} id - ID da fatura
   * @param {object} dadosPagamento - Dados do pagamento
   * @param {number} dadosPagamento.valor_pago - Valor do pagamento (obrigatório)
   * @param {string} dadosPagamento.data_pagamento - Data do pagamento (obrigatório)
   * @param {number} dadosPagamento.conta_id - ID da conta para débito (opcional, usa padrão da fatura)
   * @param {number} dadosPagamento.categoria_id - ID da categoria (opcional)
   * @returns {Promise} Resposta com dados da fatura atualizada
   */
  pagarFatura: async (id, dadosPagamento) => {
    try {
      const response = await api.post(`/faturas/${id}/pagar`, dadosPagamento);
      return response.data;
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
      throw error;
    }
  },

  // Fechar fatura
  fecharFatura: async (id) => {
    try {
      const response = await api.put(`/faturas/${id}`, {
        status: 'fechada'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fechar fatura:', error);
      throw error;
    }
  },

  /**
   * Buscar movimentos de uma fatura específica
   * @param {number} id - ID da fatura
   * @returns {Promise} Lista de movimentos vinculados à fatura
   */
  buscarMovimentosFatura: async (id) => {
    try {
      const response = await api.get(`/faturas/${id}/movimentos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar movimentos da fatura:', error);
      throw error;
    }
  },

  /**
   * Incluir movimento na fatura
   * @param {number} faturaId - ID da fatura
   * @param {object} dadosMovimento - Dados do movimento
   * @param {string} dadosMovimento.descricao - Descrição da compra (obrigatório)
   * @param {number} dadosMovimento.valor - Valor da compra (obrigatório, deve ser > 0)
   * @param {string} dadosMovimento.data_competencia - Data da competência/compra (obrigatório)
   * @param {number} dadosMovimento.categoria_id - ID da categoria (opcional)
   * @param {string} dadosMovimento.observacao - Observações adicionais (opcional)
   * @param {boolean} dadosMovimento.parcelado - Se é parcelado (opcional, padrão: false)
   * @param {number} dadosMovimento.numero_parcela - Número da parcela atual (opcional)
   * @param {number} dadosMovimento.total_parcelas - Total de parcelas (opcional)
   * @returns {Promise} Movimento criado com efeitos automáticos aplicados
   */
  incluirMovimentoFatura: async (faturaId, dadosMovimento) => {
    try {
      const response = await api.post(`/faturas/${faturaId}/movimentos`, dadosMovimento);
      return response.data;
    } catch (error) {
      console.error('Erro ao incluir movimento na fatura:', error);
      throw error;
    }
  },

  /**
   * Atualizar movimento da fatura
   * @param {number} faturaId - ID da fatura
   * @param {number} movimentoId - ID do movimento
   * @param {object} dadosMovimento - Dados do movimento para atualização
   * @param {string} dadosMovimento.descricao - Nova descrição (opcional)
   * @param {number} dadosMovimento.valor - Novo valor (opcional, recalcula total da fatura e limite do cartão)
   * @param {string} dadosMovimento.data_competencia - Nova data (opcional)
   * @param {number} dadosMovimento.categoria_id - Nova categoria (opcional)
   * @param {string} dadosMovimento.observacao - Nova observação (opcional)
   * @returns {Promise} Movimento atualizado com efeitos automáticos aplicados
   */
  atualizarMovimentoFatura: async (faturaId, movimentoId, dadosMovimento) => {
    try {
      const response = await api.put(`/faturas/${faturaId}/movimentos/${movimentoId}`, dadosMovimento);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar movimento da fatura:', error);
      throw error;
    }
  },

  /**
   * Calcular valor restante a pagar de uma fatura
   * @param {object} fatura - Objeto da fatura
   * @returns {number} Valor restante
   */
  calcularValorRestante: (fatura) => {
    if (!fatura) return 0;
    const total = parseFloat(fatura.valor_total || 0);
    const pago = parseFloat(fatura.valor_pago || 0);
    return Math.max(0, total - pago);
  },

  /**
   * Verificar se fatura está completamente paga
   * @param {object} fatura - Objeto da fatura
   * @returns {boolean} True se paga completamente
   */
  estaPaga: (fatura) => {
    if (!fatura) return false;
    return fatura.status === 'paga' || 
           parseFloat(fatura.valor_pago || 0) >= parseFloat(fatura.valor_total || 0);
  },

  /**
   * Verificar se fatura está atrasada
   * @param {object} fatura - Objeto da fatura
   * @returns {boolean} True se atrasada
   */
  estaAtrasada: (fatura) => {
    if (!fatura || !fatura.data_vencimento) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(fatura.data_vencimento);
    vencimento.setHours(0, 0, 0, 0);
    return vencimento < hoje && !faturaService.estaPaga(fatura);
  },

  /**
   * Formatar período de referência da fatura (ex: "10/2025")
   * @param {object} fatura - Objeto da fatura
   * @returns {string} Período formatado
   */
  formatarPeriodoReferencia: (fatura) => {
    if (!fatura) return '';
    const mes = String(fatura.mes_referencia).padStart(2, '0');
    return `${mes}/${fatura.ano_referencia}`;
  },

  /**
   * Listar faturas em aberto (não pagas)
   * @param {number} cartao_id - ID do cartão (opcional)
   * @returns {Promise} Lista de faturas em aberto
   */
  listarFaturasEmAberto: async (cartao_id = null) => {
    try {
      const filtros = { status: 'aberta' };
      if (cartao_id) {
        filtros.cartao_id = cartao_id;
      }
      return await faturaService.listarFaturas(filtros);
    } catch (error) {
      console.error('Erro ao listar faturas em aberto:', error);
      throw error;
    }
  },

  /**
   * Listar faturas vencidas
   * @param {number} cartao_id - ID do cartão (opcional)
   * @returns {Promise} Lista de faturas vencidas
   */
  listarFaturasVencidas: async (cartao_id = null) => {
    try {
      const filtros = {};
      if (cartao_id) {
        filtros.cartao_id = cartao_id;
      }
      const faturas = await faturaService.listarFaturas(filtros);
      return faturas.filter(f => faturaService.estaAtrasada(f));
    } catch (error) {
      console.error('Erro ao listar faturas vencidas:', error);
      throw error;
    }
  }
};

export default faturaService;

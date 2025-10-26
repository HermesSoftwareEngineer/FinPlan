import { useState, useEffect } from 'react';
import movimentoService from '../services/movimentoService';
import categoriaService from '../services/categoriaService';
import contaService from '../services/contaService';
import { cartaoService } from '../services';

export default function ModalNovoMovimento({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    data_competencia: new Date().toISOString().split('T')[0],
    observacao: '',
    pago: true,
    recorrente: false,
    parcelado: false,
    numero_parcela: 1,
    total_parcelas: 1,
    conta_id: '',
    cartao_id: '',
    categoria_id: '',
    forma_pagamento: 'conta', // 'conta' ou 'cartao'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contas, setContas] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const getIconeEmoji = (iconeValue) => {
    const icones = {
      restaurant: '🍽️',
      shopping_cart: '🛒',
      home: '🏠',
      directions_car: '🚗',
      favorite: '❤️',
      school: '📚',
      sports_esports: '🎮',
      work: '💼',
      attach_money: '💰',
      savings: '💵',
      credit_card: '💳',
      local_grocery_store: '🏪',
      fitness_center: '💪',
      phone: '📱',
      lightbulb: '💡',
      pets: '🐾',
      flight: '✈️',
      celebration: '🎉',
      checkroom: '👔',
      local_pharmacy: '💊',
    };
    return icones[iconeValue] || '📂';
  };

  // Carregar contas e categorias ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen, formData.tipo]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const [contasData, cartoesResponse, categoriasData] = await Promise.all([
        contaService.listar(),
        cartaoService.listarCartoes(),
        categoriaService.listar(formData.tipo === 'transferencia' ? '' : formData.tipo),
      ]);
      setContas(contasData.filter(c => c.ativa)); // Apenas contas ativas
      // A API agora retorna { estatisticas, cartoes }
      const cartoesAtivos = (cartoesResponse.cartoes || cartoesResponse).filter(c => c.ativo);
      setCartoes(cartoesAtivos);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dados = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        data_competencia: formData.data_competencia,
        observacao: formData.observacao || undefined,
        pago: formData.pago,
        recorrente: formData.recorrente,
        parcelado: formData.parcelado,
        categoria_id: parseInt(formData.categoria_id) || undefined,
      };

      // Adiciona conta_id ou cartao_id conforme forma de pagamento
      if (formData.forma_pagamento === 'conta' && formData.conta_id) {
        dados.conta_id = parseInt(formData.conta_id);
      } else if (formData.forma_pagamento === 'cartao' && formData.cartao_id) {
        dados.cartao_id = parseInt(formData.cartao_id);
      }

      // Campos de parcelamento
      if (formData.parcelado) {
        dados.numero_parcela = parseInt(formData.numero_parcela);
        dados.total_parcelas = parseInt(formData.total_parcelas);
      }

      await movimentoService.criar(dados);
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar movimento:', error);
      setError(error.response?.data?.message || 'Erro ao criar movimento. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      tipo: 'despesa',
      data_competencia: new Date().toISOString().split('T')[0],
      observacao: '',
      pago: true,
      recorrente: false,
      parcelado: false,
      numero_parcela: 1,
      total_parcelas: 1,
      conta_id: '',
      cartao_id: '',
      categoria_id: '',
      forma_pagamento: 'conta',
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                Novo Movimento
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                Adicione uma receita, despesa ou transferência
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary rounded-lg transition"
              disabled={loading}
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Descrição *
              </label>
              <input
                type="text"
                required
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Supermercado, Salário, etc."
                disabled={loading}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tipo *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => {
                  setFormData({ ...formData, tipo: e.target.value, categoria_id: '' });
                  // Recarregar categorias ao mudar o tipo
                }}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="despesa">📉 Despesa</option>
                <option value="receita">📈 Receita</option>
                <option value="transferencia">🔄 Transferência</option>
              </select>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Valor *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">
                  R$
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0,00"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Data */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Data *
              </label>
              <input
                type="date"
                required
                value={formData.data_competencia}
                onChange={(e) => setFormData({ ...formData, data_competencia: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Forma de Pagamento */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Forma de Pagamento *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="forma_pagamento"
                    value="conta"
                    checked={formData.forma_pagamento === 'conta'}
                    onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value, cartao_id: '' })}
                    className="text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">
                    💰 Conta Bancária
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="forma_pagamento"
                    value="cartao"
                    checked={formData.forma_pagamento === 'cartao'}
                    onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value, conta_id: '' })}
                    className="text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">
                    💳 Cartão de Crédito
                  </span>
                </label>
              </div>
            </div>

            {/* Conta ou Cartão */}
            {formData.forma_pagamento === 'conta' ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Conta Bancária
                </label>
                <select
                  value={formData.conta_id}
                  onChange={(e) => setFormData({ ...formData, conta_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading || loadingData}
                >
                  <option value="">Selecione uma conta</option>
                  {contas.map((conta) => (
                    <option key={conta.id} value={conta.id}>
                      {conta.nome} - {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(conta.saldo_atual || 0)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Cartão de Crédito
                </label>
                <select
                  value={formData.cartao_id}
                  onChange={(e) => setFormData({ ...formData, cartao_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading || loadingData}
                >
                  <option value="">Selecione um cartão</option>
                  {cartoes.map((cartao) => (
                    <option key={cartao.id} value={cartao.id}>
                      💳 {cartao.nome} - {cartao.bandeira} •••• {cartao.ultimos_digitos} (Limite: {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(cartao.limite || 0)})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  Para cartões, a fatura será criada/atualizada automaticamente
                </p>
              </div>
            )}

            {/* Categoria */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading || loadingData}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {getIconeEmoji(categoria.icone)} {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Observação */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Informações adicionais sobre este movimento..."
                disabled={loading}
              />
            </div>

            {/* Checkboxes */}
            <div className="md:col-span-2 space-y-3 p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.pago}
                  onChange={(e) => setFormData({ ...formData, pago: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                    ✓ Marcar como pago
                  </span>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    O movimento já foi efetivado
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.recorrente}
                  onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                    🔄 Movimento recorrente
                  </span>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Se repete mensalmente
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.parcelado}
                  onChange={(e) => setFormData({ ...formData, parcelado: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                    📅 Movimento parcelado
                  </span>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Dividido em várias parcelas
                  </p>
                </div>
              </label>
            </div>

            {/* Campos de Parcelamento */}
            {formData.parcelado && (
              <>
                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    Número da Parcela *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.numero_parcela}
                    onChange={(e) => setFormData({ ...formData, numero_parcela: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                    Total de Parcelas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.total_parcelas}
                    onChange={(e) => setFormData({ ...formData, total_parcelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Criando...
                </span>
              ) : (
                '✓ Criar Movimento'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

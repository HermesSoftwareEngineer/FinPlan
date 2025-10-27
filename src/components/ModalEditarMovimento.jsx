import { useState, useEffect } from 'react';
import movimentoService from '../services/movimentoService';
import categoriaService from '../services/categoriaService';
import contaService from '../services/contaService';
import { cartaoService } from '../services';

export default function ModalEditarMovimento({ isOpen, movimento, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'despesa',
    data_competencia: '',
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
    impactar: 'atual', // novo campo para recorrentes
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
    if (isOpen && movimento) {
      carregarDados();
    }
  }, [isOpen, movimento, formData.tipo]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const tipoCategoria = formData.tipo === 'transferencia' ? '' : formData.tipo;
      const [contasData, cartoesResponse, categoriasData] = await Promise.all([
        contaService.listar(),
        cartaoService.listarCartoes(),
        categoriaService.listar(tipoCategoria),
      ]);
      setContas(contasData.filter(c => c.ativa)); // Apenas contas ativas
      // A API agora retorna { estatisticas, cartoes }
      const cartoesAtivos = (cartoesResponse.cartoes || cartoesResponse).filter(c => c.ativo);
      setCartoes(cartoesAtivos);
      setCategorias(categoriasData);
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (movimento) {
      // Determina a forma de pagamento baseado em qual campo está preenchido
      const formaPagamento = movimento.cartao_id ? 'cartao' : 'conta';
      
      setFormData({
        descricao: movimento.descricao || '',
        valor: movimento.valor || '',
        tipo: movimento.tipo || 'despesa',
        data_competencia: movimento.data_competencia || '',
        observacao: movimento.observacao || '',
        pago: movimento.pago !== undefined ? movimento.pago : true,
        recorrente: movimento.recorrente || false,
        parcelado: movimento.parcelado || false,
        numero_parcela: movimento.numero_parcela || 1,
        total_parcelas: movimento.total_parcelas || 1,
        conta_id: movimento.conta_id || '',
        cartao_id: movimento.cartao_id || '',
        categoria_id: movimento.categoria_id || '',
        forma_pagamento: formaPagamento,
        impactar: 'atual', // default ao abrir
      });
    }
  }, [movimento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação básica
      if (!formData.descricao || !formData.valor || !formData.data_competencia) {
        setError('Preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      // Monta payload
      const payload = {
        ...formData,
        valor: parseFloat(formData.valor),
        numero_parcela: formData.parcelado ? parseInt(formData.numero_parcela) : 1,
        total_parcelas: formData.parcelado ? parseInt(formData.total_parcelas) : 1,
      };

      // Chama serviço de atualização, passando o campo impactar
      await movimentoService.atualizar(movimento.id, payload);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar movimento:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar movimento. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este movimento? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Envia o campo impactar para deletar recorrentes
      await movimentoService.deletar(movimento.id, formData.impactar);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar movimento:', error);
      setError(error.response?.data?.message || 'Erro ao excluir movimento.');
      setLoading(false);
    }
  };

  const handleTogglePago = async () => {
    setLoading(true);
    setError('');

    try {
      await movimentoService.togglePago(movimento.id);
      onSuccess();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setError(error.response?.data?.message || 'Erro ao alterar status de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor, tipo) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);

    return tipo === 'despesa' ? `-${formatted}` : formatted;
  };

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'receita':
        return '📈';
      case 'despesa':
        return '📉';
      case 'transferencia':
        return '🔄';
      default:
        return '💰';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'receita':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'despesa':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'transferencia':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (!isOpen || !movimento) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header com Info do Movimento */}
        <div className="sticky top-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-b border-light-border dark:border-dark-border p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoColor(movimento.tipo)}`}>
                  {getTipoIcon(movimento.tipo)} {movimento.tipo}
                </span>
                <button
                  onClick={handleTogglePago}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    movimento.pago
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                  }`}
                >
                  {movimento.pago ? '✓ Pago' : '⏱ Pendente'}
                </button>
              </div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
                {movimento.descricao}
              </h2>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatarValor(movimento.valor, movimento.tipo)}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                📅 {formatarData(movimento.data_competencia || movimento.data)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition"
              disabled={loading}
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          {movimento.parcelado && (
            <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
              <span>📅</span>
              <span>Parcela {movimento.numero_parcela} de {movimento.total_parcelas}</span>
            </div>
          )}
        </div>

        {/* Form de Edição */}
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
                <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                  ✓ Marcar como pago
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.recorrente}
                  onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                  🔄 Movimento recorrente
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.parcelado}
                  onChange={(e) => setFormData({ ...formData, parcelado: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                  📅 Movimento parcelado
                </span>
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

            {/* Campo Impactar para recorrentes */}
            {formData.recorrente && (
              <div className="md:col-span-2 pt-2">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                  Impactar:
                </label>
                <select
                  value={formData.impactar}
                  onChange={e => setFormData({ ...formData, impactar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="atual">Apenas este movimento</option>
                  <option value="futuros">Este e futuros</option>
                  <option value="todos">Todos (anteriores e futuros)</option>
                </select>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                  Escolha se deseja atualizar só este, os futuros ou todos os movimentos recorrentes.
                </p>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3 pt-6 border-t border-light-border dark:border-dark-border">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
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
                    Salvando...
                  </span>
                ) : (
                  '✓ Salvar Alterações'
                )}
              </button>
            </div>

            {/* Botão Deletar */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              🗑️ Excluir Movimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

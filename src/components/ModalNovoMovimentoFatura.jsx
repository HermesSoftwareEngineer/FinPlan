import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import movimentoService from '../services/movimentoService';
import categoriaService from '../services/categoriaService';
import { faturaService } from '../services';
import SeletorFaturas from './SeletorFaturas';

export default function ModalNovoMovimentoFatura({ isOpen, cartao, fatura, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_competencia: new Date().toISOString().split('T')[0],
    observacao: '',
    categoria_id: '',
    fatura_id: '',
    parcelado: false,
    numero_parcelas: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Carregar categorias e faturas ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      carregarDados();
      resetForm();
    }
  }, [isOpen]);

  const carregarDados = async () => {
    try {
      setLoadingData(true);
      const categoriasData = await categoriaService.listar('despesa');
      setCategorias(categoriasData);
      
      // Se a fatura foi passada como prop (vindo de DetalhesFatura), usar ela
      if (fatura && fatura.id) {
        setFormData(prev => ({ ...prev, fatura_id: fatura.id }));
      } else if (cartao) {
        // Caso contrário, buscar a fatura do mês atual para selecionar automaticamente
        const faturasData = await faturaService.listarFaturas({ cartao_id: cartao.id });
        const faturasArray = Array.isArray(faturasData) ? faturasData : [];
        
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth() + 1;
        const anoAtual = dataAtual.getFullYear();
        
        // Selecionar automaticamente a fatura do mês atual se existir
        const faturaAtual = faturasArray.find(
          f => f.mes_referencia === mesAtual && f.ano_referencia === anoAtual
        );
        
        if (faturaAtual) {
          setFormData(prev => ({ ...prev, fatura_id: faturaAtual.id }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      data_competencia: new Date().toISOString().split('T')[0],
      observacao: '',
      categoria_id: '',
      fatura_id: '',
      parcelado: false,
      numero_parcelas: 1,
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cartao) {
      setError('Cartão não informado.');
      return;
    }

    if (!formData.fatura_id) {
      setError('Selecione uma fatura para vincular este movimento.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar dados do movimento para a API de faturas
      const dados = {
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data_competencia: formData.data_competencia,
        observacao: formData.observacao || undefined,
        categoria_id: parseInt(formData.categoria_id) || undefined,
        parcelado: formData.parcelado,
      };

      // Adicionar informações de parcelamento se aplicável
      if (formData.parcelado && formData.numero_parcelas > 1) {
        dados.total_parcelas = parseInt(formData.numero_parcelas);
        // A API cria automaticamente as parcelas subsequentes
      }

      // Usar o novo endpoint específico de faturas
      await faturaService.incluirMovimentoFatura(parseInt(formData.fatura_id), dados);
      
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao criar movimento:', error);
      setError(error.response?.data?.error || error.response?.data?.message || 'Erro ao criar movimento.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !cartao) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 border-b border-gray-200 dark:border-slate-700 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                  💳 Nova Compra no Cartão
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Adicionar Movimento
              </h2>
              <p className="text-sm text-white/80">
                {cartao.nome} - {cartao.bandeira} •••• {cartao.ultimos_digitos}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              disabled={loading}
            >
              <X size={24} className="text-white" />
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

          {/* Aviso sobre movimento de cartão */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              ℹ️ Este movimento será vinculado ao cartão de crédito e incluído na fatura selecionada.
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400">
              <strong>Efeitos automáticos:</strong> O valor será adicionado ao total da fatura e ao limite utilizado do cartão.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Fatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Fatura *
              </label>
              {cartao && cartao.id ? (
                <SeletorFaturas
                  cartaoId={cartao.id}
                  faturaIdAtual={formData.fatura_id}
                  value={formData.fatura_id}
                  onChange={(e) => {
                    // Criar evento sintético com o name correto
                    const syntheticEvent = {
                      target: {
                        name: 'fatura_id',
                        value: e.target.value
                      }
                    };
                    handleChange(syntheticEvent);
                  }}
                  disabled={loading || loadingData}
                  required={true}
                />
              ) : (
                <div className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                  {loadingData ? 'Carregando...' : 'Cartão não informado'}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                Selecione em qual fatura este movimento deve ser incluído
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                name="descricao"
                required
                value={formData.descricao}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                placeholder="Ex: Restaurante, Supermercado, Shopping..."
              />
            </div>

            {/* Valor e Data */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Valor *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    name="valor"
                    required
                    step="0.01"
                    min="0.01"
                    value={formData.valor}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Data da Compra *
                </label>
                <input
                  type="date"
                  name="data_competencia"
                  required
                  value={formData.data_competencia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Categoria
              </label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Observação
              </label>
              <textarea
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
                placeholder="Adicione detalhes sobre esta compra..."
              />
            </div>

            {/* Parcelamento */}
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="parcelado"
                  checked={formData.parcelado}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                  📅 Compra parcelada
                </span>
              </label>

              {formData.parcelado && (
                <div className="pt-3 border-t border-gray-200 dark:border-slate-600">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Número de Parcelas *
                  </label>
                  <input
                    type="number"
                    name="numero_parcelas"
                    min="2"
                    max="48"
                    required
                    value={formData.numero_parcelas}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                    {formData.numero_parcelas > 1 && formData.valor > 0 && (
                      <>Valor por parcela: R$ {(parseFloat(formData.valor) / parseInt(formData.numero_parcelas)).toFixed(2)}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Criando...
                </span>
              ) : (
                '✓ Adicionar Compra'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cartaoService } from '../services';

export default function ModalNovaFatura({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    mes_referencia: new Date().getMonth() + 1,
    ano_referencia: new Date().getFullYear(),
    data_fechamento: '',
    data_vencimento: '',
    cartao_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartoes, setCartoes] = useState([]);
  const [loadingCartoes, setLoadingCartoes] = useState(true);

  useEffect(() => {
    if (isOpen) {
      carregarCartoes();
    }
  }, [isOpen]);

  const carregarCartoes = async () => {
    try {
      setLoadingCartoes(true);
      const data = await cartaoService.listarCartoes();
      const cartoesArray = data.cartoes || data;
      setCartoes(Array.isArray(cartoesArray) ? cartoesArray.filter(c => c.ativo) : []);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      setError('Erro ao carregar cartões');
    } finally {
      setLoadingCartoes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dados = {
        mes_referencia: parseInt(formData.mes_referencia),
        ano_referencia: parseInt(formData.ano_referencia),
        data_fechamento: formData.data_fechamento,
        data_vencimento: formData.data_vencimento,
        cartao_id: parseInt(formData.cartao_id)
      };

      await onSuccess(dados);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      setError(error.response?.data?.message || 'Erro ao criar fatura. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mes_referencia: new Date().getMonth() + 1,
      ano_referencia: new Date().getFullYear(),
      data_fechamento: '',
      data_vencimento: '',
      cartao_id: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Nova Fatura
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Cartão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Cartão de Crédito *
            </label>
            <select
              required
              value={formData.cartao_id}
              onChange={(e) => setFormData({ ...formData, cartao_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading || loadingCartoes}
            >
              <option value="">Selecione um cartão</option>
              {cartoes.map((cartao) => (
                <option key={cartao.id} value={cartao.id}>
                  💳 {cartao.nome} - {cartao.bandeira} •••• {cartao.ultimos_digitos}
                </option>
              ))}
            </select>
          </div>

          {/* Mês e Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Mês de Referência *
              </label>
              <select
                required
                value={formData.mes_referencia}
                onChange={(e) => setFormData({ ...formData, mes_referencia: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              >
                {meses.map((mes) => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Ano de Referência *
              </label>
              <input
                type="number"
                required
                min="2020"
                max="2100"
                value={formData.ano_referencia}
                onChange={(e) => setFormData({ ...formData, ano_referencia: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Data de Fechamento *
              </label>
              <input
                type="date"
                required
                value={formData.data_fechamento}
                onChange={(e) => setFormData({ ...formData, data_fechamento: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                required
                value={formData.data_vencimento}
                onChange={(e) => setFormData({ ...formData, data_vencimento: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors disabled:opacity-50"
              disabled={loading || loadingCartoes}
            >
              {loading ? 'Criando...' : 'Criar Fatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

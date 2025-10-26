import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalPagarFatura({ isOpen, onClose, fatura, onSuccess }) {
  const [valorPago, setValorPago] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && fatura) {
      setValorPago(fatura.valor_total?.toString() || '');
    }
  }, [isOpen, fatura]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSuccess(fatura.id, parseFloat(valorPago));
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
      setError(error.response?.data?.message || 'Erro ao processar pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setValorPago('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !fatura) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Pagar Fatura
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

          {/* Informações da Fatura */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Cartão:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {fatura.cartao?.nome || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Referência:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {fatura.mes_referencia}/{fatura.ano_referencia}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-400">Vencimento:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(fatura.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-600">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Valor Total:</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                R$ {(fatura.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Valor Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Valor Pago *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">
                R$
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Você pode pagar um valor diferente do total
            </p>
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
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

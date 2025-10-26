import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import contaService from '../services/contaService';
import faturaService from '../services/faturaService';

export default function ModalPagarFaturaTransferencia({ isOpen, onClose, fatura, cartao, onSuccess }) {
  const [formData, setFormData] = useState({
    valor_pago: '',
    data_pagamento: new Date().toISOString().split('T')[0],
    conta_id: '',
    categoria_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contas, setContas] = useState([]);
  const [loadingContas, setLoadingContas] = useState(true);

  useEffect(() => {
    if (isOpen && fatura) {
      carregarDadosPagamento();
      carregarContas();
    }
  }, [isOpen, fatura, cartao]);

  const carregarDadosPagamento = async () => {
    try {
      // Definir dados padrão para o pagamento
      const valorRestante = faturaService.calcularValorRestante(fatura);
      
      setFormData({
        valor_pago: valorRestante > 0 ? valorRestante.toString() : fatura.valor_total?.toString() || '',
        data_pagamento: fatura.data_vencimento || new Date().toISOString().split('T')[0],
        conta_id: fatura.conta_id?.toString() || '', // Usa a conta padrão da fatura se existir
        categoria_id: ''
      });
    } catch (error) {
      console.error('Erro ao carregar dados do pagamento:', error);
      // Em caso de erro, usar dados padrão
      setFormData({
        valor_pago: fatura.valor_total?.toString() || '',
        data_pagamento: fatura.data_vencimento || new Date().toISOString().split('T')[0],
        conta_id: fatura.conta_id?.toString() || '',
        categoria_id: ''
      });
    }
  };

  const carregarContas = async () => {
    try {
      setLoadingContas(true);
      const data = await contaService.listar();
      setContas(Array.isArray(data) ? data.filter(c => c.ativa) : []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      setError('Erro ao carregar contas bancárias');
    } finally {
      setLoadingContas(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Preparar dados do pagamento
      const dadosPagamento = {
        valor_pago: parseFloat(formData.valor_pago),
        data_pagamento: formData.data_pagamento,
        conta_id: parseInt(formData.conta_id)
      };

      // Adicionar categoria se informada
      if (formData.categoria_id) {
        dadosPagamento.categoria_id = parseInt(formData.categoria_id);
      }

      // Chamar serviço de pagamento de fatura
      const resultado = await faturaService.pagarFatura(fatura.id, dadosPagamento);
      
      // Chamar callback de sucesso
      if (onSuccess) {
        await onSuccess(resultado);
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setError(error.response?.data?.error || error.response?.data?.message || error.message || 'Erro ao registrar pagamento. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      valor_pago: '',
      data_pagamento: new Date().toISOString().split('T')[0],
      conta_id: '',
      categoria_id: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !fatura) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Pagar Fatura
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Registre o pagamento da fatura via transferência bancária
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Informações da Fatura */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Detalhes da Fatura
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-400">Cartão:</span>
                <p className="font-medium text-blue-900 dark:text-blue-200">{cartao?.nome}</p>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-400">Período:</span>
                <p className="font-medium text-blue-900 dark:text-blue-200">
                  {String(fatura.mes_referencia).padStart(2, '0')}/{fatura.ano_referencia}
                </p>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-400">Vencimento:</span>
                <p className="font-medium text-blue-900 dark:text-blue-200">
                  {new Date(fatura.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-400">Valor Total:</span>
                <p className="font-bold text-lg text-blue-900 dark:text-blue-200">
                  R$ {(fatura.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {fatura.valor_pago > 0 && (
                <>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Valor Pago:</span>
                    <p className="font-medium text-blue-900 dark:text-blue-200">
                      R$ {(fatura.valor_pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700 dark:text-blue-400">Valor Restante:</span>
                    <p className="font-bold text-lg text-orange-600 dark:text-orange-400">
                      R$ {faturaService.calcularValorRestante(fatura).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Valor a Pagar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Valor a Pagar *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400">
                R$
              </span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.valor_pago}
                onChange={(e) => setFormData({ ...formData, valor_pago: e.target.value })}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Você pode fazer pagamentos parciais. O valor restante ficará em aberto.
            </p>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Conta Bancária *
            </label>
            <select
              required
              value={formData.conta_id}
              onChange={(e) => setFormData({ ...formData, conta_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading || loadingContas}
            >
              <option value="">
                {fatura.conta_id ? 'Selecione outra conta ou use a padrão' : 'Selecione a conta de origem'}
              </option>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  💰 {conta.nome} - Saldo: R$ {(conta.saldo_atual || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {fatura.conta_id 
                ? 'Deixe em branco para usar a conta padrão da fatura ou selecione outra' 
                : 'O valor será debitado desta conta'}
            </p>
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Data do Pagamento *
            </label>
            <input
              type="date"
              required
              value={formData.data_pagamento}
              onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Aviso */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              ⚠️ <strong>Atenção:</strong> Ao confirmar, o pagamento será registrado e o saldo da conta será atualizado automaticamente. {fatura.valor_pago > 0 && 'Este é um pagamento adicional à fatura.'}
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
              disabled={loading || loadingContas || (!formData.conta_id && !fatura.conta_id)}
            >
              {loading ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

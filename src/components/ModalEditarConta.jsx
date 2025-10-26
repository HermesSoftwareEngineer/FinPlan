import { useState, useEffect } from 'react';
import contaService from '../services/contaService';

const TIPOS_CONTA = [
  { value: 'corrente', label: '🏦 Conta Corrente', icon: '🏦' },
  { value: 'poupanca', label: '🐷 Poupança', icon: '🐷' },
  { value: 'investimento', label: '📈 Investimento', icon: '📈' },
  { value: 'dinheiro', label: '💵 Dinheiro', icon: '💵' },
];

const CORES_DISPONIVEIS = [
  '#4CAF50', '#2196F3', '#9C27B0', '#FF9800',
  '#F44336', '#00BCD4', '#673AB7', '#FFC107',
  '#009688', '#E91E63', '#3F51B5', '#8BC34A',
];

export default function ModalEditarConta({ isOpen, conta, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'corrente',
    cor: '#4CAF50',
    ativa: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (conta) {
      setFormData({
        nome: conta.nome || '',
        tipo: conta.tipo || 'corrente',
        cor: conta.cor || '#4CAF50',
        ativa: conta.ativa !== undefined ? conta.ativa : true,
      });
    }
  }, [conta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contaService.atualizar(conta.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await contaService.deletar(conta.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      setError(error.response?.data?.message || 'Erro ao excluir conta.');
      setLoading(false);
    }
  };

  const getTipoInfo = (tipo) => TIPOS_CONTA.find(t => t.value === tipo) || TIPOS_CONTA[0];

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  if (!isOpen || !conta) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header com Preview */}
        <div
          className="sticky top-0 p-6 z-10 border-b border-light-border dark:border-dark-border"
          style={{ backgroundColor: `${conta.cor}15` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: conta.cor }}
              >
                {getTipoInfo(conta.tipo).icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {conta.nome}
                </h2>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {getTipoInfo(conta.tipo).label}
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                  {formatarValor(conta.saldo_atual)}
                </p>
                {!conta.ativa && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                    Inativa
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition"
              disabled={loading}
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Preview Atualizado */}
          <div className="p-6 rounded-lg transition-all" style={{ backgroundColor: `${formData.cor}15` }}>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{ backgroundColor: formData.cor }}
              >
                {getTipoInfo(formData.tipo).icon}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {formData.nome || 'Nome da Conta'}
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {getTipoInfo(formData.tipo).label}
                </p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text mt-1">
                  {formatarValor(conta.saldo_atual)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Nome da Conta *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tipo de Conta *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TIPOS_CONTA.map((tipo) => (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: tipo.value })}
                    disabled={loading}
                    className={`p-3 rounded-lg border-2 transition font-medium text-left ${
                      formData.tipo === tipo.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'border-light-border dark:border-dark-border hover:border-primary-300 text-light-text dark:text-dark-text'
                    }`}
                  >
                    {tipo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Cor *
              </label>
              <div className="grid grid-cols-6 gap-2">
                {CORES_DISPONIVEIS.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor })}
                    disabled={loading}
                    className={`w-full h-12 rounded-lg transition ${
                      formData.cor === cor
                        ? 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-dark-bg-secondary scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: cor }}
                    title={cor}
                  />
                ))}
              </div>
            </div>

            {/* Conta Ativa */}
            <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.ativa}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  disabled={loading}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
                    ✓ Conta Ativa
                  </span>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Contas ativas aparecem no saldo total
                  </p>
                </div>
              </label>
            </div>
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
              🗑️ Excluir Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

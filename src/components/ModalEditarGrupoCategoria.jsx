import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import grupoCategoriaService from '../services/grupoCategoriaService';

const CORES_DISPONIVEIS = [
  '#FF5722', '#F44336', '#E91E63', '#9C27B0',
  '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
  '#00BCD4', '#009688', '#4CAF50', '#8BC34A',
  '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF6F00', '#795548', '#607D8B', '#9E9E9E',
];

export default function ModalEditarGrupoCategoria({ isOpen, grupo, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#2196F3',
    icone: 'folder'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const icones = {
    folder: '📁',
    repeat: '🔄',
    trending_up: '📈',
    trending_down: '📉',
    attach_money: '💰',
    savings: '💵',
    work: '💼',
    home: '🏠',
    shopping_cart: '🛒',
    favorite: '❤️',
    star: '⭐',
    bolt: '⚡',
    eco: '🌱',
    school: '📚',
    fitness_center: '💪',
    flight: '✈️',
  };

  useEffect(() => {
    if (grupo) {
      setFormData({
        nome: grupo.nome || '',
        descricao: grupo.descricao || '',
        cor: grupo.cor || '#2196F3',
        icone: grupo.icone || 'folder'
      });
    }
  }, [grupo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await grupoCategoriaService.atualizar(grupo.id, formData);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      setError(error.response?.data?.message || 'Erro ao atualizar grupo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !grupo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Grupo de Categorias
            </h2>
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

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Nome *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Despesas Fixas"
              disabled={loading}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Descrição
            </label>
            <textarea
              rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descrição do grupo de categorias..."
              disabled={loading}
            />
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Ícone *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {Object.entries(icones).map(([key, emoji]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, icone: key })}
                  className={`p-3 rounded-lg border-2 text-2xl transition-all ${
                    formData.icone === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  disabled={loading}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Cor *
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 mb-3">
              {CORES_DISPONIVEIS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => setFormData({ ...formData, cor })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.cor === cor
                      ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: cor }}
                  disabled={loading}
                  title={cor}
                />
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                className="w-20 h-10 rounded cursor-pointer"
                disabled={loading}
              />
              <input
                type="text"
                value={formData.cor}
                onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#2196F3"
                disabled={loading}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Preview:</p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: formData.cor }}
            >
              <span className="text-xl">{icones[formData.icone]}</span>
              <span>{formData.nome || 'Nome do Grupo'}</span>
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import categoriaService from '../services/categoriaService';
import grupoCategoriaService from '../services/grupoCategoriaService';

const ICONES_DISPONIVEIS = [
  { value: 'restaurant', label: '🍽️ Restaurante' },
  { value: 'shopping_cart', label: '🛒 Compras' },
  { value: 'home', label: '🏠 Casa' },
  { value: 'directions_car', label: '🚗 Transporte' },
  { value: 'favorite', label: '❤️ Saúde' },
  { value: 'school', label: '📚 Educação' },
  { value: 'sports_esports', label: '🎮 Lazer' },
  { value: 'work', label: '💼 Trabalho' },
  { value: 'attach_money', label: '💰 Salário' },
  { value: 'savings', label: '💵 Investimento' },
  { value: 'credit_card', label: '💳 Cartão' },
  { value: 'local_grocery_store', label: '🏪 Mercado' },
  { value: 'fitness_center', label: '💪 Academia' },
  { value: 'phone', label: '📱 Telefone' },
  { value: 'lightbulb', label: '💡 Contas' },
  { value: 'pets', label: '🐾 Pet' },
  { value: 'flight', label: '✈️ Viagem' },
  { value: 'celebration', label: '🎉 Festa' },
  { value: 'checkroom', label: '👔 Vestuário' },
  { value: 'local_pharmacy', label: '💊 Farmácia' },
];

const CORES_DISPONIVEIS = [
  '#FF5722', '#F44336', '#E91E63', '#9C27B0',
  '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
  '#00BCD4', '#009688', '#4CAF50', '#8BC34A',
  '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF6F00', '#795548', '#607D8B', '#9E9E9E',
];

export default function ModalNovaCategoria({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'despesa',
    cor: '#FF5722',
    icone: 'restaurant',
    grupo_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    if (isOpen) {
      carregarGrupos();
    }
  }, [isOpen]);

  const carregarGrupos = async () => {
    try {
      const data = await grupoCategoriaService.listar();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      setGrupos([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dados = { ...formData };
      // Converte grupo_id para número ou remove se vazio
      if (dados.grupo_id) {
        dados.grupo_id = parseInt(dados.grupo_id);
      } else {
        delete dados.grupo_id;
      }
      
      await categoriaService.criar(dados);
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      setError(error.response?.data?.message || 'Erro ao criar categoria. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'despesa',
      cor: '#FF5722',
      icone: 'restaurant',
      grupo_id: '',
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
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                Nova Categoria
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                Organize seus movimentos em categorias
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Preview da Categoria */}
          <div className="flex items-center justify-center p-6 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg"
                style={{ backgroundColor: formData.cor }}
              >
                {ICONES_DISPONIVEIS.find(i => i.value === formData.icone)?.label.split(' ')[0] || '📂'}
              </div>
              <p className="text-lg font-semibold text-light-text dark:text-dark-text">
                {formData.nome || 'Nome da Categoria'}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary capitalize">
                {formData.tipo}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Alimentação, Transporte..."
                disabled={loading}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tipo *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'despesa' })}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition font-medium ${
                    formData.tipo === 'despesa'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'border-light-border dark:border-dark-border hover:border-red-300 text-light-text dark:text-dark-text'
                  }`}
                >
                  📉 Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'receita' })}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition font-medium ${
                    formData.tipo === 'receita'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'border-light-border dark:border-dark-border hover:border-green-300 text-light-text dark:text-dark-text'
                  }`}
                >
                  📈 Receita
                </button>
              </div>
            </div>

            {/* Grupo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Grupo
              </label>
              <select
                value={formData.grupo_id}
                onChange={(e) => setFormData({ ...formData, grupo_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Sem grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Ícone */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Ícone *
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border border-light-border dark:border-dark-border rounded-lg">
                {ICONES_DISPONIVEIS.map((icone) => (
                  <button
                    key={icone.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, icone: icone.value })}
                    disabled={loading}
                    className={`p-3 rounded-lg text-2xl transition ${
                      formData.icone === icone.value
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                        : 'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                    }`}
                    title={icone.label}
                  >
                    {icone.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Cor *
              </label>
              <div className="grid grid-cols-10 gap-2">
                {CORES_DISPONIVEIS.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor })}
                    disabled={loading}
                    className={`w-10 h-10 rounded-lg transition ${
                      formData.cor === cor
                        ? 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-dark-bg-secondary scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: cor }}
                    title={cor}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                  placeholder="#FF5722"
                  disabled={loading}
                />
              </div>
            </div>
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
                '✓ Criar Categoria'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

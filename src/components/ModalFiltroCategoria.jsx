import { useState, useEffect } from 'react';

export default function ModalFiltroCategoria({ isOpen, onClose, categorias, categoriasSelecionadas, onAplicar }) {
  const [selecionadas, setSelecionadas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelecionadas(categoriasSelecionadas || []);
    }
  }, [isOpen, categoriasSelecionadas]);

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

  const handleToggleCategoria = (categoriaId) => {
    if (selecionadas.includes(categoriaId)) {
      setSelecionadas(selecionadas.filter(id => id !== categoriaId));
    } else {
      setSelecionadas([...selecionadas, categoriaId]);
    }
  };

  const handleAplicar = () => {
    onAplicar(selecionadas);
    onClose();
  };

  const handleLimpar = () => {
    setSelecionadas([]);
  };

  const categoriasFiltradas = filtroTipo
    ? categorias.filter(c => c.tipo === filtroTipo)
    : categorias;

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-black/50 flex items-stretch justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Filtrar por Categorias
              </h2>
              <p className="text-sm text-white/90 mt-1">
                Selecione as categorias que deseja filtrar
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <span className="text-2xl text-white">✕</span>
            </button>
          </div>
        </div>

        {/* Filtro por Tipo */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroTipo('')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroTipo === ''
                  ? 'bg-primary-500 text-white'
                  : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroTipo('receita')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroTipo === 'receita'
                  ? 'bg-green-500 text-white'
                  : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
              }`}
            >
              📈 Receitas
            </button>
            <button
              onClick={() => setFiltroTipo('despesa')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroTipo === 'despesa'
                  ? 'bg-red-500 text-white'
                  : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
              }`}
            >
              📉 Despesas
            </button>
          </div>
        </div>

        {/* Lista de Categorias */}
        <div className="flex-1 overflow-y-auto p-6">
          {categoriasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
              <p>Nenhuma categoria encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoriasFiltradas.map((categoria) => (
                <label
                  key={categoria.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                    selecionadas.includes(categoria.id)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selecionadas.includes(categoria.id)}
                    onChange={() => handleToggleCategoria(categoria.id)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  />
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: categoria.cor }}
                  >
                    {getIconeEmoji(categoria.icone)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-light-text dark:text-dark-text truncate">
                      {categoria.nome}
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary capitalize">
                      {categoria.tipo}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg-tertiary">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {selecionadas.length} {selecionadas.length === 1 ? 'categoria selecionada' : 'categorias selecionadas'}
            </p>
            {selecionadas.length > 0 && (
              <button
                onClick={handleLimpar}
                className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
              >
                Limpar seleção
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleAplicar}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium shadow-lg"
            >
              Aplicar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

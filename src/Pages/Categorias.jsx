import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ModalNovaCategoria from '../components/ModalNovaCategoria';
import ModalEditarCategoria from '../components/ModalEditarCategoria';
import categoriaService from '../services/categoriaService';
import authService from '../services/authService';

export default function Categorias() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalNova, setShowModalNova] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');

  // Verificar autenticação
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Responsividade da sidebar
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carregar categorias
  useEffect(() => {
    carregarCategorias();
  }, [filtroTipo]);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.listar(filtroTipo);
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoria) => {
    setCategoriaSelecionada(categoria);
    setShowModalEditar(true);
  };

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

  const categoriasPorTipo = {
    despesa: categorias.filter(c => c.tipo === 'despesa'),
    receita: categorias.filter(c => c.tipo === 'receita'),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
              >
                <span className="text-2xl">☰</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  Categorias
                </h1>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Organize seus movimentos em categorias personalizadas
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Filtros e Ações */}
        <div className="p-6">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Filtro de Tipo */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltroTipo('')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtroTipo === ''
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  Todas ({categorias.length})
                </button>
                <button
                  onClick={() => setFiltroTipo('despesa')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtroTipo === 'despesa'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  📉 Despesas ({categoriasPorTipo.despesa.length})
                </button>
                <button
                  onClick={() => setFiltroTipo('receita')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filtroTipo === 'receita'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  📈 Receitas ({categoriasPorTipo.receita.length})
                </button>
              </div>

              {/* Botão Nova Categoria */}
              <button
                onClick={() => setShowModalNova(true)}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                + Nova Categoria
              </button>
            </div>
          </div>

          {/* Lista de Categorias */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : categorias.length === 0 ? (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-12 text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Crie categorias para organizar seus movimentos financeiros
              </p>
              <button
                onClick={() => setShowModalNova(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium"
              >
                Criar Primeira Categoria
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  onClick={() => handleEdit(categoria)}
                  className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6 hover:shadow-md transition cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: categoria.cor }}
                    >
                      {getIconeEmoji(categoria.icone)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-light-text dark:text-dark-text truncate mb-1">
                        {categoria.nome}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            categoria.tipo === 'despesa'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}
                        >
                          {categoria.tipo === 'despesa' ? '📉 Despesa' : '📈 Receita'}
                        </span>
                        {categoria.grupo && (
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium text-white"
                            style={{ backgroundColor: categoria.grupo.cor }}
                          >
                            📁 {categoria.grupo.nome}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white dark:border-dark-bg shadow-sm"
                          style={{ backgroundColor: categoria.cor }}
                        />
                        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-mono">
                          {categoria.cor}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-center text-primary-600 dark:text-primary-400 font-medium">
                      Clique para editar
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Estatísticas */}
          {!loading && categorias.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Total de Categorias
                    </p>
                    <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                      {categorias.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-2xl">
                    📉
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Categorias de Despesa
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {categoriasPorTipo.despesa.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                    📈
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Categorias de Receita
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {categoriasPorTipo.receita.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalNovaCategoria
        isOpen={showModalNova}
        onClose={() => setShowModalNova(false)}
        onSuccess={carregarCategorias}
      />

      <ModalEditarCategoria
        isOpen={showModalEditar}
        categoria={categoriaSelecionada}
        onClose={() => {
          setShowModalEditar(false);
          setCategoriaSelecionada(null);
        }}
        onSuccess={carregarCategorias}
      />
    </div>
  );
}

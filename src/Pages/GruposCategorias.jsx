import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ModalNovoGrupoCategoria from '../components/ModalNovoGrupoCategoria';
import ModalEditarGrupoCategoria from '../components/ModalEditarGrupoCategoria';
import grupoCategoriaService from '../services/grupoCategoriaService';
import authService from '../services/authService';

const GruposCategorias = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

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

  useEffect(() => {
    carregarGrupos();
  }, []);

  const carregarGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoCategoriaService.listar();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (grupo) => {
    setGrupoSelecionado(grupo);
    setModalEditarOpen(true);
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este grupo? As categorias associadas não serão deletadas.')) {
      return;
    }

    try {
      await grupoCategoriaService.deletar(id);
      await carregarGrupos();
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      alert('Erro ao deletar grupo. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Grupos de Categorias
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Organize suas categorias em grupos
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Botão Novo Grupo */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setModalNovoOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={20} />
              Novo Grupo
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Lista de Grupos */}
          {!loading && grupos.length === 0 && (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-12 text-center">
              <FolderOpen size={48} className="mx-auto text-gray-400 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum grupo cadastrado
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Crie grupos para organizar melhor suas categorias
              </p>
              <button
                onClick={() => setModalNovoOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <Plus size={20} />
                Criar Primeiro Grupo
              </button>
            </div>
          )}

          {!loading && grupos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grupos.map((grupo) => (
                <div
                  key={grupo.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: grupo.cor }}
                      >
                        <span className="text-2xl">{icones[grupo.icone] || '📁'}</span>
                        <span className="text-lg">{grupo.nome}</span>
                      </div>
                    </div>

                    {/* Descrição */}
                    {grupo.descricao && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                        {grupo.descricao}
                      </p>
                    )}

                    {/* Estatísticas */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {grupo.categorias?.length || 0} categoria{grupo.categorias?.length !== 1 ? 's' : ''} associada{grupo.categorias?.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(grupo)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(grupo.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modais */}
      <ModalNovoGrupoCategoria
        isOpen={modalNovoOpen}
        onClose={() => setModalNovoOpen(false)}
        onSuccess={carregarGrupos}
      />

      <ModalEditarGrupoCategoria
        isOpen={modalEditarOpen}
        grupo={grupoSelecionado}
        onClose={() => {
          setModalEditarOpen(false);
          setGrupoSelecionado(null);
        }}
        onSuccess={carregarGrupos}
      />
    </div>
  );
};

export default GruposCategorias;

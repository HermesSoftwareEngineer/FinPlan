import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import SidebarToggle from '../components/SidebarToggle';
import api from '../services/api';
import authService from '../services/authService';
import DRETable from '../components/DRETable';

export default function DRE() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dadosDRE, setDadosDRE] = useState(null);
  const [filtros, setFiltros] = useState({
    data_inicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    data_fim: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
    modo: 'competencia'
  });

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

  const buscarDados = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dre', {
        params: filtros
      });
      setDadosDRE(response.data);
      // grupos expandidos agora gerenciados em DRETable
    } catch (error) {
      console.error('Erro ao buscar dados DRE:', error);
      alert('Erro ao carregar dados do DRE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
              <SidebarToggle
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📊 DRE - Demonstrativo de Resultados
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Análise detalhada de receitas e despesas por período
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Filtros */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.data_inicio}
                  onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.data_fim}
                  onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Modo
                </label>
                <select
                  value={filtros.modo}
                  onChange={(e) => setFiltros({ ...filtros, modo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="competencia">Competência</option>
                  <option value="caixa">Caixa</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={buscarDados}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Carregando...' : 'Buscar'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Carregando dados...</div>
            </div>
          ) : dadosDRE && dadosDRE.meses && dadosDRE.meses.length > 0 ? (
            <div className="space-y-6">
              {/* Estatísticas */}
              {dadosDRE.estatisticas && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Receitas</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatarValor(dadosDRE.estatisticas.total_receitas)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Média: {formatarValor(dadosDRE.estatisticas.media_receitas_mensal)}/mês
                    </p>
                  </div>

                  <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Despesas</h3>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatarValor(dadosDRE.estatisticas.total_despesas)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Média: {formatarValor(dadosDRE.estatisticas.media_despesas_mensal)}/mês
                    </p>
                  </div>

                  <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Resultado Líquido</h3>
                    <p className={`text-2xl font-bold ${
                      dadosDRE.estatisticas.resultado_liquido >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatarValor(dadosDRE.estatisticas.resultado_liquido)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Média: {formatarValor(dadosDRE.estatisticas.media_resultado_mensal)}/mês
                    </p>
                  </div>

                  <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Movimentos</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {dadosDRE.estatisticas.total_movimentos}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {dadosDRE.estatisticas.quantidade_meses} meses
                    </p>
                  </div>
                </div>
              )}

              {/* Tabela DRE */}
              <DRETable dadosDRE={dadosDRE} formatarValor={formatarValor} />
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-12">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">Nenhum dado disponível para o período selecionado</p>
                <p className="text-sm mt-2">Selecione um período e clique em "Buscar"</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import dashboardService from '../services/dashboardService';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : false));
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodoFiltro, setPeriodoFiltro] = useState('current_month');
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildPeriodoParams = useCallback((periodo) => {
    const hoje = new Date();

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (periodo) {
      case 'last_3_months': {
        const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
        const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        return {
          data_inicio: formatDate(inicio),
          data_fim: formatDate(fim),
        };
      }
      case 'current_year': {
        const inicio = new Date(hoje.getFullYear(), 0, 1);
        return {
          data_inicio: formatDate(inicio),
          data_fim: formatDate(hoje),
        };
      }
      default:
        return {};
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const filtros = buildPeriodoParams(periodoFiltro);
        const data = await dashboardService.obter(filtros);

        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        if (isMounted) {
          setError('Não foi possível carregar os dados do dashboard.');
          setDashboardData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [periodoFiltro, reloadToken, buildPeriodoParams]);

  const handlePeriodoChange = (event) => {
    setPeriodoFiltro(event.target.value);
  };

  const handleRefresh = () => {
    setReloadToken((prev) => prev + 1);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '--';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatDateToBR = (date) => {
    if (!date) {
      return '--';
    }

    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const categoriasOrdenadas = useMemo(() => {
    if (!dashboardData?.gastos_por_categoria) {
      return [];
    }

    return [...dashboardData.gastos_por_categoria].sort((a, b) => (b.total || 0) - (a.total || 0));
  }, [dashboardData]);

  const topCategorias = useMemo(() => categoriasOrdenadas.slice(0, 4), [categoriasOrdenadas]);

  const maxCategoriaTotal = useMemo(() => {
    if (!categoriasOrdenadas.length) {
      return 0;
    }

    return categoriasOrdenadas.reduce((max, categoria) => {
      const total = categoria.total || 0;
      return total > max ? total : max;
    }, 0);
  }, [categoriasOrdenadas]);

  const economiaPercentual = useMemo(() => {
    if (!dashboardData || dashboardData.receitas_mes_atual === undefined || dashboardData.receitas_mes_atual === null) {
      return null;
    }

    if (dashboardData.receitas_mes_atual === 0) {
      return null;
    }

    return dashboardData.economia_mes_atual / dashboardData.receitas_mes_atual;
  }, [dashboardData]);

  const economiaValor = dashboardData?.economia_mes_atual ?? null;
  const economiaValorPositivo = (economiaValor ?? 0) >= 0;
  const periodoGrafico = dashboardData?.periodo_grafico;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
            {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarToggle
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                openLabel="Ocultar menu lateral"
                closedLabel="Mostrar menu lateral"
              />
              <div>
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  Dashboard
                </h2>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Visão geral das suas finanças
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary rounded-lg transition"
                aria-label="Atualizar dados do dashboard"
                title="Atualizar dados"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2" />
                </svg>
              </button>
              <button className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary rounded-lg transition relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-danger-800 dark:border-danger-900/40 dark:bg-danger-900/20 dark:text-danger-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">{error}</p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center rounded-md border border-danger-200 bg-white px-3 py-1.5 text-sm font-semibold text-danger-700 transition hover:bg-danger-100 dark:border-danger-700 dark:bg-transparent dark:text-danger-200 dark:hover:bg-danger-800/40"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Cards Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Card Saldo Total */}
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-90">Saldo Total</span>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold mb-1">
                {loading ? (
                  <span className="inline-block h-8 w-28 rounded bg-white/30 animate-pulse" />
                ) : (
                  formatCurrency(dashboardData?.saldo_total)
                )}
              </p>
              <p className="text-sm opacity-75">
                {loading ? (
                  <span className="inline-block h-4 w-24 rounded bg-white/20 animate-pulse" />
                ) : (
                  periodoGrafico ? `Período ${formatDateToBR(periodoGrafico.data_inicio)} - ${formatDateToBR(periodoGrafico.data_fim)}` : 'Sem período definido'
                )}
              </p>
            </div>

            {/* Card Receitas */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Receitas</span>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-3xl font-bold text-success-600 dark:text-success-400 mb-1">
                {loading ? (
                  <span className="inline-block h-8 w-24 rounded bg-success-100/60 dark:bg-success-900/30 animate-pulse" />
                ) : (
                  formatCurrency(dashboardData?.receitas_mes_atual)
                )}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {loading ? (
                  <span className="inline-block h-4 w-20 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                ) : 'Receitas pagas no período selecionado'}
              </p>
            </div>

            {/* Card Despesas */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Despesas</span>
                <span className="text-2xl">📉</span>
              </div>
              <p className="text-3xl font-bold text-danger-600 dark:text-danger-400 mb-1">
                {loading ? (
                  <span className="inline-block h-8 w-24 rounded bg-danger-100/50 dark:bg-danger-900/30 animate-pulse" />
                ) : (
                  formatCurrency(dashboardData?.despesas_mes_atual)
                )}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {loading ? (
                  <span className="inline-block h-4 w-20 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                ) : 'Despesas pagas no período selecionado'}
              </p>
            </div>

            {/* Card Economia */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">Economia</span>
                <span className="text-2xl">💎</span>
              </div>
              <p className={`text-3xl font-bold mb-1 ${economiaValorPositivo ? 'text-secondary-600 dark:text-secondary-400' : 'text-danger-600 dark:text-danger-400'}`}>
                {loading ? (
                  <span className="inline-block h-8 w-24 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                ) : (
                  formatCurrency(economiaValor)
                )}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {loading ? (
                  <span className="inline-block h-4 w-24 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                ) : economiaPercentual !== null ? `${formatPercent(economiaPercentual)} da receita` : 'Sem receitas registradas no período'}
              </p>
            </div>
          </div>

          {/* Gráficos e Informações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Gráfico de Gastos por Categoria */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                    Gastos por Categoria
                  </h3>
                  {periodoGrafico && !loading && (
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {`Período ${formatDateToBR(periodoGrafico.data_inicio)} - ${formatDateToBR(periodoGrafico.data_fim)}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <select
                    className="px-3 py-1 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-sm text-light-text dark:text-dark-text"
                    value={periodoFiltro}
                    onChange={handlePeriodoChange}
                  >
                    <option value="current_month">Este mês</option>
                    <option value="last_3_months">Últimos 3 meses</option>
                    <option value="current_year">Este ano</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="hidden sm:inline-flex items-center justify-center rounded-lg border border-light-border dark:border-dark-border px-3 py-1 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
                    title="Recarregar dados"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
              <div className="h-64 overflow-hidden rounded-lg border border-light-border/70 bg-light-bg-secondary dark:border-dark-border/70 dark:bg-dark-bg-tertiary">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
                      <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      <span className="text-sm">Carregando dados...</span>
                    </div>
                  </div>
                ) : categoriasOrdenadas.length ? (
                  <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
                    {categoriasOrdenadas.map((categoria, index) => {
                      const percent = maxCategoriaTotal ? Math.round(((categoria.total || 0) / maxCategoriaTotal) * 100) : 0;
                      const largura = Number.isFinite(percent) ? Math.min(percent, 100) : 0;
                      const categoriaKey = categoria.categoria_id ?? `${categoria.categoria_nome}-${index}`;

                      return (
                        <div key={categoriaKey} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl" aria-hidden="true">{categoria.categoria_icone || '🏷️'}</span>
                              <span className="text-sm font-medium text-light-text dark:text-dark-text">
                                {categoria.categoria_nome}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                              {formatCurrency(categoria.total)}
                            </span>
                          </div>
                          <div className="w-full rounded-full bg-white/60 dark:bg-dark-bg">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${largura}%`,
                                backgroundColor: categoria.categoria_cor || '#4f46e5',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-light-text-secondary dark:text-dark-text-secondary">
                    <span className="text-4xl">📊</span>
                    <p className="text-sm">Nenhum gasto encontrado para o período selecionado.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo de Categorias */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 border border-light-border dark:border-dark-border shadow-sm">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Top Categorias
              </h3>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-block h-4 w-24 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                        <span className="inline-block h-4 w-16 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary animate-pulse" />
                      </div>
                      <div className="w-full rounded-full bg-light-bg-secondary dark:bg-dark-bg-tertiary h-2">
                        <div className="h-2 rounded-full animate-pulse bg-primary-400/60" style={{ width: '70%' }} />
                      </div>
                    </div>
                  ))
                ) : topCategorias.length ? (
                  topCategorias.map((categoria, index) => {
                    const percent = maxCategoriaTotal ? Math.round(((categoria.total || 0) / maxCategoriaTotal) * 100) : 0;
                    const largura = Number.isFinite(percent) ? Math.min(percent, 100) : 0;
                    const categoriaKey = categoria.categoria_id ?? `${categoria.categoria_nome}-${index}`;

                    return (
                      <div key={categoriaKey} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-light-text dark:text-dark-text">
                            {categoria.categoria_icone || '🏷️'} {categoria.categoria_nome}
                          </span>
                          <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                            {formatCurrency(categoria.total)}
                          </span>
                        </div>
                        <div className="w-full bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${largura}%`,
                              backgroundColor: categoria.categoria_cor || '#6366f1',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Nenhuma categoria com despesas no período selecionado.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

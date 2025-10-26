import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';
import ModalNovaConta from '../components/ModalNovaConta';
import ModalEditarConta from '../components/ModalEditarConta';
import contaService from '../services/contaService';
import authService from '../services/authService';

const TIPOS_CONTA_INFO = {
  corrente: { icon: '🏦', label: 'Conta Corrente', color: 'blue' },
  poupanca: { icon: '🐷', label: 'Poupança', color: 'green' },
  investimento: { icon: '📈', label: 'Investimento', color: 'purple' },
  dinheiro: { icon: '💵', label: 'Dinheiro', color: 'yellow' },
};

export default function Contas() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalNova, setShowModalNova] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

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

  // Carregar contas
  useEffect(() => {
    carregarContas();
  }, []);

  const carregarContas = async () => {
    try {
      setLoading(true);
      const data = await contaService.listar();
      setContas(data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (conta) => {
    setContaSelecionada(conta);
    setShowModalEditar(true);
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  const calcularSaldoTotal = () => {
    return contas
      .filter(c => c.ativa)
      .reduce((total, conta) => total + (conta.saldo_atual || 0), 0);
  };

  const contasPorTipo = contas.reduce((acc, conta) => {
    if (!acc[conta.tipo]) acc[conta.tipo] = [];
    acc[conta.tipo].push(conta);
    return acc;
  }, {});

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
                  Contas
                </h1>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Gerencie suas contas bancárias e dinheiro
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6">
          {/* Saldo Total */}
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Saldo Total</p>
                <p className="text-4xl font-bold">{formatarValor(calcularSaldoTotal())}</p>
                <p className="text-xs opacity-75 mt-2">
                  {contas.filter(c => c.ativa).length} {contas.filter(c => c.ativa).length === 1 ? 'conta ativa' : 'contas ativas'}
                </p>
              </div>
              <button
                onClick={() => setShowModalNova(true)}
                className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-medium shadow-lg"
              >
                + Nova Conta
              </button>
            </div>
          </div>

          {/* Lista de Contas */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size={12} color="primary-500" />
            </div>
          ) : contas.length === 0 ? (
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-12 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                Nenhuma conta encontrada
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                Adicione suas contas bancárias para começar a controlar seu dinheiro
              </p>
              <button
                onClick={() => setShowModalNova(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium"
              >
                Criar Primeira Conta
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contas por Tipo */}
              {Object.entries(contasPorTipo).map(([tipo, contasTipo]) => (
                <div key={tipo}>
                  <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                    <span className="text-2xl">{TIPOS_CONTA_INFO[tipo]?.icon || '💰'}</span>
                    {TIPOS_CONTA_INFO[tipo]?.label || tipo}
                    <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary">
                      ({contasTipo.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contasTipo.map((conta) => (
                      <div
                        key={conta.id}
                        onClick={() => handleEdit(conta)}
                        className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6 hover:shadow-md transition cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                            style={{ backgroundColor: conta.cor }}
                          >
                            {TIPOS_CONTA_INFO[conta.tipo]?.icon || '💰'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-light-text dark:text-dark-text truncate">
                                {conta.nome}
                              </h3>
                              {!conta.ativa && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full whitespace-nowrap">
                                  Inativa
                                </span>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                              {formatarValor(conta.saldo_atual)}
                            </p>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white dark:border-dark-bg shadow-sm"
                                style={{ backgroundColor: conta.cor }}
                              />
                              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                {TIPOS_CONTA_INFO[conta.tipo]?.label}
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
                </div>
              ))}
            </div>
          )}

          {/* Estatísticas */}
          {!loading && contas.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl">
                    💰
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Total de Contas
                    </p>
                    <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                      {contas.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Contas Ativas
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {contas.filter(c => c.ativa).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-2xl">
                    ⏸
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Contas Inativas
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {contas.filter(c => !c.ativa).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Saldo Médio
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatarValor(contas.length > 0 ? calcularSaldoTotal() / contas.filter(c => c.ativa).length : 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalNovaConta
        isOpen={showModalNova}
        onClose={() => setShowModalNova(false)}
        onSuccess={carregarContas}
      />

      <ModalEditarConta
        isOpen={showModalEditar}
        conta={contaSelecionada}
        onClose={() => {
          setShowModalEditar(false);
          setContaSelecionada(null);
        }}
        onSuccess={carregarContas}
      />
    </div>
  );
}

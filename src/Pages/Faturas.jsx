import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Plus, DollarSign, Search, AlertCircle, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ModalNovaFatura from '../components/ModalNovaFatura';
import ModalPagarFatura from '../components/ModalPagarFatura';
import { faturaService, cartaoService } from '../services';
import authService from '../services/authService';

const Faturas = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [faturas, setFaturas] = useState([]);
  const [faturasExibidas, setFaturasExibidas] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas'); // todas, aberta, fechada, paga, atrasada
  const [filtroCartao, setFiltroCartao] = useState('todos');
  
  const [isModalNovaOpen, setIsModalNovaOpen] = useState(false);
  const [isModalPagarOpen, setIsModalPagarOpen] = useState(false);
  const [faturaParaPagar, setFaturaParaPagar] = useState(null);

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
    carregarDados();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [faturas, searchTerm, filtroStatus, filtroCartao]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const [faturasData, cartoesData] = await Promise.all([
        faturaService.listarFaturas(),
        cartaoService.listarCartoes()
      ]);
      
      setFaturas(Array.isArray(faturasData) ? faturasData : []);
      
      const cartoesArray = cartoesData.cartoes || cartoesData;
      setCartoes(Array.isArray(cartoesArray) ? cartoesArray : []);
    } catch (err) {
      setError('Erro ao carregar faturas. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...faturas];

    // Filtro por busca
    if (searchTerm) {
      resultado = resultado.filter(fatura =>
        fatura.cartao?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${fatura.mes_referencia}/${fatura.ano_referencia}`.includes(searchTerm)
      );
    }

    // Filtro por status
    if (filtroStatus !== 'todas') {
      resultado = resultado.filter(fatura => fatura.status === filtroStatus);
    }

    // Filtro por cartão
    if (filtroCartao !== 'todos') {
      resultado = resultado.filter(fatura => fatura.cartao_id === parseInt(filtroCartao));
    }

    setFaturasExibidas(resultado);
  };

  const handleCriarFatura = async (dados) => {
    await faturaService.criarFatura(dados);
    await carregarDados();
  };

  const handlePagarFatura = async (id, valorPago) => {
    await faturaService.pagarFatura(id, valorPago);
    await carregarDados();
  };

  const handleFecharFatura = async (id) => {
    if (!window.confirm('Deseja fechar esta fatura? Não será possível adicionar mais movimentos.')) {
      return;
    }
    try {
      await faturaService.fecharFatura(id);
      await carregarDados();
    } catch (error) {
      alert('Erro ao fechar fatura');
    }
  };

  const handleDeletarFatura = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      await faturaService.deletarFatura(id);
      await carregarDados();
    } catch (error) {
      alert('Erro ao deletar fatura');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      aberta: {
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        icon: <Clock size={14} />,
        text: 'Aberta'
      },
      fechada: {
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        icon: <AlertCircle size={14} />,
        text: 'Fechada'
      },
      paga: {
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        icon: <CheckCircle size={14} />,
        text: 'Paga'
      },
      atrasada: {
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
        icon: <XCircle size={14} />,
        text: 'Atrasada'
      }
    };

    const badge = badges[status] || badges.aberta;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const calcularEstatisticas = () => {
    return {
      total: faturas.length,
      abertas: faturas.filter(f => f.status === 'aberta').length,
      pagas: faturas.filter(f => f.status === 'paga').length,
      atrasadas: faturas.filter(f => f.status === 'atrasada').length,
      valorTotal: faturas.reduce((sum, f) => sum + (f.valor_total || 0), 0),
      valorPago: faturas.filter(f => f.status === 'paga').reduce((sum, f) => sum + (f.valor_pago || 0), 0),
      valorAberto: faturas.filter(f => f.status !== 'paga').reduce((sum, f) => sum + (f.valor_total || 0), 0)
    };
  };

  const stats = calcularEstatisticas();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500 dark:text-slate-400">Carregando...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    Faturas de Cartão
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Gerencie as faturas dos seus cartões de crédito
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total de Faturas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Abertas/Fechadas</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                {stats.abertas}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Valor em Aberto</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                R$ {stats.valorAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Valor Pago</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                R$ {stats.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por cartão ou mês..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtro Status */}
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="todas">Todos os Status</option>
                <option value="aberta">Abertas</option>
                <option value="fechada">Fechadas</option>
                <option value="paga">Pagas</option>
                <option value="atrasada">Atrasadas</option>
              </select>

              {/* Filtro Cartão */}
              <select
                value={filtroCartao}
                onChange={(e) => setFiltroCartao(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos os Cartões</option>
                {cartoes.map((cartao) => (
                  <option key={cartao.id} value={cartao.id}>
                    {cartao.nome}
                  </option>
                ))}
              </select>

              {/* Botão Nova Fatura */}
              <button
                onClick={() => setIsModalNovaOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                Nova Fatura
              </button>
            </div>
          </div>

          {/* Lista de Faturas */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {faturasExibidas.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-12 text-center">
              <Receipt size={48} className="mx-auto text-gray-400 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma fatura encontrada
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                {searchTerm || filtroStatus !== 'todas' || filtroCartao !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando uma nova fatura'}
              </p>
              {!searchTerm && filtroStatus === 'todas' && filtroCartao === 'todos' && (
                <button
                  onClick={() => setIsModalNovaOpen(true)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Criar Primeira Fatura
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {faturasExibidas.map((fatura) => (
                <div
                  key={fatura.id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {fatura.cartao?.nome || 'Cartão não encontrado'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {fatura.cartao?.bandeira} •••• {fatura.cartao?.ultimos_digitos}
                        </p>
                      </div>
                      {getStatusBadge(fatura.status)}
                    </div>

                    {/* Informações */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">Referência:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {String(fatura.mes_referencia).padStart(2, '0')}/{fatura.ano_referencia}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">Fechamento:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(fatura.data_fechamento + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">Vencimento:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(fatura.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-slate-700">
                        <span className="text-gray-700 dark:text-slate-300 font-semibold">Valor Total:</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          R$ {(fatura.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      {fatura.status === 'paga' && fatura.valor_pago && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-slate-400">Valor Pago:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            R$ {fatura.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2">
                      {/* Botão Ver Movimentos - sempre visível */}
                      <button
                        onClick={() => navigate(`/faturas/${fatura.id}`)}
                        className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-600 font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye size={16} />
                        Ver Movimentos
                      </button>
                      
                      <div className="flex gap-2">
                        {(fatura.status === 'fechada' || fatura.status === 'atrasada') && (
                          <button
                            onClick={() => {
                              setFaturaParaPagar(fatura);
                              setIsModalPagarOpen(true);
                            }}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <DollarSign size={16} />
                            Pagar
                          </button>
                        )}
                        {fatura.status === 'aberta' && (
                          <button
                            onClick={() => handleFecharFatura(fatura.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm rounded-lg hover:from-orange-700 hover:to-orange-600 font-medium transition-colors"
                          >
                            Fechar
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletarFatura(fatura.id)}
                          className="px-3 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modais */}
        <ModalNovaFatura
          isOpen={isModalNovaOpen}
          onClose={() => setIsModalNovaOpen(false)}
          onSuccess={handleCriarFatura}
        />

        <ModalPagarFatura
          isOpen={isModalPagarOpen}
          onClose={() => {
            setIsModalPagarOpen(false);
            setFaturaParaPagar(null);
          }}
          fatura={faturaParaPagar}
          onSuccess={handlePagarFatura}
        />
      </div>
    </div>
  );
};

export default Faturas;

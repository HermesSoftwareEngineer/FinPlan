import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, CreditCard, Receipt, DollarSign, Banknote, Edit2, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ModalPagarFaturaTransferencia from '../components/ModalPagarFaturaTransferencia';
import ModalEditarMovimentoFatura from '../components/ModalEditarMovimentoFatura';
import ModalNovoMovimentoFatura from '../components/ModalNovoMovimentoFatura';
import { faturaService, cartaoService } from '../services';
import authService from '../services/authService';

const DetalhesFatura = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID da fatura
  const [searchParams] = useSearchParams();
  const cartaoIdParam = searchParams.get('cartao_id');

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fatura, setFatura] = useState(null);
  const [movimentos, setMovimentos] = useState([]);
  const [cartao, setCartao] = useState(null);
  const [todasFaturas, setTodasFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalPagarOpen, setModalPagarOpen] = useState(false);
  const [modalEditarMovimentoOpen, setModalEditarMovimentoOpen] = useState(false);
  const [modalNovoMovimentoOpen, setModalNovoMovimentoOpen] = useState(false);
  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);

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
    if (id) {
      carregarDadosFatura();
    }
  }, [id]);

  const carregarDadosFatura = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar fatura
      const faturaData = await faturaService.buscarFatura(id);
      setFatura(faturaData);

      // Buscar movimentos da fatura usando o endpoint específico
      try {
        const movimentosData = await faturaService.buscarMovimentosFatura(id);
        setMovimentos(Array.isArray(movimentosData) ? movimentosData : []);
      } catch (movError) {
        console.error('Erro ao buscar movimentos da fatura:', movError);
        // Se o endpoint falhar, tentar usar os movimentos que vieram na fatura
        if (faturaData.movimentos) {
          setMovimentos(Array.isArray(faturaData.movimentos) ? faturaData.movimentos : []);
        } else {
          setMovimentos([]);
        }
      }

      // Buscar cartão
      if (faturaData.cartao_id) {
        const cartaoData = await cartaoService.buscarCartao(faturaData.cartao_id);
        setCartao(cartaoData);

        // Buscar todas as faturas do cartão para navegação
        const faturasData = await faturaService.listarFaturas({ cartao_id: faturaData.cartao_id });
        const faturasArray = Array.isArray(faturasData) ? faturasData : [];
        // Ordenar por ano e mês
        faturasArray.sort((a, b) => {
          if (a.ano_referencia !== b.ano_referencia) {
            return a.ano_referencia - b.ano_referencia;
          }
          return a.mes_referencia - b.mes_referencia;
        });
        setTodasFaturas(faturasArray);
      }
    } catch (err) {
      setError('Erro ao carregar detalhes da fatura.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navegarFatura = (direcao) => {
    const indexAtual = todasFaturas.findIndex(f => f.id === parseInt(id));
    let novoIndex;

    if (direcao === 'anterior') {
      novoIndex = indexAtual - 1;
    } else {
      novoIndex = indexAtual + 1;
    }

    if (novoIndex >= 0 && novoIndex < todasFaturas.length) {
      const novaFatura = todasFaturas[novoIndex];
      navigate(`/faturas/${novaFatura.id}${cartaoIdParam ? `?cartao_id=${cartaoIdParam}` : ''}`);
    }
  };

  const podeNavegar = (direcao) => {
    const indexAtual = todasFaturas.findIndex(f => f.id === parseInt(id));
    if (direcao === 'anterior') {
      return indexAtual > 0;
    } else {
      return indexAtual < todasFaturas.length - 1;
    }
  };

  const handlePagamentoSuccess = async () => {
    try {
      // Aguardar 2 segundos antes de recarregar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recarregar dados da fatura
      await carregarDadosFatura();
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
      alert('Erro ao atualizar os dados da fatura.');
    }
  };

  const handleEditarMovimento = (movimento) => {
    setMovimentoSelecionado(movimento);
    setModalEditarMovimentoOpen(true);
  };

  const handleMovimentoEditadoSuccess = async () => {
    setModalEditarMovimentoOpen(false);
    setMovimentoSelecionado(null);
    await carregarDadosFatura();
  };

  const handleNovoMovimentoSuccess = async () => {
    setModalNovoMovimentoOpen(false);
    await carregarDadosFatura();
  };

  const getStatusBadge = (status) => {
    const badges = {
      aberta: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', text: 'Aberta' },
      fechada: { color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', text: 'Fechada' },
      paga: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', text: 'Paga' },
      atrasada: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', text: 'Atrasada' }
    };
    const badge = badges[status] || badges.aberta;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getTipoColor = (tipo) => {
    return tipo === 'receita' 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const formatarValor = (valor, tipo) => {
    const valorFormatado = Math.abs(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
    const sinal = tipo === 'receita' ? '+' : '-';
    return `${sinal} R$ ${valorFormatado}`;
  };

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

  if (error || !fatura) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error || 'Fatura não encontrada'}</p>
              <button
                onClick={() => navigate(cartaoIdParam ? `/cartoes` : '/faturas')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Voltar
              </button>
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
                <button
                  onClick={() => navigate(cartaoIdParam ? `/cartoes` : '/faturas')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Detalhes da Fatura
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    {cartao?.nome || 'Cartão'} - {String(fatura.mes_referencia).padStart(2, '0')}/{fatura.ano_referencia}
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Navegação entre faturas */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navegarFatura('anterior')}
              disabled={!podeNavegar('anterior')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                podeNavegar('anterior')
                  ? 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
              Fatura Anterior
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-400">Navegando faturas do cartão</p>
              <p className="font-semibold text-gray-900 dark:text-white">{cartao?.nome}</p>
            </div>

            <button
              onClick={() => navegarFatura('proxima')}
              disabled={!podeNavegar('proxima')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                podeNavegar('proxima')
                  ? 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  : 'bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              Próxima Fatura
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Informações da Fatura */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card Cartão */}
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Cartão</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{cartao?.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {cartao?.bandeira} •••• {cartao?.ultimos_digitos}
                  </p>
                </div>
              </div>

              {/* Card Período */}
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Período</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {String(fatura.mes_referencia).padStart(2, '0')}/{fatura.ano_referencia}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    Venc: {new Date(fatura.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Card Valor Total */}
              <div className="flex items-start gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Valor Total</p>
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    R$ {(fatura.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {movimentos.length} movimento{movimentos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Card Status */}
              <div className="flex items-start gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Receipt className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Status</p>
                  {getStatusBadge(fatura.status)}
                  {fatura.status === 'paga' && fatura.valor_pago && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Pago: R$ {fatura.valor_pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mb-6 flex justify-end gap-3">
            <button
              onClick={() => setModalNovoMovimentoOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={18} />
              Nova Compra
            </button>
            {fatura.status !== 'paga' && (
              <button
                onClick={() => setModalPagarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                <Banknote size={18} />
                Pagar Fatura
              </button>
            )}
          </div>

          {/* Lista de Movimentos */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Movimentos da Fatura
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                {movimentos.length} movimento{movimentos.length !== 1 ? 's' : ''} encontrado{movimentos.length !== 1 ? 's' : ''}
              </p>
            </div>

            {movimentos.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt size={48} className="mx-auto text-gray-400 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum movimento
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Esta fatura não possui movimentos registrados
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {movimentos.map((movimento) => (
                  <div
                    key={movimento.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {movimento.descricao}
                          </h3>
                          {movimento.categoria && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded">
                              {movimento.categoria.nome}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                          <span>
                            📅 {new Date(movimento.data_competencia + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </span>
                          {movimento.parcelado && movimento.numero_parcela && movimento.total_parcelas && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                              Parcela {movimento.numero_parcela}/{movimento.total_parcelas}
                            </span>
                          )}
                          {movimento.recorrente && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                              Recorrente
                            </span>
                          )}
                        </div>
                        {movimento.observacao && (
                          <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                            {movimento.observacao}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getTipoColor(movimento.tipo)}`}>
                            {formatarValor(movimento.valor, movimento.tipo)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditarMovimento(movimento)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Editar movimento"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Pagar Fatura */}
      <ModalPagarFaturaTransferencia
        isOpen={modalPagarOpen}
        onClose={() => setModalPagarOpen(false)}
        fatura={fatura}
        cartao={cartao}
        onSuccess={handlePagamentoSuccess}
      />

      {/* Modal Editar Movimento da Fatura */}
      <ModalEditarMovimentoFatura
        isOpen={modalEditarMovimentoOpen}
        movimento={movimentoSelecionado}
        onClose={() => {
          setModalEditarMovimentoOpen(false);
          setMovimentoSelecionado(null);
        }}
        onSuccess={handleMovimentoEditadoSuccess}
      />

      {/* Modal Novo Movimento da Fatura */}
      <ModalNovoMovimentoFatura
        isOpen={modalNovoMovimentoOpen}
        cartao={cartao}
        fatura={fatura}
        onClose={() => setModalNovoMovimentoOpen(false)}
        onSuccess={handleNovoMovimentoSuccess}
      />
    </div>
  );
};

export default DetalhesFatura;

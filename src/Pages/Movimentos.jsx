import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FiltrosMovimentos from '../components/FiltrosMovimentos';
import ModalNovoMovimento from '../components/ModalNovoMovimento';
import ModalEditarMovimento from '../components/ModalEditarMovimento';
import movimentoService from '../services/movimentoService';
import categoriaService from '../services/categoriaService';
import contaService from '../services/contaService';
import authService from '../services/authService';
import MovimentosHeader from '../components/MovimentosHeader';
import MovimentosResumoSaldos from '../components/MovimentosResumoSaldos';
import MovimentosLista from '../components/MovimentosLista';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Movimentos() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dadosMovimentos, setDadosMovimentos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalNovo, setShowModalNovo] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    tipo: '',
    pago: '',
    data_inicio: '',
    data_fim: '',
    categorias: [],
    conta_id: '',
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

  // Carregar movimentos
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarMovimentos();
    }, 1000);

    return () => clearTimeout(timer);
  }, [filtros]);

  // Carregar contas e categorias
  useEffect(() => {
    carregarContasECategorias();
  }, []);

  const carregarContasECategorias = async () => {
    try {
      const [contasData, categoriasData] = await Promise.all([
        contaService.listar(),
        categoriaService.listar(),
      ]);
      setContas(contasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar contas e categorias:', error);
    }
  };

  const carregarMovimentos = async () => {
    try {
      setLoading(true);
      const data = await movimentoService.listarComSaldo(filtros);
      setDadosMovimentos(data);
    } catch (error) {
      console.error('Erro ao carregar movimentos:', error);
      setDadosMovimentos(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movimento) => {
    // Se o movimento for de uma fatura, redirecionar para a página da fatura
    if (movimento.origem === 'fatura' && movimento.fatura_id) {
      navigate(`/faturas/${movimento.fatura_id}`);
      return;
    }
    
    setMovimentoSelecionado(movimento);
    setShowModalEditar(true);
  };

  const handleTogglePago = async (movimento) => {
    // Se o movimento for de origem "fatura", redirecionar para a fatura
    if (movimento.origem === 'fatura' && movimento.fatura_id) {
      navigate(`/faturas/${movimento.fatura_id}`);
      return;
    }

    // Caso contrário, alterar o status normalmente
    try {
      await movimentoService.togglePago(movimento.id);
      carregarMovimentos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status de pagamento.');
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'receita':
        return '📈';
      case 'despesa':
        return '📉';
      case 'transferencia':
        return '🔄';
      default:
        return '💰';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'receita':
        return 'text-green-600 dark:text-green-400';
      case 'despesa':
        return 'text-red-600 dark:text-red-400';
      case 'transferencia':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTipoAccent = (tipo) => {
    switch (tipo) {
      case 'receita':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'despesa':
        return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300';
      case 'transferencia':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getNomeConta = (contaId) => {
    const conta = contas.find(c => c.id === contaId);
    return conta ? conta.nome : null;
  };

  const getNomeCategoria = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? `${categoria.nome}` : null;
  };

  const getNomeIconeCategoria = (categoriaId) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? `${categoria.icone}` : null;
  }

  const formatarValor = (valor, tipo) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);

    return tipo === 'despesa' ? `-${formatted}` : formatted;
  };

  const formatarData = (data) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarDataCompleta = (data) => {
    const date = new Date(data + 'T00:00:00');
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    // Resetar horas para comparação apenas de datas
    hoje.setHours(0, 0, 0, 0);
    ontem.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date.getTime() === hoje.getTime()) {
      return 'Hoje';
    } else if (date.getTime() === ontem.getTime()) {
      return 'Ontem';
    }
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <MovimentosHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Filtros e Ações */}
        <div className="p-6 space-y-6">
          <FiltrosMovimentos
            filtros={filtros}
            setLoading={setLoading}
            setFiltros={setFiltros}
            onNovoMovimento={() => setShowModalNovo(true)}
            categorias={categorias}
            contas={contas}
          />

          {/* Resumo de Saldos (se tiver dados com saldo) */}
          {!loading && dadosMovimentos && dadosMovimentos.saldo_inicial !== undefined && (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
                <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Total de despesas
                </p>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    (dadosMovimentos.saldo_final_previsto - dadosMovimentos.saldo_final_real) >= 0
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatarValor(dadosMovimentos.totais.despesas_total || 0, 'despesa')}
                </p>
              </article>
              <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
                <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Total de receitas
                </p>
                <p className="mt-2 text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatarValor(dadosMovimentos.totais.receitas_total || 0, 'receita')}
                </p>
              </article>
              <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
                <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Saldo real
                </p>
                <p className="mt-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatarValor(dadosMovimentos.saldo_final_real || 0, 'receita')}
                </p>
              </article>
              <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
                <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Saldo previsto
                </p>
                <p className="mt-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {formatarValor(dadosMovimentos.saldo_final_previsto || 0, 'receita')}
                </p>
              </article>
              <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
                <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
                  Saldo do mês
                </p>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    (dadosMovimentos.saldo_final_previsto - dadosMovimentos.saldo_final_real) >= 0
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatarValor(dadosMovimentos.saldo_final_previsto - dadosMovimentos.saldo_final_real, 'receita')}
                </p>
              </article>
            </section>
          )}
          {/* Lista de Movimentos */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size={12} color="primary-500" />
            </div>
          ) : (
            <MovimentosLista
              dadosMovimentos={dadosMovimentos}
              formatarDataCompleta={formatarDataCompleta}
              getTipoAccent={getTipoAccent}
              getTipoIcon={getTipoIcon}
              getTipoColor={getTipoColor}
              formatarValor={formatarValor}
              getNomeCategoria={getNomeCategoria}
              getNomeConta={getNomeConta}
              handleTogglePago={handleTogglePago}
              handleEdit={handleEdit}
              onNovoMovimento={() => setShowModalNovo(true)}
              getNomeIconeCategoria={getNomeIconeCategoria}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalNovoMovimento
        isOpen={showModalNovo}
        onClose={() => setShowModalNovo(false)}
        onSuccess={carregarMovimentos}
      />

      <ModalEditarMovimento
        isOpen={showModalEditar}
        movimento={movimentoSelecionado}
        onClose={() => {
          setShowModalEditar(false);
          setMovimentoSelecionado(null);
        }}
        onSuccess={carregarMovimentos}
      />

    </div>
  );
}

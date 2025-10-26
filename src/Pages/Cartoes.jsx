import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, Edit2, Trash2, Search, AlertCircle, Receipt } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import ModalNovoCartao from '../components/ModalNovoCartao';
import ModalEditarCartao from '../components/ModalEditarCartao';
import { cartaoService, faturaService } from '../services';
import authService from '../services/authService';

const Cartoes = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cartoes, setCartoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [cartoesExibidos, setCartoesExibidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos'); // todos, ativos, inativos
  const [filtroBandeira, setFiltroBandeira] = useState('todas');
  
  const [isModalNovoOpen, setIsModalNovoOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);
  const [cartaoParaEditar, setCartaoParaEditar] = useState(null);

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
    carregarCartoes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [cartoes, searchTerm, filtroAtivo, filtroBandeira]);

  const carregarCartoes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartaoService.listarCartoes();
      // A API agora retorna { estatisticas, cartoes } ou array direto
      const cartoesArray = data.cartoes || data;
      setCartoes(Array.isArray(cartoesArray) ? cartoesArray : []);
      // Salvar estatísticas se disponíveis
      if (data.estatisticas) {
        setEstatisticas(data.estatisticas);
      }
    } catch (err) {
      setError('Erro ao carregar cartões. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...cartoes];

    // Filtro por busca
    if (searchTerm) {
      resultado = resultado.filter(cartao =>
        cartao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cartao.bandeira.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cartao.ultimos_digitos.includes(searchTerm)
      );
    }

    // Filtro por status
    if (filtroAtivo === 'ativos') {
      resultado = resultado.filter(cartao => cartao.ativo);
    } else if (filtroAtivo === 'inativos') {
      resultado = resultado.filter(cartao => !cartao.ativo);
    }

    // Filtro por bandeira
    if (filtroBandeira !== 'todas') {
      resultado = resultado.filter(cartao => cartao.bandeira === filtroBandeira);
    }

    setCartoesExibidos(resultado);
  };

  const handleCriarCartao = async (dados) => {
    try {
      await cartaoService.criarCartao(dados);
      await carregarCartoes();
      setIsModalNovoOpen(false);
    } catch (err) {
      console.error('Erro ao criar cartão:', err);
      alert('Erro ao criar cartão. Tente novamente.');
    }
  };

  const handleEditarCartao = async (id, dados) => {
    try {
      await cartaoService.atualizarCartao(id, dados);
      await carregarCartoes();
      setIsModalEditarOpen(false);
      setCartaoParaEditar(null);
    } catch (err) {
      console.error('Erro ao editar cartão:', err);
      alert('Erro ao editar cartão. Tente novamente.');
    }
  };

  const handleDeletarCartao = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o cartão "${nome}"?`)) {
      try {
        await cartaoService.deletarCartao(id);
        await carregarCartoes();
      } catch (err) {
        console.error('Erro ao deletar cartão:', err);
        alert('Erro ao deletar cartão. Tente novamente.');
      }
    }
  };

  const handleVerFaturas = async (cartaoId) => {
    try {
      // Buscar faturas do cartão
      const faturasData = await faturaService.listarFaturas({ cartao_id: cartaoId });
      const faturasArray = Array.isArray(faturasData) ? faturasData : [];
      
      if (faturasArray.length === 0) {
        alert('Este cartão não possui faturas cadastradas.');
        return;
      }

      // Ordenar faturas por data (mais recente primeiro)
      faturasArray.sort((a, b) => {
        if (a.ano_referencia !== b.ano_referencia) {
          return b.ano_referencia - a.ano_referencia;
        }
        return b.mes_referencia - a.mes_referencia;
      });

      // Buscar fatura do mês atual
      const dataAtual = new Date();
      const mesAtual = dataAtual.getMonth() + 1; // 1-12
      const anoAtual = dataAtual.getFullYear();

      const faturaAtual = faturasArray.find(
        f => f.mes_referencia === mesAtual && f.ano_referencia === anoAtual
      );

      // Se encontrou fatura do mês atual, navega para ela, senão vai para a mais recente
      const faturaDestino = faturaAtual || faturasArray[0];
      navigate(`/faturas/${faturaDestino.id}?cartao_id=${cartaoId}`);
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
      alert('Erro ao carregar faturas do cartão.');
    }
  };

  const abrirModalEditar = (cartao) => {
    setCartaoParaEditar(cartao);
    setIsModalEditarOpen(true);
  };

  const bandeirasUnicas = ['todas', ...new Set(cartoes.map(c => c.bandeira))];

  const calcularLimiteDisponivel = (cartao) => {
    // Aqui você pode adicionar lógica para calcular o limite disponível
    // considerando as faturas/compras. Por enquanto, retorna o limite total
    return cartao.limite - cartao.limite_utilizado;
  };

  const calcularPercentualUtilizado = (cartao) => {
    const disponivel = calcularLimiteDisponivel(cartao);
    return ((cartao.limite - disponivel) / cartao.limite) * 100;
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header com Toggle */}
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
                    Cartões de Crédito
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Gerencie seus cartões de crédito
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Ações e Filtros */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nome, bandeira ou últimos dígitos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Filtro Status */}
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroAtivo('todos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroAtivo === 'todos'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroAtivo('ativos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroAtivo === 'ativos'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setFiltroAtivo('inativos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filtroAtivo === 'inativos'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                Inativos
              </button>
            </div>

            {/* Filtro Bandeira */}
            <select
              value={filtroBandeira}
              onChange={(e) => setFiltroBandeira(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
            >
              {bandeirasUnicas.map(bandeira => (
                <option key={bandeira} value={bandeira}>
                  {bandeira === 'todas' ? 'Todas as Bandeiras' : bandeira}
                </option>
              ))}
            </select>

            {/* Botão Novo Cartão */}
            <button
              onClick={() => setIsModalNovoOpen(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
            >
              <Plus size={20} />
              Novo Cartão
            </button>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Lista de Cartões */}
        {cartoesExibidos.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-8 text-center">
            <CreditCard className="mx-auto text-gray-400 dark:text-slate-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum cartão encontrado
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              {searchTerm || filtroAtivo !== 'todos' || filtroBandeira !== 'todas'
                ? 'Tente ajustar os filtros ou busca.'
                : 'Comece adicionando seu primeiro cartão de crédito.'}
            </p>
            {!searchTerm && filtroAtivo === 'todos' && filtroBandeira === 'todas' && (
              <button
                onClick={() => setIsModalNovoOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={20} />
                Adicionar Cartão
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartoesExibidos.map((cartao) => (
              <div
                key={cartao.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Card Visual */}
                <div
                  className="p-6 text-white relative"
                  style={{ backgroundColor: cartao.cor }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-90">Cartão de Crédito</p>
                      <h3 className="text-xl font-bold mt-1">{cartao.nome}</h3>
                    </div>
                    <CreditCard size={32} className="opacity-90" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm opacity-90">Número do Cartão</p>
                    <p className="text-lg font-mono">•••• •••• •••• {cartao.ultimos_digitos}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-90">Bandeira</p>
                      <p className="font-semibold">{cartao.bandeira}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-90">Vencimento</p>
                      <p className="font-semibold">Dia {cartao.dia_vencimento}</p>
                    </div>
                  </div>

                  {!cartao.ativo && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Inativo
                    </div>
                  )}
                </div>

                {/* Informações do Cartão */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-slate-400">Limite</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        R$ {cartao.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${Math.min(calcularPercentualUtilizado(cartao), 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      {calcularPercentualUtilizado(cartao).toFixed(0)}% utilizado
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-slate-400">Fechamento</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Dia {cartao.dia_fechamento}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-slate-400">Vencimento</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Dia {cartao.dia_vencimento}</p>
                    </div>
                  </div>

                  {cartao.conta && (
                    <div className="mb-4 text-sm">
                      <p className="text-gray-600 dark:text-slate-400">Conta de Débito</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{cartao.conta.nome}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    {/* Botão Ver Faturas */}
                    <button
                      onClick={() => handleVerFaturas(cartao.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Receipt size={16} />
                      Ver Faturas
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModalEditar(cartao)}
                        className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletarCartao(cartao.id, cartao.nome)}
                        className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {cartoes.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Total de Cartões</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {estatisticas?.total_cartoes || cartoes.length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Cartões Ativos</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {estatisticas?.cartoes_ativos || cartoes.filter(c => c.ativo).length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Limite Total</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                R$ {(estatisticas?.limite_total || cartoes.reduce((sum, c) => sum + c.limite, 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Limite Utilizado</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                R$ {(estatisticas?.limite_utilizado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Limite Disponível</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                R$ {(estatisticas?.limite_disponivel || cartoes.reduce((sum, c) => sum + calcularLimiteDisponivel(c), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Modais */}
        <ModalNovoCartao
          isOpen={isModalNovoOpen}
          onClose={() => setIsModalNovoOpen(false)}
          onSubmit={handleCriarCartao}
        />

        <ModalEditarCartao
          isOpen={isModalEditarOpen}
          onClose={() => {
            setIsModalEditarOpen(false);
            setCartaoParaEditar(null);
          }}
          onSubmit={handleEditarCartao}
          cartao={cartaoParaEditar}
        />
        </main>
      </div>
    </div>
  );
};

export default Cartoes;

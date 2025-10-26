import { useState, useEffect } from 'react';
import ModalFiltroCategoria from './ModalFiltroCategoria';
import ModernSelect from './ModernSelect';

export default function FiltrosMovimentos({ filtros, setFiltros, setLoading, onNovoMovimento, categorias = [], contas = [] }) {
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [periodoDatas, setPeriodoDatas] = useState('este_mes'); // Novo estado para o select

  // Aplicar filtro "Este Mês" automaticamente quando o componente for montado
  useEffect(() => {
    if (!filtros.data_inicio && !filtros.data_fim) {
      setLoading(true)
      setPeriodoEsteMs();
    }
  }, []); // Executa apenas uma vez na montagem do componente

  // Função para definir períodos
  const setPeriodoEstaSemana = () => {
    
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, etc.
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana); // Começa no domingo
    
    setFiltros({
      ...filtros,
      data_inicio: inicioSemana.toISOString().split('T')[0],
      data_fim: hoje.toISOString().split('T')[0],
    });
  };

  const setPeriodoUltimos15Dias = () => {
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - 15);
    
    setFiltros({
      ...filtros,
      data_inicio: inicio.toISOString().split('T')[0],
      data_fim: hoje.toISOString().split('T')[0],
    });
  };


  const setPeriodoEsteMs = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    setFiltros({
      ...filtros,
      data_inicio: primeiroDia.toISOString().split('T')[0],
      data_fim: ultimoDia.toISOString().split('T')[0],
    });
  };

  const setPeriodoProximoMes = () => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0);
    setFiltros({
      ...filtros,
      data_inicio: primeiroDia.toISOString().split('T')[0],
      data_fim: ultimoDia.toISOString().split('T')[0],
    });
  };

  const setPeriodoUltimos3Meses = () => {
    const hoje = new Date();
    const inicio = new Date(hoje);
    inicio.setMonth(hoje.getMonth() - 3);
    
    setFiltros({
      ...filtros,
      data_inicio: inicio.toISOString().split('T')[0],
      data_fim: hoje.toISOString().split('T')[0],
    });
  };

  // Função para obter o nome do mês do período atual
  const getNomePeriodo = () => {
    if (!filtros.data_inicio || periodoDatas === 'personalizado') {
      return periodoDatas;
    }

    const dataInicio = new Date(filtros.data_inicio + 'T00:00:00');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Se for "Este mês", mostrar nome do mês e ano
    if (periodoDatas === 'este_mes' || periodoDatas === 'proximo_mes') {
      return `${meses[dataInicio.getMonth()]} ${dataInicio.getFullYear()}`;
    }

    // Para outros períodos, retornar o valor padrão
    const labels = {
      'esta_semana': 'Esta semana',
      'ultimos_15_dias': 'Últimos 15 dias',
      'ultimos_3_meses': 'Últimos 3 meses',
    };

    return labels[periodoDatas] || periodoDatas;
  };

  // Função para navegar entre meses
  const navegarMes = (direcao) => {
    if (!filtros.data_inicio || !filtros.data_fim) return;
    setLoading(true);

    const dataInicio = new Date(filtros.data_inicio + 'T00:00:00');
    const dataFim = new Date(filtros.data_fim + 'T00:00:00');

    // Ajusta o mês
    if (direcao === 'anterior') {
      dataInicio.setMonth(dataInicio.getMonth() - 1);
      dataFim.setMonth(dataFim.getMonth() - 1);
    } else {
      dataInicio.setMonth(dataInicio.getMonth() + 1);
      dataFim.setMonth(dataFim.getMonth() + 1);
    }

    setFiltros({
      ...filtros,
      data_inicio: dataInicio.toISOString().split('T')[0],
      data_fim: dataFim.toISOString().split('T')[0],
    });
  };

  // Função para lidar com mudança no select de período
  const handlePeriodoChange = (valor) => {
    setLoading(true)
    setPeriodoDatas(valor);
    
    switch (valor) {
      case 'esta_semana':
        setPeriodoEstaSemana();
        break;
      case 'ultimos_15_dias':
        setPeriodoUltimos15Dias();
        break;
      case 'este_mes':
        setPeriodoEsteMs();
        break;
      case 'proximo_mes':
        setPeriodoProximoMes();
        break;
      case 'ultimos_3_meses':
        setPeriodoUltimos3Meses();
        break;
      case 'personalizado':
        // Não limpa as datas, mantém as atuais para o usuário editar
        break;
      default:
        break;
    }
  };

  const handleAplicarCategorias = (categoriasSelecionadas) => {
    setFiltros({
      ...filtros,
      categorias: categoriasSelecionadas,
    });
  };

  const getNomesCategoriasSelec = () => {
    if (!filtros.categorias || filtros.categorias.length === 0) return null;
    
    return filtros.categorias
      .map(id => {
        const cat = categorias.find(c => c.id === id);
        return cat ? `${cat.icone} ${cat.nome}` : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  return (
    <>
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Linha 1: Filtros principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Filtro de Conta */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Conta
              </label>
              <select
                value={filtros.conta_id}
                onChange={(e) => setFiltros({ ...filtros, conta_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas as contas</option>
                {contas.filter(c => c.ativa).map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Período */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Período
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navegarMes('anterior')}
                  className="p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
                  title="Mês anterior"
                >
                  ◀
                </button>
                <ModernSelect
                  value={periodoDatas}
                  onChange={handlePeriodoChange}
                  options={[
                    { value: 'esta_semana', label: 'Esta semana' },
                    { value: 'ultimos_15_dias', label: 'Últimos 15 dias' },
                    { value: 'este_mes', label: getNomePeriodo() },
                    { value: 'proximo_mes', label: periodoDatas === 'proximo_mes' ? getNomePeriodo() : 'Próximo mês' },
                    { value: 'ultimos_3_meses', label: 'Últimos 3 meses' },
                    { value: 'personalizado', label: 'Personalizado' },
                  ]}
                  className="flex-1"
                />
                <button
                  onClick={() => navegarMes('proximo')}
                  className="p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
                  title="Próximo mês"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Filtro de Tipo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tipo
              </label>
              <select
                value={filtros.tipo}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos</option>
                <option value="receita">📈 Receitas</option>
                <option value="despesa">📉 Despesas</option>
                <option value="transferencia">🔄 Transferências</option>
              </select>
            </div>

            {/* Filtro de Status */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Status
              </label>
              <select
                value={filtros.pago}
                onChange={(e) => setFiltros({ ...filtros, pago: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos</option>
                <option value="true">✓ Pagos</option>
                <option value="false">⏱ Pendentes</option>
              </select>
            </div>

            {/* Filtro de Categorias */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Categorias
              </label>
              <button
                onClick={() => setShowModalCategoria(true)}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary focus:ring-2 focus:ring-primary-500 text-left flex items-center justify-between"
              >
                <span className="truncate">
                  {filtros.categorias && filtros.categorias.length > 0
                    ? `${filtros.categorias.length} selecionada(s)`
                    : 'Selecionar...'}
                </span>
                <span>🔽</span>
              </button>
            </div>

            {/* Botão Novo Movimento */}
            <div className="flex items-end">
              <button
                onClick={onNovoMovimento}
                className="w-full px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition font-medium shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                + Novo Movimento
              </button>
            </div>
          </div>

          {/* Linha 2: Datas Personalizadas (só aparece se Personalizado estiver selecionado) */}
          {periodoDatas === 'personalizado' && (
            <div className="border-t border-light-border dark:border-dark-border pt-4">
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={filtros.data_inicio}
                    onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={filtros.data_fim}
                    onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indicadores de Filtros Ativos */}
        {(filtros.tipo || filtros.pago || filtros.data_inicio || filtros.data_fim || (filtros.categorias && filtros.categorias.length > 0)) && (
          <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-light-border dark:border-dark-border">
            <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Filtros ativos:
            </span>
            
            {filtros.tipo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                Tipo: {filtros.tipo}
                <button
                  onClick={() => setFiltros({ ...filtros, tipo: '' })}
                  className="hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filtros.pago && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                Status: {filtros.pago === 'true' ? 'Pagos' : 'Pendentes'}
                <button
                  onClick={() => setFiltros({ ...filtros, pago: '' })}
                  className="hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            )}

            {filtros.categorias && filtros.categorias.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                Categorias: {filtros.categorias.length}
                <button
                  onClick={() => setFiltros({ ...filtros, categorias: [] })}
                  className="hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filtros.data_inicio && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                De: {new Date(filtros.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                <button
                  onClick={() => setFiltros({ ...filtros, data_inicio: '' })}
                  className="hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filtros.data_fim && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                Até: {new Date(filtros.data_fim + 'T00:00:00').toLocaleDateString('pt-BR')}
                <button
                  onClick={() => setFiltros({ ...filtros, data_fim: '' })}
                  className="hover:text-primary-800 dark:hover:text-primary-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            <button
              onClick={() => setFiltros({ tipo: '', pago: '', data_inicio: '', data_fim: '', categorias: [] })}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* Modal de Filtro de Categorias */}
      <ModalFiltroCategoria
        isOpen={showModalCategoria}
        onClose={() => setShowModalCategoria(false)}
        categorias={categorias}
        categoriasSelecionadas={filtros.categorias || []}
        onAplicar={handleAplicarCategorias}
      />
    </>
  );
}

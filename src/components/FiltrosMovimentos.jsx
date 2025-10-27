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
    const dataFim = new Date(filtros.data_fim + 'T00:00:00');
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    if (periodoDatas === 'este_mes') {
      // Mês: mostra nome do mês e ano
      return `${meses[dataInicio.getMonth()]} ${dataInicio.getFullYear()}`;
    } else if (periodoDatas === 'esta_semana') {
      // Semana: mostra data inicial e final
      const inicio = `${String(dataInicio.getDate()).padStart(2, '0')} ${meses[dataInicio.getMonth()]}`;
      const fim = `${String(dataFim.getDate()).padStart(2, '0')} ${meses[dataFim.getMonth()]}`;
      return `${inicio} a ${fim}`;
    } else if (periodoDatas === 'hoje') {
      // Dia: mostra dia e mês
      return `${String(dataInicio.getDate()).padStart(2, '0')} de ${meses[dataInicio.getMonth()]}`;
    }
    return periodoDatas;
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

  const navegarPeriodo = (direcao) => {
    if (!filtros.data_inicio || !filtros.data_fim) return;
    setLoading(true);

    const dataInicio = new Date(filtros.data_inicio + 'T00:00:00');
    const dataFim = new Date(filtros.data_fim + 'T00:00:00');
    const diffDias = Math.round((dataFim - dataInicio) / (1000 * 60 * 60 * 24));

    if (periodoDatas === 'hoje') {
      // Navega 1 dia
      if (direcao === 'anterior') {
        dataInicio.setDate(dataInicio.getDate() - 1);
        dataFim.setDate(dataFim.getDate() - 1);
      } else {
        dataInicio.setDate(dataInicio.getDate() + 1);
        dataFim.setDate(dataFim.getDate() + 1);
      }
    } else if (periodoDatas === 'esta_semana') {
      // Navega 7 dias
      if (direcao === 'anterior') {
        dataInicio.setDate(dataInicio.getDate() - 7);
        dataFim.setDate(dataFim.getDate() - 7);
      } else {
        dataInicio.setDate(dataInicio.getDate() + 7);
        dataFim.setDate(dataFim.getDate() + 7);
      }
    } else if (periodoDatas === 'este_mes') {
      // Navega 1 mês
      if (direcao === 'anterior') {
        dataInicio.setMonth(dataInicio.getMonth() - 1);
        dataFim.setMonth(dataFim.getMonth() - 1);
      } else {
        dataInicio.setMonth(dataInicio.getMonth() + 1);
        dataFim.setMonth(dataFim.getMonth() + 1);
      }
    } else {
      // Personalizado: navega o mesmo intervalo de dias
      if (direcao === 'anterior') {
        dataInicio.setDate(dataInicio.getDate() - (diffDias + 1));
        dataFim.setDate(dataFim.getDate() - (diffDias + 1));
      } else {
        dataInicio.setDate(dataInicio.getDate() + (diffDias + 1));
        dataFim.setDate(dataFim.getDate() + (diffDias + 1));
      }
    }

    setFiltros({
      ...filtros,
      data_inicio: dataInicio.toISOString().split('T')[0],
      data_fim: dataFim.toISOString().split('T')[0],
    });
  };

  const setPeriodoHoje = () => {
    const hoje = new Date();
    setFiltros({
      ...filtros,
      data_inicio: hoje.toISOString().split('T')[0],
      data_fim: hoje.toISOString().split('T')[0],
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
      case 'este_mes':
        setPeriodoEsteMs();
        break;
      case 'hoje':
        setPeriodoHoje();
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
              <ModernSelect
                value={filtros.conta_id || ''}
                onChange={val => setFiltros({ ...filtros, conta_id: val })}
                options={[{ value: '', label: 'Todas as contas' }, ...contas.filter(c => c.ativa).map(conta => ({ value: conta.id, label: conta.nome }))]}
                placeholder="Todas as contas"
                className="w-full"
              />
            </div>

            {/* Filtro de Tipo */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Tipo
              </label>
              <ModernSelect
                value={filtros.tipo || ''}
                onChange={val => setFiltros({ ...filtros, tipo: val })}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'receita', label: '📈 Receitas' },
                  { value: 'despesa', label: '📉 Despesas' },
                  { value: 'transferencia', label: '🔄 Transferências' },
                ]}
                placeholder="Todos"
                className="w-full"
              />
            </div>

            {/* Filtro de Status */}
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Status
              </label>
              <ModernSelect
                value={filtros.pago || ''}
                onChange={val => setFiltros({ ...filtros, pago: val })}
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'true', label: '✓ Pagos' },
                  { value: 'false', label: '⏱ Pendentes' },
                ]}
                placeholder="Todos"
                className="w-full"
              />
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
          
          <div className="flex items-center gap-4">
            {/* Filtro de Período */}
            <div className="max-w-xs w-full">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                Período
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navegarPeriodo('anterior')}
                  className="p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
                  title="Mês anterior"
                >
                  ◀
                </button>
                <ModernSelect
                  value={periodoDatas}
                  onChange={handlePeriodoChange}
                  options={[
                    { value: 'hoje', label: periodoDatas === 'hoje' ? getNomePeriodo() : 'Hoje' },
                    { value: 'este_mes', label: periodoDatas === 'este_mes' ? getNomePeriodo() : 'Este mês' },
                    { value: 'esta_semana', label: periodoDatas === 'esta_semana' ? getNomePeriodo() : 'Esta semana' },
                    { value: 'personalizado', label: 'Personalizado' },
                  ]}
                  className="flex-1"
                />
                <button
                  onClick={() => navegarPeriodo('proximo')}
                  className="p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
                  title="Próximo mês"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Linha 2: Datas Personalizadas (ao lado do filtro de período) */}
            {periodoDatas === 'personalizado' && (
              <div className="border-l border-light-border dark:border-dark-border pl-4 flex gap-4 items-end">
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
            )}
          </div>
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

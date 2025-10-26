import { Fragment, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ICONES = {
  restaurant: '🍽️',
  shopping_cart: '🛒',
  home: '🏠',
  directions_car: '🚗',
  favorite: '❤️',
  school: '📚',
  sports_esports: '🎮',
  work: '💼',
  attach_money: '💰',
  savings: '💵',
  credit_card: '💳',
  local_grocery_store: '🏪',
  fitness_center: '💪',
  phone: '📱',
  lightbulb: '💡',
  pets: '🐾',
  flight: '✈️',
  celebration: '🎉',
  checkroom: '👔',
  local_pharmacy: '💊',
};

const fallbackFormatarValor = (valor) => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarMesAno = (mesAno) => {
  const [ano, mes] = mesAno.split('-');
  const data = new Date(ano, parseInt(mes, 10) - 1, 1);
  return data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());
};

const getIconeEmoji = (icone) => ICONES[icone] || '📂';

export default function DRETable({ dadosDRE, formatarValor }) {
  const [gruposExpandidos, setGruposExpandidos] = useState({});
  const formatar = useMemo(() => formatarValor || fallbackFormatarValor, [formatarValor]);
  const quantidadeMeses = dadosDRE?.meses?.length ?? 0;

  useEffect(() => {
    if (!dadosDRE?.receitas?.linhas || !dadosDRE?.despesas?.linhas) {
      setGruposExpandidos({});
      return;
    }
    const novos = {};
    dadosDRE.receitas.linhas.forEach((_, idx) => {
      novos[`receita-${idx}`] = true;
    });
    dadosDRE.despesas.linhas.forEach((_, idx) => {
      novos[`despesa-${idx}`] = true;
    });
    setGruposExpandidos(novos);
  }, [dadosDRE]);

  const toggleGrupo = (grupoKey) => {
    setGruposExpandidos((prev) => ({
      ...prev,
      [grupoKey]: !prev[grupoKey],
    }));
  };

  if (!quantidadeMeses) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-light-border dark:border-dark-border overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="bg-light-bg-secondary dark:bg-dark-bg-tertiary border-b border-light-border dark:border-dark-border">
            <th className="sticky left-0 bg-light-bg-secondary dark:bg-dark-bg-tertiary px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 min-w-[220px] z-10">
              Categoria
            </th>
            {dadosDRE.meses.map((mes) => (
              <th key={mes} className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300 min-w-[100px]">
                {formatarMesAno(mes)}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300 min-w-[110px] bg-gray-200 dark:bg-gray-700/60">
              Total
            </th>
            <th className="px-3 py-2 text-right font-semibold text-gray-700 dark:text-gray-300 min-w-[110px] bg-gray-200 dark:bg-gray-700/60">
              Média
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-green-100/40 dark:bg-green-900/20 border-b border-light-border dark:border-dark-border">
            <td colSpan={quantidadeMeses + 3} className="px-3 py-2 font-semibold text-green-700 dark:text-green-300 tracking-wide">
              📈 RECEITAS
            </td>
          </tr>

          {(dadosDRE.receitas?.linhas ?? []).map((grupo, grupoIdx) => (
            <Fragment key={`receita-grupo-${grupoIdx}`}>
              <tr
                className="bg-green-50 dark:bg-green-900/10 border-b border-light-border/80 dark:border-dark-border/80 hover:bg-green-100/60 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
                onClick={() => toggleGrupo(`receita-${grupoIdx}`)}
              >
                <td className="sticky left-0 bg-green-50 dark:bg-green-900/10 hover:bg-green-100/60 dark:hover:bg-green-900/20 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 z-10">
                  <div className="flex items-center gap-2">
                    {gruposExpandidos[`receita-${grupoIdx}`] ? (
                      <ChevronDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    <span className="text-lg">{getIconeEmoji(grupo.icone || 'folder')}</span>
                    <span>{grupo.nome}</span>
                  </div>
                </td>
                {dadosDRE.meses.map((mes) => (
                  <td key={mes} className="px-3 py-2 text-right text-gray-800 dark:text-gray-100 font-semibold">
                    {formatar(grupo.totais.meses[mes] || 0)}
                  </td>
                ))}
                <td className="px-3 py-2 text-right font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/20">
                  {formatar(grupo.totais.total)}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/20">
                  {formatar(grupo.totais.media)}
                </td>
              </tr>

              {gruposExpandidos[`receita-${grupoIdx}`] &&
                (grupo.categorias ?? []).map((categoria) => {
                  const mediaCategoria = quantidadeMeses ? categoria.total / quantidadeMeses : 0;
                  return (
                    <tr key={categoria.id} className="border-b border-light-border/60 dark:border-dark-border/60 hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-tertiary/40">
                      <td className="sticky left-0 bg-white dark:bg-dark-bg-secondary hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-tertiary/40 px-3 py-2 pl-10 text-gray-600 dark:text-gray-300 z-10">
                        <span className="text-base mr-2">{getIconeEmoji(categoria.icone)}</span>
                        {categoria.nome}
                      </td>
                      {dadosDRE.meses.map((mes) => (
                        <td key={mes} className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">
                          {formatar(categoria.meses[mes] || 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/30">
                        {formatar(categoria.total)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30">
                        {formatar(mediaCategoria)}
                      </td>
                    </tr>
                  );
                })}
            </Fragment>
          ))}

          <tr className="bg-green-100/70 dark:bg-green-900/25 border-y border-green-300 dark:border-green-700 font-semibold">
            <td className="sticky left-0 bg-green-100/70 dark:bg-green-900/25 px-3 py-2 text-green-900 dark:text-green-100 z-10">
              {dadosDRE.receitas?.totais?.label}
            </td>
            {dadosDRE.meses.map((mes) => (
              <td key={mes} className="px-3 py-2 text-right text-green-700 dark:text-green-200">
                {formatar(dadosDRE.receitas?.totais?.meses?.[mes] || 0)}
              </td>
            ))}
            <td className="px-3 py-2 text-right text-green-800 dark:text-green-100 bg-green-200 dark:bg-green-700/50">
              {formatar(dadosDRE.receitas?.totais?.total)}
            </td>
            <td className="px-3 py-2 text-right text-green-700 dark:text-green-200 bg-green-200 dark:bg-green-700/50">
              {formatar(dadosDRE.receitas?.totais?.media)}
            </td>
          </tr>

          <tr className="h-3" />

          <tr className="bg-red-100/40 dark:bg-red-900/20 border-b border-light-border dark:border-dark-border">
            <td colSpan={quantidadeMeses + 3} className="px-3 py-2 font-semibold text-red-700 dark:text-red-300 tracking-wide">
              📉 DESPESAS
            </td>
          </tr>

          {(dadosDRE.despesas?.linhas ?? []).map((grupo, grupoIdx) => (
            <Fragment key={`despesa-grupo-${grupoIdx}`}>
              <tr
                className="bg-red-50 dark:bg-red-900/10 border-b border-light-border/80 dark:border-dark-border/80 hover:bg-red-100/60 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                onClick={() => toggleGrupo(`despesa-${grupoIdx}`)}
              >
                <td className="sticky left-0 bg-red-50 dark:bg-red-900/10 hover:bg-red-100/60 dark:hover:bg-red-900/20 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 z-10">
                  <div className="flex items-center gap-2">
                    {gruposExpandidos[`despesa-${grupoIdx}`] ? (
                      <ChevronDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="text-lg">{getIconeEmoji(grupo.icone || 'folder')}</span>
                    <span>{grupo.nome}</span>
                  </div>
                </td>
                {dadosDRE.meses.map((mes) => (
                  <td key={mes} className="px-3 py-2 text-right text-gray-900 dark:text-gray-100 font-semibold">
                    {formatar(grupo.totais.meses[mes] || 0)}
                  </td>
                ))}
                <td className="px-3 py-2 text-right font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20">
                  {formatar(grupo.totais.total)}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/20">
                  {formatar(grupo.totais.media)}
                </td>
              </tr>

              {gruposExpandidos[`despesa-${grupoIdx}`] &&
                (grupo.categorias ?? []).map((categoria) => {
                  const mediaCategoria = quantidadeMeses ? categoria.total / quantidadeMeses : 0;
                  return (
                    <tr key={categoria.id} className="border-b border-light-border/60 dark:border-dark-border/60 hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-tertiary/40">
                      <td className="sticky left-0 bg-white dark:bg-dark-bg-secondary hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-tertiary/40 px-3 py-2 pl-10 text-gray-600 dark:text-gray-300 z-10">
                        <span className="text-base mr-2">{getIconeEmoji(categoria.icone)}</span>
                        {categoria.nome}
                      </td>
                      {dadosDRE.meses.map((mes) => (
                        <td key={mes} className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">
                          {formatar(categoria.meses[mes] || 0)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/30">
                        {formatar(categoria.total)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/30">
                        {formatar(mediaCategoria)}
                      </td>
                    </tr>
                  );
                })}
            </Fragment>
          ))}

          <tr className="bg-red-100/70 dark:bg-red-900/25 border-y border-red-300 dark:border-red-700 font-semibold">
            <td className="sticky left-0 bg-red-100/70 dark:bg-red-900/25 px-3 py-2 text-red-900 dark:text-red-50 z-10">
              {dadosDRE.despesas?.totais?.label}
            </td>
            {dadosDRE.meses.map((mes) => (
              <td key={mes} className="px-3 py-2 text-right text-red-700 dark:text-red-200">
                {formatar(dadosDRE.despesas?.totais?.meses?.[mes] || 0)}
              </td>
            ))}
            <td className="px-3 py-2 text-right text-red-800 dark:text-red-100 bg-red-200 dark:bg-red-700/50">
              {formatar(dadosDRE.despesas?.totais?.total)}
            </td>
            <td className="px-3 py-2 text-right text-red-700 dark:text-red-200 bg-red-200 dark:bg-red-700/50">
              {formatar(dadosDRE.despesas?.totais?.media)}
            </td>
          </tr>

          <tr className="h-3" />

          <tr className="bg-blue-100/60 dark:bg-blue-900/20 border-y border-blue-300 dark:border-blue-700 font-semibold text-base sm:text-lg">
            <td className="sticky left-0 bg-blue-100/60 dark:bg-blue-900/20 px-3 py-4 text-blue-900 dark:text-blue-50 z-10">
              💰 {dadosDRE.resultado_liquido?.label}
            </td>
            {dadosDRE.meses.map((mes) => {
              const valor = dadosDRE.resultado_liquido?.meses?.[mes] || 0;
              return (
                <td
                  key={mes}
                  className={`px-4 py-4 text-right font-bold ${
                    valor >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {formatar(valor)}
                </td>
              );
            })}
            <td
              className={`px-4 py-4 text-right font-bold bg-blue-200 dark:bg-blue-700/50 ${
                (dadosDRE.resultado_liquido?.total ?? 0) >= 0
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {formatar(dadosDRE.resultado_liquido?.total)}
            </td>
            <td
              className={`px-4 py-4 text-right font-bold bg-blue-200 dark:bg-blue-700/50 ${
                (dadosDRE.resultado_liquido?.media ?? 0) >= 0
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {formatar(dadosDRE.resultado_liquido?.media)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

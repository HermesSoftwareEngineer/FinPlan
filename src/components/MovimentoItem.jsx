import { useState } from "react";

const getIconeEmoji = (iconeValue) => {

  const icones = {
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
  return icones[iconeValue] || '📂';
};

export default function MovimentoItem({ movimento, getTipoAccent, getTipoIcon, getTipoColor, formatarValor, getNomeCategoria, getNomeConta, handleTogglePago, handleEdit, getNomeIconeCategoria }) {
  return (
    <article
      key={movimento.id}
      className="flex w-full items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-light-bg-secondary/60 dark:hover:bg-dark-bg-tertiary/60"
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${getTipoAccent(movimento.tipo)}`}> 
          {getIconeEmoji(getNomeIconeCategoria(movimento.categoria_id))}
        </span>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-light-text dark:text-dark-text">
              {movimento.descricao}
            </p>
            {movimento.origem === 'fatura' && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                Fatura
              </span>
            )}
            {movimento.parcelado && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                Parcela {movimento.numero_parcela}/{movimento.total_parcelas}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
            <span>{getNomeCategoria(movimento.categoria_id)}</span>
            <span>{getNomeConta(movimento.conta_id) || 'Sem conta'}</span>
          </div>
          {movimento.observacao && (
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              {movimento.observacao}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-3">
        <span className={`text-sm font-semibold ${getTipoColor(movimento.tipo)}`}>
          {formatarValor(movimento.valor, movimento.tipo)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTogglePago(movimento)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              movimento.pago
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
            }`}
            title={movimento.origem === 'fatura' ? 'Ver fatura' : 'Alterar status'}
          >
            {movimento.pago ? 'Pago' : 'Pendente'}
          </button>
          <button
            onClick={() => handleEdit(movimento)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-light-border text-secondary-600 transition hover:bg-light-bg-secondary dark:border-dark-border dark:text-secondary-300 dark:hover:bg-dark-bg-tertiary"
            title={movimento.origem === 'fatura' ? 'Ver fatura' : 'Editar'}
          >
            {movimento.origem === 'fatura' ? '👁️' : '✏️'}
          </button>
        </div>
      </div>
    </article>
  );
}

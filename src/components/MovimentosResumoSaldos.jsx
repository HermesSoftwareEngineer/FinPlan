export default function MovimentosResumoSaldos({ dadosMovimentos, formatarValor }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
        <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
          Saldo inicial
        </p>
        <p className="mt-2 text-lg font-semibold text-light-text dark:text-dark-text">
          {formatarValor(dadosMovimentos.saldo_inicial || 0, 'receita')}
        </p>
      </article>
      <article className="rounded-2xl border border-light-border/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80">
        <p className="text-xs uppercase tracking-wide text-light-text-secondary dark:text-dark-text-secondary">
          Saldo real
        </p>
        <p className="mt-2 text-lg font-semibold text-green-600 dark:text-green-400">
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
          Diferença
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
  );
}

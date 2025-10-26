import MovimentoItem from './MovimentoItem';

export default function MovimentosDiaSection({ dia, index, formatarDataCompleta, getTipoAccent, getTipoIcon, getTipoColor, formatarValor, getNomeCategoria, getNomeConta, handleTogglePago, handleEdit, getNomeIconeCategoria }) {
  const movimentosDoDia = dia.movimentos || [];
  if (movimentosDoDia.length === 0) return null;
  const key = dia.data || `sem-data-${index}`;
  const tituloDia = dia.data ? formatarDataCompleta(dia.data) : 'Movimentos';
  return (
    <section
      key={key}
  className="rounded-3xl border border-light-border/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-dark-border/60 dark:bg-dark-bg-secondary/80 max-w-2xl mx-auto"
      style={{ marginBottom: 0 }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-light-border/60 px-4 py-4 dark:border-dark-border/60">
        <div className="flex items-center gap-3 text-sm font-semibold text-light-text dark:text-dark-text">
          <span className="text-lg">📅</span>
          <span>{tituloDia}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {dia.saldo_real !== undefined && (
            <span className="rounded-full border border-light-border/80 px-3 py-1 dark:border-dark-border/80">
              Saldo real {formatarValor(dia.saldo_real, 'receita')}
            </span>
          )}
          {dia.saldo_previsto !== undefined && (
            <span className="rounded-full border border-light-border/80 px-3 py-1 dark:border-dark-border/80">
              Previsto {formatarValor(dia.saldo_previsto, 'receita')}
            </span>
          )}
        </div>
      </header>
      <div className="divide-y divide-light-border/60 dark:divide-dark-border/60">
        {movimentosDoDia.map((movimento) => (
          <MovimentoItem
            key={movimento.id}
            movimento={movimento}
            getTipoAccent={getTipoAccent}
            getTipoIcon={getTipoIcon}
            getTipoColor={getTipoColor}
            formatarValor={formatarValor}
            getNomeCategoria={getNomeCategoria}
            getNomeConta={getNomeConta}
            handleTogglePago={handleTogglePago}
            handleEdit={handleEdit}
            getNomeIconeCategoria={getNomeIconeCategoria}
          />
        ))}
      </div>
    </section>
  );
}

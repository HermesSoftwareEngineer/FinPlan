import MovimentosDiaSection from './MovimentosDiaSection';

export default function MovimentosLista({ dadosMovimentos, formatarDataCompleta, getTipoAccent, getTipoIcon, getTipoColor, formatarValor, getNomeCategoria, getNomeConta, handleTogglePago, handleEdit, getNomeIconeCategoria }) {
  const semMovimentos =
    !dadosMovimentos ||
    !dadosMovimentos.dias ||
    dadosMovimentos.dias.length === 0 ||
    dadosMovimentos.dias.every((dia) => !dia.movimentos || dia.movimentos.length === 0);

  if (semMovimentos) {
    return (
      <div className="rounded-3xl border border-dashed border-light-border bg-white/70 p-12 text-center shadow-sm dark:border-dark-border dark:bg-dark-bg-secondary/70">
        <div className="mb-4 text-5xl">�</div>
        <h3 className="mb-2 text-lg font-semibold text-light-text dark:text-dark-text">
          Nenhum movimento por aqui
        </h3>
        <p className="mb-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          Adicione sua primeira receita ou despesa para começar a acompanhar o fluxo.
        </p>
        <button
          onClick={handleEdit}
          className="rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
        >
          Novo movimento
        </button>
      </div>
    );
  }

  const dias = dadosMovimentos.dias || [];
  return (
    <div className="space-y-6">
      {dias.map((dia, index) => (
        <MovimentosDiaSection
          key={dia.data || `sem-data-${index}`}
          dia={dia}
          index={index}
          formatarDataCompleta={formatarDataCompleta}
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
  );
}

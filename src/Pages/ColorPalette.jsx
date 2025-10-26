function ColorPalette() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">
          Paleta de Cores - FinPlan
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-12">
          Sistema de cores para tema claro e escuro
        </p>

        {/* Primary - Verde Financeiro */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            Primary - Verde Financeiro
          </h2>
          <div className="grid grid-cols-11 gap-2">
            <div className="bg-primary-50 dark:bg-primary-950 p-4 rounded text-center">
              <div className="text-xs font-mono text-light-text dark:text-dark-text">50</div>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded text-center">
              <div className="text-xs font-mono text-light-text dark:text-dark-text">100</div>
            </div>
            <div className="bg-primary-200 dark:bg-primary-800 p-4 rounded text-center">
              <div className="text-xs font-mono text-light-text dark:text-dark-text">200</div>
            </div>
            <div className="bg-primary-300 dark:bg-primary-700 p-4 rounded text-center">
              <div className="text-xs font-mono text-light-text dark:text-dark-text">300</div>
            </div>
            <div className="bg-primary-400 dark:bg-primary-600 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">400</div>
            </div>
            <div className="bg-primary-500 p-4 rounded text-center ring-2 ring-offset-2 ring-primary-500">
              <div className="text-xs font-mono text-white font-bold">500</div>
            </div>
            <div className="bg-primary-600 dark:bg-primary-400 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">600</div>
            </div>
            <div className="bg-primary-700 dark:bg-primary-300 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">700</div>
            </div>
            <div className="bg-primary-800 dark:bg-primary-200 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">800</div>
            </div>
            <div className="bg-primary-900 dark:bg-primary-100 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">900</div>
            </div>
            <div className="bg-primary-950 dark:bg-primary-50 p-4 rounded text-center">
              <div className="text-xs font-mono text-white">950</div>
            </div>
          </div>
        </section>

        {/* Secondary - Azul */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            Secondary - Azul Confiança
          </h2>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`bg-secondary-${shade} p-4 rounded text-center ${
                  shade === 500 ? 'ring-2 ring-offset-2 ring-secondary-500' : ''
                }`}
              >
                <div className={`text-xs font-mono ${shade >= 400 ? 'text-white' : 'text-light-text dark:text-dark-text'} ${shade === 500 ? 'font-bold' : ''}`}>
                  {shade}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accent - Esmeralda */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            Accent - Verde Esmeralda
          </h2>
          <div className="grid grid-cols-11 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div
                key={shade}
                className={`bg-accent-${shade} p-4 rounded text-center ${
                  shade === 500 ? 'ring-2 ring-offset-2 ring-accent-500' : ''
                }`}
              >
                <div className={`text-xs font-mono ${shade >= 400 ? 'text-white' : 'text-light-text dark:text-dark-text'} ${shade === 500 ? 'font-bold' : ''}`}>
                  {shade}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cores Semânticas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            Cores Semânticas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-success-500 p-6 rounded-lg text-white text-center">
              <div className="text-3xl mb-2">✓</div>
              <div className="font-semibold">Success</div>
              <div className="text-sm opacity-90">Receitas e ganhos</div>
            </div>
            <div className="bg-danger-500 p-6 rounded-lg text-white text-center">
              <div className="text-3xl mb-2">!</div>
              <div className="font-semibold">Danger</div>
              <div className="text-sm opacity-90">Despesas e alertas</div>
            </div>
            <div className="bg-warning-500 p-6 rounded-lg text-white text-center">
              <div className="text-3xl mb-2">⚠</div>
              <div className="font-semibold">Warning</div>
              <div className="text-sm opacity-90">Avisos e pendências</div>
            </div>
          </div>
        </section>

        {/* Componentes de Exemplo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4">
            Componentes de Exemplo
          </h2>
          
          {/* Botões */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Botões</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition">
                Botão Primary
              </button>
              <button className="px-6 py-3 bg-secondary-600 text-white rounded-lg font-semibold shadow-lg hover:bg-secondary-700 transition">
                Botão Secondary
              </button>
              <button className="px-6 py-3 bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-lg font-semibold hover:border-primary-500 transition">
                Botão Outline
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Cards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg border border-light-border dark:border-dark-border">
                <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">Receitas</div>
                <div className="text-2xl font-bold text-success-600 dark:text-success-400">R$ 5.230,00</div>
              </div>
              <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg border border-light-border dark:border-dark-border">
                <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">Despesas</div>
                <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">R$ 3.120,00</div>
              </div>
              <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg border border-light-border dark:border-dark-border">
                <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">Saldo</div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">R$ 2.110,00</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-full text-sm font-medium">
                Pago
              </span>
              <span className="px-3 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 rounded-full text-sm font-medium">
                Pendente
              </span>
              <span className="px-3 py-1 bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300 rounded-full text-sm font-medium">
                Atrasado
              </span>
              <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-medium">
                Agendado
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ColorPalette;

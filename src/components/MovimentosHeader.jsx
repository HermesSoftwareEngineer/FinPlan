import ThemeToggle from './ThemeToggle';

export default function MovimentosHeader({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
              Movimentos
            </h1>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Gerencie suas receitas, despesas e transferências
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

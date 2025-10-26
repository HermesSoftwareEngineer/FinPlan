import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg-tertiary">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm shadow-sm border-b border-light-border dark:border-dark-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                FinPlan
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Link to="/login" className="px-4 py-2 text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400 transition font-medium">
                Login
              </Link>
              <Link to="/cadastrar" className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg transition shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 font-medium">
                Cadastrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full">
            <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
              ✨ Planejamento Financeiro Inteligente
            </span>
          </div>
          <h2 className="text-5xl font-bold text-light-text dark:text-dark-text mb-6">
            Controle suas{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              finanças
            </span>
            <br />
            de forma inteligente
          </h2>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
            Organize seus gastos, planeje seu futuro e alcance seus objetivos financeiros com o FinPlan
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/cadastrar" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-lg rounded-lg transition shadow-xl shadow-primary-500/30 dark:shadow-primary-500/20 font-semibold">
              Começar agora
            </Link>
            <button className="px-8 py-4 bg-white dark:bg-dark-bg-secondary text-light-text dark:text-dark-text text-lg rounded-lg transition shadow-lg border-2 border-light-border dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 font-semibold">
              Saiba mais
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition group">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-3">
              Controle Total
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Visualize todos os seus gastos e receitas em um único lugar com dashboards interativos
            </p>
          </div>

          <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border hover:shadow-xl hover:border-secondary-300 dark:hover:border-secondary-700 transition group">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-primary-100 dark:from-secondary-900/30 dark:to-primary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-3">
              Metas Financeiras
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Defina objetivos e acompanhe seu progresso em tempo real com análises detalhadas
            </p>
          </div>

          <div className="bg-white dark:bg-dark-bg-secondary p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border hover:shadow-xl hover:border-accent-300 dark:hover:border-accent-700 transition group">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-secondary-100 dark:from-accent-900/30 dark:to-secondary-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-3">
              Insights Inteligentes
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Receba análises e sugestões personalizadas para melhorar suas finanças
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-700 dark:to-accent-700 rounded-2xl p-12 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">R$ 1M+</div>
              <div className="text-primary-100 dark:text-primary-200">Gerenciados na plataforma</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100 dark:text-primary-200">Usuários ativos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-100 dark:text-primary-200">Satisfação dos clientes</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

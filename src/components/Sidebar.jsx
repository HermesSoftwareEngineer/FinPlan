import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/movimentos',
      label: 'Movimentos',
      icon: '💸',
    },
    {
      path: '/contas',
      label: 'Contas',
      icon: '💰',
    },
    {
      path: '/cartoes',
      label: 'Cartões',
      icon: '💳',
    },
    // {
    //   path: '/faturas',
    //   label: 'Faturas',
    //   icon: '🧾',
    // },
    {
      path: '/categorias',
      label: 'Categorias',
      icon: '🏷️',
    },
    {
      path: '/grupos-categorias',
      label: 'Grupos',
      icon: '📁',
    },
    {
      path: '/dre',
      label: 'DRE',
      icon: '📈',
    },
    // {
    //   path: '/metas',
    //   label: 'Metas',
    //   icon: '🎯',
    // },
    // {
    //   path: '/relatorios',
    //   label: 'Relatórios',
    //   icon: '📋',
    // },
    // {
    //   path: '/configuracoes',
    //   label: 'Configurações',
    //   icon: '⚙️',
    // },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-white dark:bg-dark-bg-secondary border-r border-light-border dark:border-dark-border w-64 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 p-6 border-b border-light-border dark:border-dark-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              FinPlan
            </h1>
          </Link>
          
          {/* Botão fechar mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                // Fecha sidebar no mobile ao clicar
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary hover:text-light-text dark:hover:text-dark-text'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3 p-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg mb-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white dark:border-dark-bg-secondary rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-light-text dark:text-dark-text truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                {user?.email || 'email@exemplo.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

import { useState } from 'react';
import { Link } from 'react-router-dom';

function Cadastrar() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpa erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Cadastro:', formData);
      // Aqui você implementará a lógica de cadastro
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg-tertiary flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              FinPlan
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
            Crie sua conta
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Comece a organizar suas finanças gratuitamente
          </p>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-xl border border-light-border dark:border-dark-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome Completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border ${
                  errors.name ? 'border-danger-500' : 'border-light-border dark:border-dark-border'
                } rounded-lg text-light-text dark:text-dark-text placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
                placeholder="João Silva"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border ${
                  errors.email ? 'border-danger-500' : 'border-light-border dark:border-dark-border'
                } rounded-lg text-light-text dark:text-dark-text placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border ${
                  errors.password ? 'border-danger-500' : 'border-light-border dark:border-dark-border'
                } rounded-lg text-light-text dark:text-dark-text placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border ${
                  errors.confirmPassword ? 'border-danger-500' : 'border-light-border dark:border-dark-border'
                } rounded-lg text-light-text dark:text-dark-text placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Termos e Condições */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className={`mt-1 w-4 h-4 text-primary-600 bg-light-bg-secondary dark:bg-dark-bg-tertiary border-light-border dark:border-dark-border rounded focus:ring-2 focus:ring-primary-500 ${
                    errors.termsAccepted ? 'border-danger-500' : ''
                  }`}
                />
                <label htmlFor="termsAccepted" className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Eu aceito os{' '}
                  <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition">
                    Termos de Uso
                  </a>
                  {' '}e a{' '}
                  <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition">
                    Política de Privacidade
                  </a>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.termsAccepted}</p>
              )}
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-semibold shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20 transition-all transform hover:scale-[1.02]"
            >
              Criar conta
            </button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-border dark:border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                  Ou cadastre-se com
                </span>
              </div>
            </div>

            {/* Cadastro Social */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-dark-bg-tertiary border-2 border-light-border dark:border-dark-border rounded-lg font-medium text-light-text dark:text-dark-text hover:border-primary-500 dark:hover:border-primary-500 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-dark-bg-tertiary border-2 border-light-border dark:border-dark-border rounded-lg font-medium text-light-text dark:text-dark-text hover:border-primary-500 dark:hover:border-primary-500 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>

        {/* Link para Login */}
        <p className="text-center mt-6 text-light-text-secondary dark:text-dark-text-secondary">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastrar;

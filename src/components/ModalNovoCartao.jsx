import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { contaService } from '../services';

const ModalNovoCartao = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: '',
    limite: '',
    dia_fechamento: '',
    dia_vencimento: '',
    bandeira: '',
    ultimos_digitos: '',
    conta_id: '',
    cor: '#8B10AE',
    ativo: true
  });

  const [contas, setContas] = useState([]);
  const [loadingContas, setLoadingContas] = useState(false);
  const [loading, setLoading] = useState(false);

  const bandeiras = [
    'Visa',
    'Mastercard',
    'Elo',
    'American Express',
    'Hipercard',
    'Diners Club',
    'Discover',
    'Outra'
  ];

  const cores = [
    { nome: 'Roxo', valor: '#8B10AE' },
    { nome: 'Azul', valor: '#1E40AF' },
    { nome: 'Verde', valor: '#059669' },
    { nome: 'Vermelho', valor: '#DC2626' },
    { nome: 'Laranja', valor: '#EA580C' },
    { nome: 'Rosa', valor: '#DB2777' },
    { nome: 'Cinza', valor: '#4B5563' },
    { nome: 'Preto', valor: '#1F2937' }
  ];

  // Carregar contas quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      carregarContas();
    }
  }, [isOpen]);

  const carregarContas = async () => {
    try {
      setLoadingContas(true);
      const data = await contaService.listar();
      const contasArray = data.contas || data;
      setContas(Array.isArray(contasArray) ? contasArray : []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      alert('Erro ao carregar contas. Por favor, tente novamente.');
    } finally {
      setLoadingContas(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const dados = {
        ...formData,
        limite: parseFloat(formData.limite),
        dia_fechamento: parseInt(formData.dia_fechamento),
        dia_vencimento: parseInt(formData.dia_vencimento),
        conta_id: parseInt(formData.conta_id)
      };
      
      await onSubmit(dados);
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        limite: '',
        dia_fechamento: '',
        dia_vencimento: '',
        bandeira: '',
        ultimos_digitos: '',
        conta_id: '',
        cor: '#8B10AE',
        ativo: true
      });
      // O fechamento do modal é controlado pelo componente pai
    } catch (error) {
      console.error('Erro ao criar cartão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      limite: '',
      dia_fechamento: '',
      dia_vencimento: '',
      bandeira: '',
      ultimos_digitos: '',
      conta_id: '',
      cor: '#8B10AE',
      ativo: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Novo Cartão de Crédito
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Informações Básicas
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Nome do Cartão *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="Ex: Nubank, Inter, C6 Bank"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Bandeira *
                </label>
                <select
                  name="bandeira"
                  value={formData.bandeira}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="">Selecione...</option>
                  {bandeiras.map(bandeira => (
                    <option key={bandeira} value={bandeira}>{bandeira}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Últimos 4 Dígitos *
                </label>
                <input
                  type="text"
                  name="ultimos_digitos"
                  value={formData.ultimos_digitos}
                  onChange={handleChange}
                  required
                  maxLength="4"
                  pattern="[0-9]{4}"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Limite de Crédito (R$) *
              </label>
              <input
                type="number"
                name="limite"
                value={formData.limite}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Conta de Débito Principal *
              </label>
              <select
                name="conta_id"
                value={formData.conta_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                disabled={loadingContas}
              >
                <option value="">
                  {loadingContas ? 'Carregando contas...' : 'Selecione a conta...'}
                </option>
                {contas.map(conta => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome} - {conta.tipo} {conta.saldo !== undefined ? `(R$ ${conta.saldo.toFixed(2)})` : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                Conta utilizada para débito das faturas do cartão
              </p>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Datas de Faturamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Dia de Fechamento *
                </label>
                <input
                  type="number"
                  name="dia_fechamento"
                  value={formData.dia_fechamento}
                  onChange={handleChange}
                  required
                  min="1"
                  max="31"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="15"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                  Dia do mês (1-31)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Dia de Vencimento *
                </label>
                <input
                  type="number"
                  name="dia_vencimento"
                  value={formData.dia_vencimento}
                  onChange={handleChange}
                  required
                  min="1"
                  max="31"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="25"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                  Dia do mês (1-31)
                </p>
              </div>
            </div>
          </div>

          {/* Personalização */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Personalização
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Cor do Cartão
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {cores.map(cor => (
                  <button
                    key={cor.valor}
                    type="button"
                    onClick={() => setFormData({ ...formData, cor: cor.valor })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      formData.cor === cor.valor
                        ? 'border-green-500 dark:border-green-600 scale-110 ring-2 ring-green-500/50'
                        : 'border-gray-300 dark:border-slate-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: cor.valor }}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                Cartão Ativo
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Cartão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovoCartao;

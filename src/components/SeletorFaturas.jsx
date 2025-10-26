import { useState, useEffect } from 'react';
import { faturaService } from '../services';

/**
 * Componente SeletorFaturas
 * 
 * Seletor inteligente de faturas que busca automaticamente as faturas relevantes
 * de um cartão (2 anteriores + selecionada + 3 futuras)
 * 
 * @param {object} props
 * @param {number} props.cartaoId - ID do cartão
 * @param {number} props.faturaIdAtual - ID da fatura selecionada para usar como referência (opcional)
 * @param {number} props.value - Valor selecionado
 * @param {function} props.onChange - Callback quando o valor muda
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.className - Classes CSS adicionais
 */
export default function SeletorFaturas({ 
  cartaoId, 
  faturaIdAtual, 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  className = ''
}) {
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cartaoId) {
      carregarFaturas();
    }
  }, [cartaoId, faturaIdAtual]);

  const carregarFaturas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todas as faturas do cartão
      const faturasData = await faturaService.listarFaturas({ cartao_id: cartaoId });
      const faturasArray = Array.isArray(faturasData) ? faturasData : [];
      
      // Ordenar faturas por data (mais antiga primeiro)
      faturasArray.sort((a, b) => {
        if (a.ano_referencia !== b.ano_referencia) {
          return a.ano_referencia - b.ano_referencia;
        }
        return a.mes_referencia - b.mes_referencia;
      });
      
      // Filtrar faturas: 2 anteriores + atual + 3 futuras
      const faturasFiltradas = filtrarFaturasRelevantes(faturasArray);
      
      // Ordenar faturas filtradas por data (mais recente primeiro para exibição)
      faturasFiltradas.sort((a, b) => {
        if (a.ano_referencia !== b.ano_referencia) {
          return b.ano_referencia - a.ano_referencia;
        }
        return b.mes_referencia - a.mes_referencia;
      });
      
      setFaturas(faturasFiltradas);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      setError('Erro ao carregar faturas');
      setFaturas([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtra faturas relevantes: 2 anteriores + selecionada + 3 futuras
   * Se não houver fatura selecionada, usa o mês atual como referência
   */
  const filtrarFaturasRelevantes = (faturasArray) => {
    if (faturasArray.length === 0) return [];

    let indexReferencia;

    // Se tiver faturaIdAtual, usar ela como referência
    if (faturaIdAtual) {
      // Converter para número para garantir comparação correta
      const faturaIdNumero = parseInt(faturaIdAtual);
      indexReferencia = faturasArray.findIndex(f => f.id === faturaIdNumero);
    }

    // Se não encontrou a fatura selecionada, usar o mês atual como referência
    if (indexReferencia === undefined || indexReferencia === -1) {
      const dataAtual = new Date();
      const mesAtual = dataAtual.getMonth() + 1;
      const anoAtual = dataAtual.getFullYear();
      
      indexReferencia = faturasArray.findIndex(
        f => f.mes_referencia === mesAtual && f.ano_referencia === anoAtual
      );
    }
    
    if (indexReferencia !== -1) {
      // Se encontrou a fatura de referência, pega 2 anteriores e 3 posteriores
      const inicio = Math.max(0, indexReferencia - 2);
      const fim = Math.min(faturasArray.length, indexReferencia + 4);
      return faturasArray.slice(inicio, fim);
    } else {
      // Se não encontrou referência, pega as 6 mais recentes
      return faturasArray.slice(-6);
    }
  };

  /**
   * Formata o nome do mês
   */
  const formatarMes = (mes, ano) => {
    const mesNome = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' });
    return mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
  };

  /**
   * Retorna o ícone/texto do status da fatura
   */
  const getStatusTexto = (status) => {
    const statusMap = {
      'paga': '✓ Paga',
      'fechada': '🔒 Fechada',
      'aberta': '📝 Aberta',
      'atrasada': '⚠️ Atrasada'
    };
    return statusMap[status] || '📝 Aberta';
  };

  /**
   * Formata o valor em reais
   */
  const formatarValor = (valor) => {
    return parseFloat(valor || 0).toFixed(2);
  };

  const baseClassName = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;

  if (error) {
    return (
      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled || loading}
      className={finalClassName}
    >
      <option value="">
        {loading ? 'Carregando faturas...' : 'Selecione a fatura'}
      </option>
      {faturas.map((fatura) => (
        <option key={fatura.id} value={fatura.id}>
          {formatarMes(fatura.mes_referencia, fatura.ano_referencia)}/{fatura.ano_referencia} - {getStatusTexto(fatura.status)} - R$ {formatarValor(fatura.valor_total)}
        </option>
      ))}
    </select>
  );
}

import { useState } from 'react';
import { calculateContingency } from '../services/contingency.service';
import { CalculationPayload, CalculationResult } from '../types/contingency.types';

export function useRiskCalculation() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (payload: CalculationPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await calculateContingency(payload);
      setResult(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { calculate, result, loading, error };
}

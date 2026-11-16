import { CalculationPayload, CalculationResult } from '../types/contingency.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const calculateContingency = async (payload: CalculationPayload): Promise<CalculationResult> => {
  const response = await fetch(`${API_URL}/contingency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error('Error al calcular la contingencia');
  }
  
  return response.json();
};

import { RiskConfig } from '../types/risk-config.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const getRiskConfig = async (): Promise<RiskConfig> => {
  const response = await fetch(`${API_URL}/risk-config`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener la configuración de riesgo');
  return response.json();
};

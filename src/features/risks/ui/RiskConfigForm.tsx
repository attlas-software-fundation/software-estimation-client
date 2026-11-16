'use client';
import { useEffect, useState } from 'react';
import { RiskLevelSelector } from '@/features/ui/RiskLevelSelector';
import { getRiskConfig, updateRiskConfig } from '../services/risk-config.service';
import { RiskConfig } from '../types/risk-config.types';
import { riskConfigSchema } from '../schemas/risk.schema';
import ContingencyInput from './ContingencyInput';

export default function RiskConfigForm() {
  const [config, setConfig] = useState<RiskConfig>({ level: 'BAJO', percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getRiskConfig()
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = riskConfigSchema.safeParse(config);
    
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }
    setErrorMsg(null);

    try {
      await updateRiskConfig(config);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración');
    }
  };

  if (loading) return <div>Cargando configuración...</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Configuración de Riesgo</h2>
      
      <RiskLevelSelector 
        currentLevel={config.level} 
        onLevelChange={(level) => setConfig({ ...config, level })} 
        disabled={false} 
      />
      
      <ContingencyInput 
        value={config.percentage} 
        onChange={(percentage) => setConfig({ ...config, percentage })} 
      />
      
      {errorMsg && <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>}
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Configuración
      </button>
    </form>
  );
}

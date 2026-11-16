'use client';
import { useState } from 'react';
import { RiskLevelSelector } from '@/features/ui/RiskLevelSelector';
import { RiskConfig } from '../types/risk-config.types';
import ContingencyInput from './ContingencyInput';

export default function RiskConfigForm() {
  const [config, setConfig] = useState<RiskConfig>({ level: 'BAJO', percentage: 0 });
  const [loading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario enviado:', config);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Configuración de Riesgo</h2>
      
      <RiskLevelSelector 
        currentLevel={config.level} 
        onLevelChange={(level) => setConfig({ ...config, level })} 
        disabled={loading} 
      />
      
      <ContingencyInput 
        value={config.percentage} 
        onChange={(percentage) => setConfig({ ...config, percentage })} 
        disabled={loading}
      />
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Configuración
      </button>
    </form>
  );
}

import ComparisonCard from './ComparisonCard';
import { CalculationResult } from '../types/contingency.types';

interface Props {
  baseCost: number;
  baseTime: number;
  result: CalculationResult;
}

export default function ComparisonView({ baseCost, baseTime, result }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <ComparisonCard title="Costo" baseValue={baseCost} finalValue={result.totalCost} unit="USD" />
      <ComparisonCard title="Tiempo" baseValue={baseTime} finalValue={result.totalTime} unit="días" />
    </div>
  );
}

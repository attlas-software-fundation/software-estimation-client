interface Props {
  title: string;
  baseValue: number;
  finalValue: number;
  unit: string;
}

export default function ComparisonCard({ title, baseValue, finalValue, unit }: Props) {
  const difference = finalValue - baseValue;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-500">Estimación Base:</span>
        <span className="font-semibold">{baseValue} {unit}</span>
      </div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-500">Con Contingencia:</span>
        <span className="font-semibold text-blue-600">{finalValue} {unit}</span>
      </div>
      <div className="flex justify-between items-center border-t pt-2 mt-2">
        <span className="text-gray-700 font-medium">Diferencia:</span>
        <span className="font-bold text-red-500">+{difference} {unit}</span>
      </div>
    </div>
  );
}

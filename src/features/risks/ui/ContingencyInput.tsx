interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function ContingencyInput({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-700">Porcentaje de Contingencia (%)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
    </div>
  );
}

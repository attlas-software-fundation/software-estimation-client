export type RiskLevel = 'BAJO' | 'MEDIO' | 'ALTO';

export interface RiskConfig {
  level: RiskLevel;
  percentage: number;
}

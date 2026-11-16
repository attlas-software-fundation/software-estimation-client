import { RiskLevel } from './risk-config.types';

export interface CalculationPayload {
  baseCost: number;
  baseTime: number;
  level: RiskLevel;
  percentage: number;
}

export interface CalculationResult {
  totalCost: number;
  totalTime: number;
  contingencyCost: number;
  contingencyTime: number;
}

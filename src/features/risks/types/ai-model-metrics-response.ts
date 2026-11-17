export type AiRegressionMetric = {
  rmse: number
  mae: number
  r2: number
}

export type AiClassificationMetric = {
  is_ensemble: boolean
  accuracy: number
  precision_weighted: number
  recall_weighted: number
  f1_weighted: number
  roc_auc_ovr: number
}

export type AiModelMetricsResponse = {
  selected_regression_model: string
  selected_classification_model: string
  regression_comparison: Record<string, AiRegressionMetric>
  classification_comparison: Record<string, AiClassificationMetric>
  dataset_rows: number
}

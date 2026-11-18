export type SortDirection = "ASC" | "DESC"

export type FilterOperatorValue =
  "EQ" | "NE" | "LK" | "IN" | "GT" | "LT" | "GE" | "LE" | "BT"

export const FilterOperator: Record<FilterOperatorValue, FilterOperatorValue> =
  {
    EQ: "EQ",
    NE: "NE",
    LK: "LK",
    IN: "IN",
    GT: "GT",
    LT: "LT",
    GE: "GE",
    LE: "LE",
    BT: "BT",
  }

export type FilterRequest = {
  key: string
  operator: FilterOperatorValue
  values: string[]
}

export type PaginationRequest = {
  orderBy: string
  pageSize: number
  pageNumber: number
  sortDirection: SortDirection
}

export type QueryRequest = {
  filters: FilterRequest[]
  pagination: PaginationRequest
}

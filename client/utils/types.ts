export interface MonthlyData {
  month: string
  revenue: number
  expenses: number
  cashFlow: number
}

export interface CashFlowData {
  companyName: string
  months: MonthlyData[]
  totalRevenue: number
  totalExpenses: number
  totalCashFlow: number
  averageMonthlyCashFlow: number
  dcfValuation: number
  multiple: number
}

export interface BalanceSheetData {
  assets: {
    cash: number
    accountsReceivable: number
    inventory: number
    equipment: number
    totalAssets: number
  }
  liabilities: {
    accountsPayable: number
    shortTermDebt: number
    longTermDebt: number
    totalLiabilities: number
  }
  equity: {
    shareholderEquity: number
    retainedEarnings: number
    totalEquity: number
  }
}

export interface ValuationMetrics {
  revenueMultiple: number
  ebitdaMultiple: number
  discountRate: number
  terminalGrowthRate: number
}

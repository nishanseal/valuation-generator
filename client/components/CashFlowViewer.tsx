'use client'

import React from 'react'
import { ArrowRight, ArrowLeft, TrendingUp, DollarSign, Calculator } from 'lucide-react'
import { CashFlowData } from '../utils/types'

interface CashFlowViewerProps {
  data: CashFlowData
  onGenerateReport: () => void
  onStartOver: () => void
}

const CashFlowViewer: React.FC<CashFlowViewerProps> = ({ data, onGenerateReport, onStartOver }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Review Cash Flow Data
        </h2>
        <p className="text-slate-400 text-lg">
          Verify your data before generating the valuation report
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(data.totalRevenue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Net Cash Flow</p>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(data.totalCashFlow)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">DCF Valuation</p>
              <p className="text-2xl font-bold gradient-text">{formatCurrency(data.dcfValuation)}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Monthly Data Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Monthly Cash Flow Analysis</h3>
          <p className="text-slate-400 mt-1">12-month cash flow projections for {data.companyName}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Month</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Revenue</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Expenses</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Net Cash Flow</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.months.map((month, index) => {
                const margin = ((month.cashFlow / month.revenue) * 100).toFixed(1)
                return (
                  <tr key={month.month} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{month.month}</td>
                    <td className="px-6 py-4 text-sm text-green-400 text-right">{formatCurrency(month.revenue)}</td>
                    <td className="px-6 py-4 text-sm text-red-400 text-right">{formatCurrency(month.expenses)}</td>
                    <td className="px-6 py-4 text-sm text-blue-400 text-right font-medium">{formatCurrency(month.cashFlow)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 text-right">{margin}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onStartOver}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Start Over</span>
        </button>

        <button
          onClick={onGenerateReport}
          className="flex items-center space-x-2 btn-gradient text-white font-medium py-3 px-8 rounded-lg"
        >
          <span>Generate PDF Report</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default CashFlowViewer

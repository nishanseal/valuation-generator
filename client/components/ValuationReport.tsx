'use client'

import React, { useState, useRef } from 'react'
import { Download, ArrowLeft } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CashFlowData, BalanceSheetData } from '../utils/types'

interface ValuationReportProps {
  data: CashFlowData
  onStartOver: () => void
}

const ValuationReport: React.FC<ValuationReportProps> = ({ data, onStartOver }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Dummy balance sheet data
  const balanceSheetData: BalanceSheetData = {
    assets: {
      cash: 250000,
      accountsReceivable: 180000,
      inventory: 120000,
      equipment: 450000,
      totalAssets: 1000000
    },
    liabilities: {
      accountsPayable: 85000,
      shortTermDebt: 150000,
      longTermDebt: 300000,
      totalLiabilities: 535000
    },
    equity: {
      shareholderEquity: 400000,
      retainedEarnings: 65000,
      totalEquity: 465000
    }
  }

  const generatePDF = async () => {
    if (!reportRef.current) return

    setIsGenerating(true)

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${data.companyName}-Valuation-Report-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Valuation Report
        </h2>
        <p className="text-slate-400 text-lg">
          Professional financial analysis and DCF valuation
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onStartOver}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>New Report</span>
        </button>

        <button
          onClick={generatePDF}
          disabled={isGenerating}
          className="flex items-center space-x-2 btn-gradient text-white font-medium py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="bg-white text-black p-8 rounded-lg space-y-8">
        {/* Report Header */}
        <div className="border-b border-gray-300 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Valuation Report</h1>
              <h2 className="text-xl font-semibold text-blue-600">{data.companyName}</h2>
              <p className="text-gray-600">12-Month Cash Flow Analysis & DCF Valuation</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Report Date: {formatDate(new Date())}</p>
              <p>Valuation Method: Discounted Cash Flow</p>
              <p>Multiple Applied: {data.multiple}x</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Executive Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Company:</span>
                <span>{data.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Analysis Period:</span>
                <span>12 Months</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Valuation Date:</span>
                <span>{formatDate(new Date())}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Revenue:</span>
                <span className="text-green-600 font-semibold">{formatCurrency(data.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Net Cash Flow:</span>
                <span className="text-blue-600 font-semibold">{formatCurrency(data.totalCashFlow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-lg">DCF Valuation:</span>
                <span className="text-lg font-bold text-purple-600">{formatCurrency(data.dcfValuation)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Monthly Cash Flow Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Month</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Revenue</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Expenses</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Cash Flow</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {data.months.map((month, index) => {
                  const margin = ((month.cashFlow / month.revenue) * 100).toFixed(1)
                  return (
                    <tr key={month.month} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{month.month}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{formatCurrency(month.revenue)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-red-600">{formatCurrency(month.expenses)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-blue-600 font-medium">{formatCurrency(month.cashFlow)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{margin}%</td>
                    </tr>
                  )
                })}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 px-4 py-2">Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{formatCurrency(data.totalRevenue)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">{formatCurrency(data.totalExpenses)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-blue-600">{formatCurrency(data.totalCashFlow)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{((data.totalCashFlow / data.totalRevenue) * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">Balance Sheet Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Assets</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cash</span>
                  <span>{formatCurrency(balanceSheetData.assets.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accounts Receivable</span>
                  <span>{formatCurrency(balanceSheetData.assets.accountsReceivable)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inventory</span>
                  <span>{formatCurrency(balanceSheetData.assets.inventory)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipment</span>
                  <span>{formatCurrency(balanceSheetData.assets.equipment)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
                  <span>Total Assets</span>
                  <span>{formatCurrency(balanceSheetData.assets.totalAssets)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Liabilities</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Accounts Payable</span>
                  <span>{formatCurrency(balanceSheetData.liabilities.accountsPayable)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Short-term Debt</span>
                  <span>{formatCurrency(balanceSheetData.liabilities.shortTermDebt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Long-term Debt</span>
                  <span>{formatCurrency(balanceSheetData.liabilities.longTermDebt)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-4">
                  <span>Total Liabilities</span>
                  <span>{formatCurrency(balanceSheetData.liabilities.totalLiabilities)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Equity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Shareholder Equity</span>
                  <span>{formatCurrency(balanceSheetData.equity.shareholderEquity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retained Earnings</span>
                  <span>{formatCurrency(balanceSheetData.equity.retainedEarnings)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-6">
                  <span>Total Equity</span>
                  <span>{formatCurrency(balanceSheetData.equity.totalEquity)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valuation Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">DCF Valuation Summary</h3>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Average Monthly Cash Flow:</span>
                  <span className="text-blue-600 font-semibold">{formatCurrency(data.averageMonthlyCashFlow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Valuation Multiple:</span>
                  <span className="text-green-600 font-semibold">{data.multiple}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Analysis Period:</span>
                  <span>12 Months</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total Cash Flow:</span>
                  <span className="font-semibold">{formatCurrency(data.totalCashFlow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cash Flow Margin:</span>
                  <span className="font-semibold">{((data.totalCashFlow / data.totalRevenue) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold">DCF Valuation:</span>
                  <span className="text-purple-600 font-bold">{formatCurrency(data.dcfValuation)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p><strong>Disclaimer:</strong> This valuation report is for sample purposes only and should not be used for actual investment decisions. The DCF valuation is based on projected cash flows and a standard {data.multiple}x multiple. Actual valuations may vary significantly based on market conditions, industry factors, and detailed financial analysis.</p>
        </div>
      </div>
    </div>
  )
}

export default ValuationReport

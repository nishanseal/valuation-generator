'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { CashFlowData, MonthlyData } from '../utils/types'

interface FileUploadProps {
  onFileProcessed: (data: CashFlowData) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const generateSampleData = (): CashFlowData => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const monthlyData: MonthlyData[] = months.map((month, index) => {
      const baseRevenue = 100000
      const seasonalFactor = 1 + (Math.sin(index * Math.PI / 6) * 0.2)
      const revenue = Math.round(baseRevenue * seasonalFactor * (1 + Math.random() * 0.1))
      const expenses = Math.round(revenue * (0.6 + Math.random() * 0.1))
      const cashFlow = revenue - expenses

      return {
        month,
        revenue,
        expenses,
        cashFlow
      }
    })

    const totalRevenue = monthlyData.reduce((sum, month) => sum + month.revenue, 0)
    const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0)
    const totalCashFlow = totalRevenue - totalExpenses
    const averageMonthlyCashFlow = totalCashFlow / 12
    const dcfValuation = Math.round(averageMonthlyCashFlow * 10)

    return {
      companyName: 'Sample Corporation',
      months: monthlyData,
      totalRevenue,
      totalExpenses,
      totalCashFlow,
      averageMonthlyCashFlow,
      dcfValuation,
      multiple: 10
    }
  }

  const handleSampleData = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const sampleData = generateSampleData()
      setUploadStatus('success')
      setTimeout(() => {
        onFileProcessed(sampleData)
      }, 500)
      setIsProcessing(false)
    }, 1000)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        handleSampleData() // For demo, always use sample data
      }
    }, []),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Upload Your Cash Flow Data
        </h2>
        <p className="text-slate-400 text-lg">
          Upload an Excel file with your cash flow projections or use our sample data
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload Area */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-blue-400 bg-blue-400/10' 
                : 'border-slate-600 hover:border-blue-400 hover:bg-blue-400/5'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
              ) : (
                <Upload className="h-16 w-16 text-blue-400 mx-auto" />
              )}
              
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="spinner mx-auto"></div>
                  <p className="text-slate-300">Processing file...</p>
                </div>
              ) : uploadStatus === 'success' ? (
                <div className="space-y-2">
                  <p className="text-green-400 font-medium">File processed successfully!</p>
                  <p className="text-slate-400 text-sm">Redirecting to review...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your Excel file here'}
                  </p>
                  <p className="text-slate-400">or click to browse</p>
                  <p className="text-slate-500 text-sm">Supports .xlsx, .xls, .csv files</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sample Data Option */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8">
          <div className="text-center space-y-6">
            <FileSpreadsheet className="h-16 w-16 text-green-400 mx-auto" />
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Try Sample Data
              </h3>
              <p className="text-slate-400">
                Test the application with pre-generated 12-month cash flow data
              </p>
            </div>

            <button
              onClick={handleSampleData}
              disabled={isProcessing}
              className="w-full btn-gradient text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Generating...' : 'Use Sample Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileUpload

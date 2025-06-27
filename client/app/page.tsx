'use client'

import React, { useState } from 'react'
import FileUpload from '../components/FileUpload'
import CashFlowViewer from '../components/CashFlowViewer'
import ValuationReport from '../components/ValuationReport'
import Header from '../components/Header'
import { CashFlowData } from '../utils/types'

export default function Home() {
  const [cashFlowData, setCashFlowData] = useState<CashFlowData | null>(null)
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'report'>('upload')

  const handleFileProcessed = (data: CashFlowData) => {
    setCashFlowData(data)
    setCurrentStep('review')
  }

  const handleGenerateReport = () => {
    setCurrentStep('report')
  }

  const handleStartOver = () => {
    setCashFlowData(null)
    setCurrentStep('upload')
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'upload' ? 'border-blue-400 bg-blue-400/20' : 'border-gray-400'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload Excel</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep !== 'upload' ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'review' ? 'text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'review' ? 'border-blue-400 bg-blue-400/20' : 'border-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Review Data</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep === 'report' ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
            
            <div className={`flex items-center ${currentStep === 'report' ? 'text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep === 'report' ? 'border-blue-400 bg-blue-400/20' : 'border-gray-400'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Generate PDF</span>
            </div>
          </div>
        </div>

        {/* Content based on current step */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'upload' && (
            <FileUpload onFileProcessed={handleFileProcessed} />
          )}
          
          {currentStep === 'review' && cashFlowData && (
            <CashFlowViewer 
              data={cashFlowData} 
              onGenerateReport={handleGenerateReport}
              onStartOver={handleStartOver}
            />
          )}
          
          {currentStep === 'report' && cashFlowData && (
            <ValuationReport 
              data={cashFlowData} 
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </main>
  )
}

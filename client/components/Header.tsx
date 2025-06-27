import React from 'react'
import { BarChart3, FileSpreadsheet } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-800/90 via-blue-800/90 to-slate-800/90 backdrop-blur-sm border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-slate-800 p-3 rounded-lg border border-blue-500/30">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Cash Flow Valuation
              </h1>
              <p className="text-slate-400 text-sm">
                Professional financial analysis & reporting
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <FileSpreadsheet className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Excel to PDF Converter</span>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white text-sm font-medium">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

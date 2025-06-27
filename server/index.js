const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const multer = require('multer')
const XLSX = require('xlsx')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'))
    }
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cash Flow Valuation API is running',
    timestamp: new Date().toISOString()
  })
})

// File upload and processing endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Process the Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // For demo purposes, return sample data
    // In a real implementation, you would parse the actual Excel data
    const sampleData = generateSampleData()

    res.json({
      success: true,
      data: sampleData,
      message: 'File processed successfully'
    })

  } catch (error) {
    console.error('Error processing file:', error)
    res.status(500).json({ 
      error: 'Failed to process file',
      message: error.message 
    })
  }
})

// Generate sample data endpoint
app.get('/api/sample-data', (req, res) => {
  try {
    const sampleData = generateSampleData()
    res.json({
      success: true,
      data: sampleData,
      message: 'Sample data generated successfully'
    })
  } catch (error) {
    console.error('Error generating sample data:', error)
    res.status(500).json({ 
      error: 'Failed to generate sample data',
      message: error.message 
    })
  }
})

// Generate sample cash flow data
function generateSampleData() {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const monthlyData = months.map((month, index) => {
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
  const dcfValuation = Math.round(averageMonthlyCashFlow * 10) // 10x multiple

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

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' })
    }
  }
  
  console.error('Server error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Cash Flow Valuation API ready`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
})

// Serve static files (Excel template)
app.use('/downloads', express.static(path.join(__dirname, '../public')))

// Template download endpoint
app.get('/api/download-template', (req, res) => {
  const templatePath = path.join(__dirname, '../public/Cash_Flow_Template.xlsx')
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename="Cash_Flow_Template.xlsx"')
  
  res.sendFile(templatePath, (err) => {
    if (err) {
      console.error('Error sending template file:', err)
      res.status(500).json({ error: 'Failed to download template' })
    }
  })
})

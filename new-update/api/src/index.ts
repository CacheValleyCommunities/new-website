import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { database } from './database'
import organizationRoutes from './routes/organizations'
import postRoutes from './routes/posts'
import contributorRoutes from './routes/contributors'
import categoryRoutes from './routes/categories'
import tagRoutes from './routes/tags'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import organizationCreationRoutes from './routes/organizationCreation'
import { AuthMiddleware } from './middleware/auth'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

// Security middleware
app.use(helmet())

// CORS middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cookie parsing middleware
app.use(cookieParser())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cache Valley Communities API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/organization-creation', organizationCreationRoutes)
app.use('/api/organizations', organizationRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/contributors', contributorRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/tags', tagRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await database.initialize()
    console.log('Database initialized successfully')
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Cache Valley Communities API running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`)
      console.log(`📁 Database: ${process.env.DATABASE_PATH || './data/database.sqlite'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  try {
    await database.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...')
  try {
    await database.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
})

// Start the server
startServer()

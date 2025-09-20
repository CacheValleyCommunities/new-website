# Cache Valley Communities API

A TypeScript Express API with SQLite database for the Cache Valley Communities website.

## 🚀 Features

- **TypeScript** - Full type safety throughout the application
- **Express.js** - Fast, unopinionated web framework
- **SQLite** - Lightweight, serverless database
- **CORS** - Cross-origin resource sharing for frontend integration
- **RESTful API** - Clean, consistent API design
- **Data Models** - Structured data access with relationships
- **Seed Data** - Pre-populated with sample data

## 📁 Project Structure

```
api/
├── src/
│   ├── database/
│   │   ├── index.ts          # Database connection and initialization
│   │   └── schema.sql        # Database schema
│   ├── models/
│   │   ├── Organization.ts   # Organization data model
│   │   ├── Post.ts          # Post data model
│   │   ├── Contributor.ts   # Contributor data model
│   │   ├── Category.ts      # Category data model
│   │   └── Tag.ts           # Tag data model
│   ├── routes/
│   │   ├── organizations.ts # Organization API routes
│   │   ├── posts.ts         # Post API routes
│   │   ├── contributors.ts  # Contributor API routes
│   │   ├── categories.ts    # Category API routes
│   │   └── tags.ts          # Tag API routes
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── index.ts             # Main application file
│   └── seed.ts              # Database seeding script
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

```bash
cd api
npm install
```

## 🚀 Development

### Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Build for Production
```bash
npm run build
npm start
```

### Seed Database
```bash
npm run seed
```

## 📊 API Endpoints

### Health Check
- `GET /health` - API health status

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `GET /api/organizations/slug/:slug` - Get organization by slug
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `GET /api/organizations/search/:query` - Search organizations

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `GET /api/posts/category/:categorySlug` - Get posts by category
- `GET /api/posts/tag/:tagSlug` - Get posts by tag
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/search/:query` - Search posts

### Contributors
- `GET /api/contributors` - Get all contributors
- `GET /api/contributors/:id` - Get contributor by ID
- `POST /api/contributors` - Create new contributor
- `PUT /api/contributors/:id` - Update contributor
- `DELETE /api/contributors/:id` - Delete contributor

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get tag by ID
- `GET /api/tags/slug/:slug` - Get tag by slug

## 📝 API Response Format

All API responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🗄️ Database Schema

### Organizations
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `slug` (TEXT UNIQUE NOT NULL)
- `summary` (TEXT NOT NULL)
- `description` (TEXT)
- `website` (TEXT)
- `image` (TEXT)
- `date` (TEXT NOT NULL)
- `private` (BOOLEAN DEFAULT 0)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Posts
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `slug` (TEXT UNIQUE NOT NULL)
- `summary` (TEXT NOT NULL)
- `content` (TEXT NOT NULL)
- `date` (TEXT NOT NULL)
- `image` (TEXT)
- `weight` (INTEGER DEFAULT 0)
- `private` (BOOLEAN DEFAULT 0)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Contributors
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `role` (TEXT NOT NULL)
- `bio` (TEXT NOT NULL)
- `avatar` (TEXT)
- `github` (TEXT)
- `twitter` (TEXT)
- `linkedin` (TEXT)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Categories & Tags
- Many-to-many relationships with posts
- Junction tables: `post_categories`, `post_tags`

## 🔧 Configuration

### Environment Variables
Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/database.sqlite
CORS_ORIGIN=http://localhost:3000
```

### CORS Configuration
The API is configured to accept requests from `http://localhost:3000` by default (Vue.js frontend).

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl http://localhost:3001/health

# Get all organizations
curl http://localhost:3001/api/organizations

# Get organization by slug
curl http://localhost:3001/api/organizations/slug/cachevalleycommunities

# Get all posts
curl http://localhost:3001/api/posts

# Search posts
curl http://localhost:3001/api/posts/search/forensics
```

### Using Postman
Import the API endpoints into Postman for easier testing.

## 🔄 Integration with Vue.js Frontend

The API is designed to work seamlessly with the Vue.js frontend:

1. **CORS** is configured for `http://localhost:3000`
2. **Response format** matches frontend expectations
3. **Data structure** aligns with frontend TypeScript interfaces
4. **Error handling** provides consistent error responses

### Example Frontend Integration
```typescript
// In your Vue.js component
const fetchOrganizations = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/organizations')
    const data = await response.json()
    
    if (data.success) {
      organizations.value = data.data
    } else {
      console.error('API Error:', data.error)
    }
  } catch (error) {
    console.error('Network Error:', error)
  }
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
PORT=3001
NODE_ENV=production
DATABASE_PATH=/path/to/production/database.sqlite
CORS_ORIGIN=https://yourdomain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 📈 Performance Considerations

- **SQLite** is suitable for small to medium applications
- **Indexes** are created on frequently queried columns
- **Connection pooling** is handled by SQLite3
- **Caching** can be added for frequently accessed data

## 🔒 Security Considerations

- **Input validation** should be added for production
- **Authentication/Authorization** can be implemented
- **Rate limiting** can be added to prevent abuse
- **HTTPS** should be used in production
- **SQL injection** protection through parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Cache Valley Communities initiative.

# MongoDB Integration Guide

## Overview
The application is now connected to MongoDB with the following features:
- Mongoose ORM for schema management
- API routes for Quotations and Clients
- TypeScript support with type definitions
- Connection pooling and caching

## Setup Instructions

### 1. **Local MongoDB Setup**

#### On Windows:
```bash
# Download MongoDB Community Edition from:
# https://www.mongodb.com/try/download/community

# Install MongoDB
# Start MongoDB service:
net start MongoDB

# Or run mongod directly:
mongod --dbpath "C:\data\db"
```

#### On Mac:
```bash
# Using Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community
```

#### On Linux:
```bash
# Ubuntu/Debian:
sudo apt-get install -y mongodb

# Start MongoDB:
sudo systemctl start mongod
```

### 2. **MongoDB Atlas (Cloud)**

If you prefer using MongoDB Atlas (cloud-hosted):

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Update `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quotation-builder?retryWrites=true&w=majority
```

### 3. **Configure .env.local**

The `.env.local` file has been created in the project root. Update it with your MongoDB connection string:

```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/quotation-builder

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quotation-builder?retryWrites=true&w=majority
```

### 4. **Database Models**

Two models have been created:

#### Quotation Model (`lib/models/Quotation.ts`)
- clientName, clientEmail, clientPhone
- quotationNumber (unique)
- date, dueDate
- items (array of products/services)
- subtotal, tax, discount, total
- status (draft, sent, accepted, rejected)
- notes

#### Client Model (`lib/models/Client.ts`)
- name, email (unique), phone
- company, address, city, state, zip, country
- notes
- Timestamps (createdAt, updatedAt)

### 5. **API Routes**

#### Quotations API:
```
GET    /api/quotations           - Get all quotations
POST   /api/quotations           - Create new quotation
GET    /api/quotations/[id]      - Get quotation by ID
PUT    /api/quotations/[id]      - Update quotation
DELETE /api/quotations/[id]      - Delete quotation
```

#### Clients API:
```
GET    /api/clients              - Get all clients
POST   /api/clients              - Create new client
GET    /api/clients/[id]         - Get client by ID
PUT    /api/clients/[id]         - Update client
DELETE /api/clients/[id]         - Delete client
```

### 6. **Using the API in Frontend Components**

Import the API utilities:

```typescript
import { quotationAPI, clientAPI } from '@/lib/api';

// Get all quotations
const quotations = await quotationAPI.getAll();

// Create a new quotation
const newQuotation = await quotationAPI.create({
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '123-456-7890',
  quotationNumber: 'QT-001',
  dueDate: '2026-07-30',
  items: [
    {
      description: 'Product 1',
      quantity: 1,
      unitPrice: 100,
      total: 100,
    },
  ],
  total: 100,
});

// Get specific quotation
const quotation = await quotationAPI.getById(quotationId);

// Update quotation
const updated = await quotationAPI.update(quotationId, { status: 'sent' });

// Delete quotation
await quotationAPI.delete(quotationId);
```

### 7. **Testing the Connection**

#### Using MongoDB Compass (GUI):
1. Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect to your MongoDB instance
3. Verify the database and collections are created

#### Using API Testing Tool (Postman/curl):

```bash
# Get all quotations
curl http://localhost:3000/api/quotations

# Create a quotation
curl -X POST http://localhost:3000/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "clientPhone": "123-456-7890",
    "quotationNumber": "QT-001",
    "dueDate": "2026-07-30",
    "items": [],
    "total": 0
  }'
```

### 8. **Environment Variables Summary**

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

### 9. **Next Steps**

1. **Start MongoDB** on your machine or MongoDB Atlas
2. **Update `.env.local`** with your connection string
3. **Restart the dev server** (Ctrl+C, then `npm run dev`)
4. **Test the APIs** using Postman or curl
5. **Integrate with UI components** using the API utilities

## Troubleshooting

### Connection Errors:
- Verify MongoDB is running
- Check the connection string in `.env.local`
- Ensure network access if using MongoDB Atlas

### Validation Errors:
- Email must be unique
- Required fields: clientName, clientEmail, clientPhone, quotationNumber, total
- Quotation number must be unique

### Port Issues:
- MongoDB default port: 27017
- Next.js dev server: 3000
- Ensure these ports are available

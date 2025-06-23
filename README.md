# 🛒 Tina Mart - E-Commerce Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

A modern, scalable e-commerce platform built with Node.js, Express.js, and MongoDB. Tina Mart provides a comprehensive solution for online retail with features including user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - JWT-based authorization
  - Role-based access control (User/Admin)
  - Email verification system
  - User profile management

- **Product Management**
  - Product catalog with categories
  - Product search and filtering
  - Inventory management
  - Product reviews and ratings
  - Image upload support

- **Shopping Experience**
  - Shopping cart functionality
  - Order processing and tracking
  - Secure checkout process
  - Order history

- **Admin Features**
  - Admin dashboard
  - Product management
  - Order management
  - User management

## 🏗️ Architecture

The application follows a modular MVC architecture:

```
src/
├── config/           # Configuration files
│   ├── db.js        # Database connection
│   └── env.js       # Environment variables
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Database models
│   ├── User.model.js
│   ├── Product.model.js
│   ├── Cart.model.js
│   ├── Order.model.js
│   └── Review.model.js
├── routes/          # API routes
└── server.js        # Application entry point
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Environment**: dotenv for configuration
- **Development**: Nodemon for hot reload
- **Type Support**: TypeScript definitions

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (v5.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd tina-mart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tina-mart
DB_NAME=tina-mart

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For Ubuntu/Debian
sudo systemctl start mongod

# For macOS with Homebrew
brew services start mongodb-community

# For Windows
net start MongoDB
```

### 5. Run the application

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin only)

## 🗃️ Database Models

### User Model
- Personal information (name, email, phone, address)
- Authentication (password, email verification)
- Role-based permissions
- Timestamps

### Product Model
- Product details (name, description, price)
- Inventory management (stock)
- Categories and images
- Rating system

### Cart Model
- User-specific shopping carts
- Product quantities and pricing
- Session management

### Order Model
- Order tracking and status
- Payment information
- Shipping details
- Order history

### Review Model
- Product reviews and ratings
- User feedback system
- Moderation capabilities

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build

```bash
# Install production dependencies
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export PORT=80
export MONGODB_URI=mongodb://your-production-db

# Start the application
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (production/development) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRE` | JWT expiration time | No |

## 📊 Performance & Security

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting
- SQL injection prevention

### Performance Optimizations
- Database indexing
- Query optimization
- Response caching
- Image optimization
- Compression middleware

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 Changelog

### v0.0.0 (Current)
- Initial project setup
- Basic server configuration
- Database models implementation
- Authentication system setup
- Project structure establishment

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo journalctl -u mongod
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Environment Variables Not Loading**
- Ensure `.env` file is in the root directory
- Check for typos in variable names
- Restart the development server

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues for solutions

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Made with ❤️ by the Tina Mart Team**

*Last updated: June 2024*

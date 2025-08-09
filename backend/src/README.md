# Backend Architecture

This backend follows a clean architecture pattern with proper separation of concerns.

## Directory Structure

```
src/
├── server.js              # Application entry point
├── config/                 # Configuration files
│   ├── env.js             # Environment variables
│   └── tenants.js         # Tenant configuration
├── db/                    # Database connection and models
│   └── mongo.js           # MongoDB schemas and connection
├── middleware/            # Express middleware
│   └── auth.js            # Authentication middleware
├── repository/            # Data access layer
│   └── inMemory.js        # In-memory data storage
├── services/              # Business logic layer
│   ├── authService.js     # Authentication services
│   ├── cartService.js     # Cart and address services
│   ├── orderService.js    # Order processing and PDF generation
│   ├── productService.js  # Product and category services
│   ├── seedService.js     # Database seeding
│   ├── tenantService.js   # Tenant configuration services
│   └── userService.js     # User profile services
└── router/                # API routes
    ├── index.js           # Express app setup
    ├── bindRoutes.js      # Route binding
    ├── auth.js            # Authentication routes
    ├── cart.js            # Cart and address routes
    ├── products.js        # Product and category routes
    ├── orders.js          # Order routes
    ├── admins.js          # Admin routes
    └── tenant.js          # Tenant configuration routes
```

## Architecture Principles

### 1. **Layered Architecture**
- **Router Layer**: Handles HTTP requests/responses and route parameters
- **Service Layer**: Contains business logic and coordinates between layers
- **Repository Layer**: Manages data access (MongoDB or in-memory)
- **Database Layer**: Schema definitions and connections

### 2. **Service Pattern**
Each service handles a specific domain:
- `authService`: User registration, login, password reset
- `userService`: User profile management
- `tenantService`: Multi-tenant configuration
- `productService` & `categoryService`: Product catalog management
- `cartService` & `addressService`: Shopping cart and address management
- `orderService` & `adminOrderService`: Order processing and administration
- `seedService`: Database initialization

### 3. **Error Handling**
- Services throw descriptive errors
- Routers catch errors and return appropriate HTTP status codes
- Consistent error response format: `{ error: "message" }`

### 4. **Database Abstraction**
- Code supports both MongoDB and in-memory storage
- Environment variable `USE_MONGO` controls which storage is used
- Services handle both cases transparently

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Database Seeding (MongoDB only)
```bash
node src/server.js --seed
```

## Environment Variables

- `PORT`: Server port (default: 4000)
- `MONGODB_URI`: MongoDB connection string (optional)

## API Routes

### Public Routes
- `GET /api/:tenant/config` - Get tenant configuration

### Authentication
- `POST /api/:tenant/auth/register` - User registration
- `POST /api/:tenant/auth/login` - User login
- `POST /api/:tenant/auth/forgot` - Password reset
- `GET /api/:tenant/auth/me` - Get current user profile

### Products & Categories
- `GET /api/:tenant/products` - List products
- `POST /api/:tenant/products` - Create product (admin only)
- `DELETE /api/:tenant/products/:id` - Delete product (admin only)
- `GET /api/:tenant/categories` - List categories
- `POST /api/:tenant/categories` - Create category (admin only)

### Cart & Addresses
- `GET /api/:tenant/cart` - Get cart items
- `POST /api/:tenant/cart` - Add to cart
- `DELETE /api/:tenant/cart/:productId` - Remove from cart
- `GET /api/:tenant/addresses` - List addresses
- `POST /api/:tenant/addresses` - Create address
- `PUT /api/:tenant/addresses/:id` - Update address
- `DELETE /api/:tenant/addresses/:id` - Delete address

### Orders
- `GET /api/:tenant/orders` - List user orders
- `GET /api/:tenant/orders/:id` - Get order details
- `POST /api/:tenant/orders` - Create order
- `GET /api/:tenant/orders/:id/pdf` - Download order PDF

### Admin Orders
- `GET /api/:tenant/orders/admin` - List all orders (admin only)
- `GET /api/:tenant/orders/admin/:id` - Get any order (admin only)
- `PUT /api/:tenant/orders/admin/:id` - Update order status (admin only)

### Admin Management
- `GET /api/:tenant/admins` - List admin emails (admin only)

## Benefits of This Architecture

1. **Maintainability**: Clear separation of concerns makes code easier to understand and modify
2. **Testability**: Services can be unit tested independently
3. **Scalability**: Easy to add new features or modify existing ones
4. **Flexibility**: Can switch between different data storage methods
5. **Reusability**: Services can be reused across different routes
6. **Error Handling**: Consistent error handling across the application
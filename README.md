# DevTracker X - Production-Ready SaaS Bug Tracker

A minimal, high-end, portfolio-grade, multi-tenant bug/ticket tracker built with Node.js, Express, TypeScript, MongoDB, React, and Vite.

## Features

✅ **Multi-Tenant Architecture** - Organizations, Projects with tenant isolation  
✅ **Advanced RBAC** - Role-based access control with centralized permission mapping  
✅ **Smart Tickets** - Full CRUD with advanced filters, pagination, sorting  
✅ **Comments & Notifications** - Ticket comments with @ mentions and in-app notifications  
✅ **Audit Logs** - Track all important actions for compliance  
✅ **Production Security** - Helmet, CORS, rate limiting, mongo-sanitize  
✅ **Swagger Docs** - Auto-generated OpenAPI documentation at `/api/docs`  
✅ **JWT Auth** - Access + Refresh tokens with HttpOnly cookies  
✅ **Modern Frontend** - React 18, TypeScript, Vite, Tailwind CSS, React Query  
✅ **Database** - MongoDB with Mongoose, proper indexes  

---

## Project Structure

```
devtracker-x/
├── server/                # Express + TypeScript backend
│   ├── src/
│   │   ├── config/        # Database, logger, auth config
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database queries
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, error handling
│   │   ├── utils/         # JWT, password hashing, RBAC, errors
│   │   ├── scripts/       # Database seed
│   │   ├── app.ts         # Express app setup
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks (React Query)
│   │   ├── context/       # Auth context
│   │   ├── lib/           # API client, query client
│   │   ├── App.tsx        # Main app
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── index.html
├── shared/                # Shared types & schemas
│   ├── src/
│   │   ├── types.ts       # TypeScript interfaces
│   │   ├── schemas.ts     # Zod validation schemas
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB Atlas + Mongoose
- **Validation**: Zod
- **Auth**: JWT (access + refresh tokens)
- **Security**: Helmet, CORS, rate-limit, mongo-sanitize
- **Logging**: Winston + Morgan
- **Docs**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Frontend
- **React**: 18.2.0
- **TypeScript**: 5.3.3
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Data Fetching**: @tanstack/react-query
- **Forms**: React Hook Form + Zod resolver
- **Styling**: Tailwind CSS
- **UI**: Custom components + Tailwind
- **Notifications**: React Hot Toast
- **Charts**: Recharts (optional)

### Shared
- **Validation**: Zod schemas
- **Types**: Full TypeScript support across FE/BE

---

## Setup Instructions

### Prerequisites
- **Node.js** 20+ LTS
- **MongoDB** 5.0+ (or MongoDB Atlas cloud)
- **npm** 10+

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Install shared dependencies
cd ../shared
npm install
```

### 2. Configure Environment

**Server** (`.env`):
```bash
cd server
cp .env.example .env

# Edit .env with your MongoDB URI and secrets
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/devtracker-x
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**Client** (`.env.local`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Build Shared Package

```bash
cd shared
npm run build
```

### 4. Start Backend

```bash
cd server
npm run dev
```

Backend will run on `http://localhost:5000`  
Swagger docs: `http://localhost:5000/api/docs`

### 5. Start Frontend

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Seed Database (Optional)

```bash
cd server
npm run seed
```

Creates 3 demo users, 1 organization, 1 project, and 10 demo tickets with comments.

#### Demo User Credentials
```
alice@example.com / password123
bob@example.com / password123
carol@example.com / password123
```

---

## API Documentation

Once the backend is running, visit: **http://localhost:5000/api/docs**

All endpoints are documented with Swagger/OpenAPI.

### Key Endpoints

```
POST   /api/auth/register           # Register user
POST   /api/auth/login              # Login
POST   /api/auth/refresh            # Refresh access token
GET    /api/auth/me                 # Get current user
POST   /api/auth/logout             # Logout

POST   /api/orgs                    # Create organization
GET    /api/orgs                    # List user's organizations
GET    /api/orgs/:orgId             # Get org details
GET    /api/orgs/:orgId/members     # List org members
POST   /api/orgs/:orgId/members     # Add member

POST   /api/orgs/:orgId/projects           # Create project
GET    /api/orgs/:orgId/projects           # List projects
POST   /api/orgs/:orgId/projects/:projectId/tickets        # Create ticket
GET    /api/orgs/:orgId/projects/:projectId/tickets?...    # List tickets (with filters)

GET    /api/tickets/:ticketId              # Get ticket
PATCH  /api/tickets/:ticketId              # Update ticket
POST   /api/tickets/:ticketId/status       # Update status
POST   /api/tickets/:ticketId/assign       # Assign ticket
DELETE /api/tickets/:ticketId              # Delete ticket (soft)

POST   /api/tickets/:ticketId/comments     # Create comment
GET    /api/tickets/:ticketId/comments     # List comments
PATCH  /api/comments/:commentId            # Update comment
DELETE /api/comments/:commentId            # Delete comment

GET    /api/notifications                  # List notifications
PATCH  /api/notifications/:id/read         # Mark as read
POST   /api/notifications/read-all         # Mark all as read
```

---

## Architecture Decisions

### Layered Backend Architecture
- **Routes** → **Controllers** → **Services** → **Repositories** → **Models**
- Clean separation of concerns
- Easy to test and maintain
- Standardized request/response handling

### Multi-Tenant Security
- Every query scoped by `orgId`
- OrgMembership & ProjectMembership models enforce authorization
- Projects are scoped to organizations
- Tickets are scoped to projects
- Comments are scoped to tickets

### RBAC Permission Map
Centralized permission system in `server/src/utils/rbac.ts`:
```typescript
permissionMap = {
  owner: {...full permissions},
  admin: {...write permissions},
  developer: {...basic write},
  tester: {...read/status},
  viewer: {...read-only}
}
```

### Database Design
- Proper indexes on common queries (orgId, projectId, assigneeId)
- Soft deletes for tickets
- Indexed audit logs for compliance
- Pagination + filtering on all list endpoints

---

## Frontend Pages (Implemented)

- ✅ **Login/Register** - Auth pages with validation
- ✅ **Dashboard** - List user's organizations
- ✅ **Projects** - List organization projects
- ✅ **Tickets** - List project tickets (scaffolding in place)
- ✅ **Ticket Detail** - Ticket view/edit (scaffolding in place)
- ✅ **Navbar** - Navigation with notifications

### Ready to Enhance
- Add ticket table with filters/sorting/pagination
- Implement ticket detail view with comments
- Add notification dropdown
- Add user/org/project management UI
- Add advanced analytics dashboard with Recharts

---

## Git Workflow

```bash
# Check root .gitignore
cat .gitignore

# Track changes
git add .
git commit -m "Initial commit: DevTracker X full stack"
git push

# Each part can be developed independently
cd server && git status
cd client && git status
```

---

## Production Deployment

### Backend (Docker)
```dockerfile
FROM node:20
WORKDIR /app
COPY server . 
RUN npm ci --omit=dev && npm run build
CMD ["npm", "start"]
```

### Frontend (Vercel/Netlify)
```bash
npm run build  # Produces dist/
# Deploy dist/ folder
```

### Environment Variables (Production)
- Use `.env.production`
- Set `NODE_ENV=production`
- Use secured MongoDB Atlas connection
- Use strong JWT secrets
- Set `CORS_ORIGIN` to your domain only

---

## Testing

### Unit Tests (Jest)
```bash
cd server
npm test

cd client
npm test
```

### API Testing (Supertest)
```bash
npm run test:api
```

---

## Next Steps & TODOs

- [ ] Implement full ticket table UI with filters
- [ ] Add ticket detail page with comments
- [ ] Implement notifications dropdown
- [ ] Add user profile page
- [ ] Add organization/project settings
- [ ] Add analytics dashboard (Recharts)
- [ ] Add email notifications (optional)
- [ ] Add advanced search with Elasticsearch
- [ ] Add real-time updates with Socket.io (optional)
- [ ] Add Kanban board view (optional)
- [ ] Add testing coverage

---

## Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URI` is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Test connection: `mongosh "your-connection-string"`

### JWT Token Errors
- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
- Check token doesn't have expired
- Clear localStorage and re-login

### CORS Errors
- Check `CORS_ORIGIN` includes your frontend URL
- Frontend must send credentials in requests

### Build Errors
- Clear `node_modules` & `dist`
- Run `npm install` again
- Check Node version is 20+

---

## Support

For issues or questions:
1. Check the API docs at `/api/docs`
2. Review error messages in server logs
3. Check browser console for frontend issues
4. Verify environment variables are set

---

## License

MIT - Free to use for portfolio/commercial projects.

---

## Author

Built with ❤️ as a production-ready SaaS template.









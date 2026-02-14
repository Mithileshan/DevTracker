# DevTracker X - Testing Checklist

## Pre-Test Setup (5 min)

### 1. Backend Configuration
```bash
cd server
cp .env.example .env
```

**Edit `.server/.env`** with:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/devtracker-x
JWT_ACCESS_SECRET=dev_super_secret_key_at_least_32_characters_long_here_12345
JWT_REFRESH_SECRET=dev_refresh_secret_key_at_least_32_characters_long_here_12345
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 2. Frontend Configuration
```bash
cd client
cp .env.example .env.local
```

Leave `.env.local` as is (defaults to `http://localhost:5000/api`).

### 3. Install Dependencies
```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Client
cd client
npm install

# Terminal 3: Shared
cd shared
npm install
```

---

## Happy Path Tests (Test in order)

### Test 1: Backend Starts ✅
**What to do:**
```bash
cd server
npm run dev
```

**Expected:**
```
Server running on port 5000
Swagger docs available at http://localhost:5000/api/docs
```

**If it fails:**
- Check MongoDB connection (MONGODB_URI correct?)
- Check JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are set
- Check Node version: `node --version` (need 20+)

---

### Test 2: Verify API Docs Load ✅
**What to do:**
- Open browser: `http://localhost:5000/api/docs`

**Expected:**
- Swagger UI loads
- All endpoints listed (auth, orgs, projects, tickets, comments, notifications)
- "Authorize" button available

**If it fails:**
- Backend not running? Check terminal
- Wrong port? Check MONGODB_URI didn't cause crash

---

### Test 3: Register + Login ✅
**What to do:**
Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "test@example.com", "name": "Test User" },
    "accessToken": "eyJhbGc..."
  },
  "message": "Registration successful"
}
```

**Also check:**
- Response headers → Cookies: `refreshToken` should be set (httpOnly)

---

### Test 4: Login ✅
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=..." \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:**
- Access token returned
- Refresh token set in cookie

---

### Test 5: Get Current User ✅
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": { "id": "...", "email": "test@example.com", "name": "Test User" },
  "message": "OK"
}
```

---

### Test 6: Create Organization ✅
```bash
curl -X POST http://localhost:5000/api/orgs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Test Org",
    "slug": "my-test-org"
  }'
```

**Expected:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "My Test Org", "ownerId": "..." },
  "message": "Organization created"
}
```

---

### Test 7: List Organizations ✅
```bash
curl -X GET http://localhost:5000/api/orgs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": [{ "id": "...", "name": "My Test Org", ... }],
  "message": "OK"
}
```

---

### Test 8: Create Project ✅
```bash
curl -X POST http://localhost:5000/api/orgs/ORG_ID/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Bugs",
    "description": "FE bug tracking"
  }'
```

**Expected:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "Frontend Bugs", "orgId": "ORG_ID" },
  "message": "Project created"
}
```

---

### Test 9: Create Ticket ✅
```bash
curl -X POST http://localhost:5000/api/orgs/ORG_ID/projects/PROJECT_ID/tickets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button broken",
    "description": "Button not clickable",
    "type": "bug",
    "priority": "high",
    "status": "open"
  }'
```

**Expected:**
- Ticket created with auto-generated issue number
- Returns ticket object with ID

---

### Test 10: List Tickets with Filters ✅
```bash
curl -X GET "http://localhost:5000/api/orgs/ORG_ID/projects/PROJECT_ID/tickets?status=open&priority=high" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:**
- List of tickets matching filter
- Includes pagination info (total, page, limit, hasNext)

---

### Test 11: Assign Ticket ✅
```bash
curl -X POST http://localhost:5000/api/tickets/TICKET_ID/assign \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "assigneeId": "USER_ID" }'
```

**Check database:**
- Ticket.assigneeId updated
- Notification created for assignee

---

### Test 12: Token Refresh ✅
```bash
# Let access token expire (wait 15+ min or mock)
# Then:
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN"
```

**Expected:**
- New access token returned
- New refresh token set in cookie

---

### Test 13: Frontend Starts ✅
```bash
cd client
npm run dev
```

**Expected:**
- Vite server runs on port 5173
- Open `http://localhost:5173`
- See DevTracker login page

---

### Test 14: Frontend Login Flow ✅
**What to do:**
1. Go to register page
2. Register: `alice@example.com / password123`
3. You should be redirected to dashboard
4. Refresh page - still logged in? (token refresh working?)

**Expected:**
- Navbar shows "Logout"
- Can see organization list
- Notification badge visible

---

### Test 15: Seed Script ✅
```bash
# Clear DB or use fresh DB
cd server
npm run seed
```

**Expected:**
- 3 users created
- 1 organization created
- 1 project created
- 10 tickets created
- 5 comments created

**Then test login with:**
- alice@example.com / password123
- bob@example.com / password123
- carol@example.com / password123

---

## Common Failures & Fixes

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| `MONGODB_URI not found` | `.env` not created | `cp .env.example .env` in server dir |
| `JWT secrets not configured` | Missing JWT_ACCESS_SECRET or JWT_REFRESH_SECRET | Add 32+ char secrets to `.env` |
| `CORS error in browser` | CORS_ORIGIN doesn't match frontend URL | Add `http://localhost:5173` to CORS_ORIGIN |
| `refresh token not working` | Cookie not sent by frontend | Verify `withCredentials: true` in apiClient |
| `403 Forbidden on create project` | User not org member with right role | Check OrgMembership + RBAC |
| `tickets list empty` | Soft delete filter removing results | Check deletedAt filter in service |
| `notification not created` | Missing @mention or assignment didn't trigger | Check NotificationService logic |

---

## Database Inspection (MongoDB)

Use MongoDB Compass or Studio 3T to verify:

```javascript
// Check collections exist
db.getCollectionNames()
// ["users", "organizations", "orgmemberships", "projects", "projectmemberships", "tickets", "ticketcomments", "notifications", "auditlogs"]

// Sample user
db.users.findOne()

// Sample org with owner
db.organizations.findOne()
db.orgmemberships.find({ orgId: ObjectId("...") })

// Sample ticket
db.tickets.findOne()

// Check soft delete
db.tickets.find({ deletedAt: { $exists: true } })
```

---

## Next Steps After Green Tests

If all 15 tests pass:

1. **Implement TicketsPage UI**
   - Table with filters, pagination, sorting
   - Create ticket button & modal
   - Link to ticket detail

2. **Implement TicketDetailPage UI**
   - View/edit ticket fields
   - Status change dropdown
   - Assignment dropdown
   - Comments thread UI
   - "Delete ticket" button

3. **Notifications dropdown**
   - Show unread count
   - Click to mark read
   - Link to ticket/project

4. **Add org context to frontend**
   - Store activeOrgId
   - Invalidate queries on org change

---

## Support

If any test fails before "happy path complete", report:
1. Test number that failed (e.g., "Test 3: Register + Login")
2. Exact error message
3. What you put in `.env`
4. Backend + frontend terminal output

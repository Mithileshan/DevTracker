# DevTracker X - Quick Reference Card

## 🔴 Emergency Fixes

### Backend Won't Start
```bash
# Check .env file exists
ls server/.env

# Check MongoDB connection
echo $MONGODB_URI

# Check JWT secrets (must be 32+ chars)
cat server/.env | grep JWT

# If still failing:
npm run dev 2>&1 | tail -20  # See last 20 lines of error
```

### Frontend Login Fails
```bash
# Check browser console for errors (F12)
# Check Network tab for HTTP status

# Common cause: CORS error
# Solution: Verify server/.env has CORS_ORIGIN=http://localhost:5173

# Common cause: API URL wrong
cat client/.env.local  # Should show VITE_API_URL
```

### Can't Connect to MongoDB
```bash
# Test connection directly:
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/devtracker-x"

# Check IP is whitelisted in Atlas dashboard
# Check password has no special chars that need URL encoding
```

---

## 🟡 Common Test Failures

| Test | Error | Fix |
|------|-------|-----|
| Register | "MONGODB_URI" | Set MONGODB_URI in .env |
| Register | "JWT secret" | Set JWT_ACCESS/REFRESH_SECRET (32+ chars) |
| Login | "CORS error" | Add `http://localhost:5173` to CORS_ORIGIN |
| Create Org | "Forbidden" | User not authenticated (token expired?) |
| Create Ticket | "not found" | OrgId or ProjectId wrong (check IDs) |
| Assign Ticket | "Forbidden" | Assignee not a project member |
| List Tickets | "Empty list" | No tickets created yet (run seed) |

---

## 🔍 Debug Checklist

```bash
# 1. Backend running?
curl -s http://localhost:5000/api/docs | head -20  # Should show HTML

# 2. Frontend running?
curl -s http://localhost:5173 | head -5  # Should show HTML

# 3. MongoDB connected?
docker ps  # Check if MongoDB container running (if using Docker)

# 4. Have .env files?
ls server/.env
ls client/.env.local

# 5. Check logs for errors:
cd server && npm run dev 2>&1 | grep -i error
```

---

## 📱 API Testing Quick Curl

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login (Save TOKEN & COOKIE)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq '.data.accessToken'
```

### Get Current User
```bash
TOKEN="YOUR_TOKEN_HERE"
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Create Org
```bash
TOKEN="YOUR_TOKEN_HERE"
curl -X POST http://localhost:5000/api/orgs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Org",
    "slug": "my-org"
  }' | jq '.data.id'
```

---

## 🗄️ MongoDB Quick Commands

```bash
# Connect to MongoDB
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/devtracker-x"

# In MongoDB shell:
use devtracker-x

# Count collections
db.users.countDocuments()
db.organizations.countDocuments()
db.tickets.countDocuments()

# Find sample record
db.users.findOne()
db.tickets.findOne()

# Find deleted tickets
db.tickets.find({ deletedAt: { $exists: true } })

# Clear all data (WARNING: destructive!)
db.users.deleteMany({})
db.organizations.deleteMany({})
# Then re-run seed
```

---

## 🎯 File Locations (Quick Map)

```
Backend Setup:
  server/.env                         ← Secrets here
  server/src/app.ts                   ← Express app
  server/src/index.ts                 ← Start point
  server/src/utils/rbac.ts            ← Permissions

Frontend Setup:
  client/.env.local                   ← API URL here
  client/src/App.tsx                  ← Routes
  client/src/main.tsx                 ← Start point
  client/src/lib/apiClient.ts         ← HTTP client

Database:
  server/src/models/                  ← Mongoose models
  server/src/config/database.ts       ← Connection

Tests:
  QUICK_START.md                      ← Setup (5 min)
  TESTING_CHECKLIST.md                ← Happy path (15 tests)
  BUG_FIXES_AND_HARDENING.md         ← Issues & fixes
```

---

## 🚨 If You See These Errors

```
Error: "Cannot GET /api/docs"
→ Backend not running: cd server && npm run dev

Error: "CORS error in console"
→ Check CORS_ORIGIN in server/.env includes localhost:5173

Error: "RefreshToken cookie not sent"
→ Check: withCredentials: true in apiClient

Error: "Invalid or expired token"
→ Token expired (access token 15 min)
→ Try: Manual refresh or re-login

Error: "You do not have access to this organization"
→ User not an org member
→ Check OrgMembership collection

Error: "Assignee is not a member of this project"
→ Trying to assign to someone not in project
→ Add them as project member first
```

---

## ⚡ Performance Tips

```bash
# Clear node_modules & reinstall if weird errors:
cd server && rm -rf node_modules && npm install

# Kill all processes on ports:
lsof -i :5000  # Show processes on port 5000
kill -9 <PID>  # Kill process

# View real-time logs:
cd server && npm run dev 2>&1 | grep -E "error|Error|warn"

# Check network latency:
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000
```

---

## 📊 Compare Responses

### Success Response
```json
{
  "success": true,
  "data": { "id": "...", "name": "..." },
  "message": "OK"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You do not have permission",
  "statusCode": 403
}
```

---

## 🔐 Test Different Roles

Create test users with different roles:

```bash
# Admin (can manage project members)
POST /api/orgs/:orgId/members
  { "userId": "admin_id", "role": "admin" }

# Developer (can create/update tickets)
POST /api/orgs/:orgId/members
  { "userId": "dev_id", "role": "developer" }

# Viewer (can only read)
POST /api/orgs/:orgId/members
  { "userId": "viewer_id", "role": "viewer" }

# Then try to create ticket as viewer (should fail 403)
```

---

## ✅ Pre-Demo Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can login with alice@example.com
- [ ] Can see organization in dashboard
- [ ] Can see project in list
- [ ] Can see tickets in page
- [ ] Can open ticket detail
- [ ] Swagger docs load at /api/docs
- [ ] Refresh page → still logged in?
- [ ] Network tab shows no 4xx/5xx errors

---

## 🆘 If All Else Fails

1. **Hard reset everything:**
```bash
# Kill all nodes
killall node

# Clear frontend cache
rm -rf client/node_modules client/dist client/.then/cache

# Clear backend cache
rm -rf server/node_modules server/dist

# Re-install
cd server && npm install && cd ../client && npm install

# Start fresh
npm run seed
npm run dev
```

2. **Check git status (did something break?):**
```bash
git status
git diff server/src/  # See what changed

# Revert one file:
git checkout server/src/app.ts
```

3. **Still stuck?**
   - Screenshot the error
   - Copy full error message from terminal
   - Check TESTING_CHECKLIST.md for that test
   - Reference BUG_FIXES_AND_HARDENING.md

---

## 🎓 Key Commands

```bash
# Setup
cd server && npm install && cp .env.example .env

# Run
npm run dev                    # Backend dev mode
cd client && npm run dev       # Frontend dev mode
npm run seed                   # Generate demo data

# Test
npm test                       # Run tests
npm run test:watch           # Watch mode

# Deploy
npm run build                 # Production build
npm start                     # Start production server

# Debug
npm run dev 2>&1 | head -50  # See startup logs
curl -X GET http://localhost:5000/health  # Health check
```

---

## 💡 Remember

- Backend = `localhost:5000`
- Frontend = `localhost:5173`
- MongoDB Atlas = cloud
- .env goes in `server/` directory
- Token expires in 15 minutes
- Demo seed has alice/bob/carol all with password123
- All endpoints documented at `/api/docs`

**Happy coding! 🚀**


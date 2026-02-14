# DevTracker X - Quick Start (5 Minutes)

## Step 1: Setup Secrets (1 min)

Create `server/.env`:
```bash
cd server
cp .env.example .env
```

**Edit** `server/.env` and replace:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/devtracker-x?retryWrites=true&w=majority
JWT_ACCESS_SECRET=dev_secret_key_needs_to_be_at_least_32_chars_long_hello_123456789
JWT_REFRESH_SECRET=dev_refresh_secret_also_needs_32_chars_minimum_world_987654321
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

Create `client/.env.local`:
```bash
cd client
cp .env.example .env.local
# Leave default (API_URL points to localhost:5000/api)
```

## Step 2: Install Dependencies (2 min)

Open **3 terminals** (or use tmux/split):

**Terminal 1:**
```bash
cd server && npm install
```

**Terminal 2:**
```bash
cd client && npm install
```

**Terminal 3:**
```bash
cd shared && npm install
```

## Step 3: Start Backend (30 sec)

**Terminal 1:**
```bash
cd server
npm run dev
```

Wait for:
```
Server running on port 5000
Swagger docs available at http://localhost:5000/api/docs
```

## Step 4: Start Frontend (30 sec)

**Terminal 2:**
```bash
cd client
npm run dev
```

Wait for:
```
VITE v5.x.x  ready in xxx ms
Local: http://localhost:5173/
```

## Step 5: Seed Database (1 min)

**Terminal 3:**
```bash
cd server
npm run seed
```

Expected output:
```
✓ Created 3 users
✓ Created 1 organization
✓ Created 1 project
✓ Created 10 tickets
✓ Created 5 comments
✓ Database seeded successfully
```

---

## 🎉 You're Ready!

### Test Functionality

Open `http://localhost:5173` in browser

**Login with:**
```
Email: alice@example.com
Password: password123
```

**You should see:**
- Dashboard with 1 organization
- Ability to click into Projects
- Projects page showing "FRONT" project
- Tickets page (partially implemented)

---

## Verify Swagger Docs

Open `http://localhost:5000/api/docs`

You should see:
- All endpoints documented
- Try-it-out buttons for each endpoint
- Auth section with Bearer token option

---

## Troubleshooting (Quick Fixes)

### "Cannot connect to MongoDB"
```bash
# Check your MongoDB URI
echo $MONGODB_URI
# Verify IP is whitelisted in MongoDB Atlas dashboard
```

### "JWT secret not found"
```bash
# Verify .env file exists in server/
ls server/.env

# Check secrets are set
cat server/.env | grep JWT
```

### "CORS error in browser console"
```bash
# Make sure CORS_ORIGIN includes localhost:5173
cat server/.env | grep CORS_ORIGIN
# Should be: CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### "Module not found (ts-node-dev)"
```bash
cd server
npm install --save-dev ts-node-dev
npm run dev
```

---

## What's Working ✅

- [x] Registration & Login
- [x] Organizations & Projects
- [x] Tickets (create, list, filter, assign)
- [x] Comments with mentions
- [x] Notifications
- [x] Multi-tenant isolation
- [x] RBAC permission system
- [x] Swagger documentation

## What's Scaffolded (Needs UI)

- [ ] Tickets page - table UI with filters (backend ready)
- [ ] Ticket detail page - full view/edit UI (backend ready)
- [ ] Notifications dropdown - UI needed

---

## Next: Follow Testing Checklist

See `TESTING_CHECKLIST.md` for comprehensive happy-path testing.

Before deploying or showing recruiter:

1. ✅ Run all 15 tests from checklist
2. ✅ Implement TicketsPage UI
3. ✅ Implement TicketDetailPage UI
4. ✅ Implement Notifications dropdown

---

## Useful Commands

```bash
# Clear all tickets (if needed)
npm run seed  # Clears and re-seeds

# View logs in real-time
cd server && npm run dev 2>&1 | grep -E "error|Error"

# Test an endpoint manually
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check MongoDB data
mongosh
> use devtracker-x
> db.tickets.count()
> db.organizations.findOne()
```

---

## Support

If stuck on a specific test, check `BUG_FIXES_AND_HARDENING.md` for that issue.


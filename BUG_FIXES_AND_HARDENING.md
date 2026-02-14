# DevTracker X - Bug Fixes & Security Hardening

## Fixed Issues ✅

### 1. Frontend Token Refresh Infinite Loop [FIXED]
**Problem:** Response interceptor could retry forever on 401
**Solution:** Added `_retry` flag to prevent infinite retries
**File:** `client/src/lib/apiClient.ts`

---

## Known Issues to Monitor 🔵

### Critical Path Issues

#### A) RBAC Edge Case: Ticket Assignment to Non-Members
**Risk Level:** High  
**Scenario:** User tries to assign ticket to someone who's not a project member

**Current Code:**
```typescript
// TicketService.assignTicket()
async assignTicket(ticketId: string, userId: string, assigneeId: string) {
  // Missing: check if assigneeId is a project member!
  const ticket = await Ticket.findByIdAndUpdate(...);
}
```

**Fix Needed:**
```typescript
// In TicketService.assignTicket()
// Before assignment, verify assigneeId is a project member
const assigneeMembership = await ProjectMembership.findOne({
  projectId: ticket.projectId,
  userId: assigneeId,
});
if (!assigneeMembership) {
  throw new ForbiddenError('Assignee is not a member of this project');
}
```

**When to Fix:** Before TicketDetailPage implementation

---

#### B) Comment Mention Parsing
**Risk Level:** Medium  
**Current Scope:** Comments support @mentions
**Issue:** No defined mention format (is it `@alice` or `@alice@example.com`?)

**Recommendation:**
1. Parse comments for `@username` pattern
2. Look up user by username within same org
3. If found, create Notification for that user
4. If not found, ignore mention

**Code Location:** `server/src/services/CommentService.ts`

**When to Fix:** When implementing comment UI

---

#### C) Pagination Response Format
**Risk Level:** Medium  
**Scenario:** Frontend needs to build pagination UI

**Verify Ticket List Returns:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "page": 1,
    "limit": 20,
    "total": 250,
    "hasNext": true,
    "totalPages": 13
  }
}
```

**Check:** Open `server/src/services/TicketService.ts` → `listTickets()` method

**Current Return Structure:** ✅ Looks correct, but verify in testing

---

### QA Checklist Issues

#### D) Soft Delete Not Excluded in All Queries
**Files to Check:**
```
server/src/repositories/TicketRepository.ts
  ✓ Check if all queries use: { deletedAt: null } or { deletedAt: { $exists: false } }

server/src/services/TicketService.ts
  ✓ listTickets() - must exclude soft-deleted tickets
  ✓ getTicketById() - should 404 deleted tickets (or admin can see?)
```

**Test Case:**
1. Create ticket
2. Soft delete it
3. Verify: ticket list doesn't show it
4. Verify: GET /tickets/:id returns 404

---

#### E) Notification Creation on Assignment
**Current Logic:**
```typescript
// In TicketService.assignTicket()
if (assigneeId) {
  await Notification.create({
    userId: assigneeId,
    orgId,
    ticketId,
    type: 'ticket_assigned',
    read: false,
  });
}
```

**Test Case:**
1. Create ticket (unassigned)
2. Assign to `alice`
3. Check notifications collection → should have new entry
4. Alice's notification badge should increment

**If Failing:** Check NotificationService triggers

---

#### F) OrgId Scoping in List Operations
**Critical Check:** Verify every list endpoint validates orgId

**Example Issue (hypothetical):**
```typescript
// WRONG - no orgId validation
GET /api/orgs/:orgId/projects/:projectId/tickets
// User could pass wrong orgId in URL
```

**Correct Pattern:**
```typescript
// RIGHT
1. Verify user is member of :orgId
2. Verify project belongs to :orgId
3. List only tickets with projectId AND orgId match
```

**Files to Check:**
- `server/src/routes/tickets.ts` (all endpoints)
- `server/src/routes/projects.ts` (all endpoints)

---

### Frontend Issues

#### G) useOrg Hook Missing ActiveOrg Management
**Problem:** No centralized org context

**Current State:** Each page selects org independently

**Needed:**
```typescript
// Create useActiveOrg hook
export const useActiveOrg = () => {
  const { activeOrgId, setActiveOrgId } = useContext(ActiveOrgContext);
  return { activeOrgId, setActiveOrgId };
};

// Then in TicketsPage:
const { activeOrgId } = useActiveOrg();
const { data: tickets } = useTicket.listTickets(activeOrgId, projectId);
```

**When to Fix:** Before TicketDetailPage implementation

---

#### H) Frontend useTicket Mutations Return Type
**Check:** Verify mutation hooks match API response

**Example:**
```typescript
// createTicket mutation
const response = await apiClient.post(...);
// Does response.data.data exist? Or is it response.data.ticket?
```

**Validate in Postman first** before assuming hook works

---

## Testing Strategy

### Phase 1: Verify Foundations (Today)
Follow `TESTING_CHECKLIST.md` → Test 1-15

### Phase 2: Fix Critical Bugs (If Tests Fail)
- Token refresh issues
- CORS problems
- Multi-tenant isolation holes

### Phase 3: Implement UI Pages
- TicketsPage (table + filters + create)
- TicketDetailPage (view + edit + comments)
- Notifications dropdown

### Phase 4: Harden Edge Cases
- RBAC enforcement
- Pagination consistency
- Soft delete enforcement
- Error messages

---

## Security Audit Checklist

Before considering "production-ready":

- [ ] All sensitive operations require orgId + membership check
- [ ] Soft-deleted tickets truly hidden from non-admins
- [ ] RBAC permission map respected in all services
- [ ] No user can access another org's data
- [ ] JWT secrets are strong (32+ chars)
- [ ] CORS only allows expected origins
- [ ] Rate limiting enabled
- [ ] Swagger docs don't leak secrets
- [ ] Error messages don't expose sensitive data
- [ ] All mutations are idempotent (safe to retry)

---

## Debugging Tips

### If "Test 3: Register + Login" fails:

```bash
# Check .env is set
cat server/.env

# Check MongoDB connection
mongosh "your-connection-string"

# Check backend logs for JWT secret error
npm run dev 2>&1 | grep "JWT"

# Verify refresh token cookie is set:
# In Postman response, check "Headers" → "Set-Cookie"
```

### If "Test 14: Frontend Login Flow" fails:

```bash
# Check browser DevTools:
1. Network tab → check /auth/login response
2. Application → Cookies → refreshToken should exist
3. Application → LocalStorage → accessToken should exist
4. Console → check for CORS errors

# Check frontend .env.local
cat client/.env.local
# Should show VITE_API_URL=http://localhost:5000/api
```

### If "orgId not in ticket" error:

```bash
# Check controller is passing orgId to service
server/src/controllers/TicketController.ts
# Should show: await ticketService.createTicket(orgId, projectId, ...)

# Check service stores orgId
server/src/services/TicketService.ts
# Should show: await Ticket.create({ orgId, projectId, ... })
```

---

## What's Actually Ready for a Recruiter Demo

Current state (after tests pass):
- ✅ Backend API fully functional
- ✅ Authentication (register/login/logout)
- ✅ Multi-tenant isolation enforced
- ✅ RBAC permission system working
- ✅ Swagger documentation
- ⚠️ Frontend: Can auth but pages are scaffolded
- ⚠️ UI: Needs TicketsPage + TicketDetailPage implementation

**To impress recruiter:** Implement TicketsPage + TicketDetailPage + Notifications dropdown.

---

## Emergency Fixes (If Things Break)

### "Server won't start"
```bash
# Check logs
npm run dev 2>&1 | tail -20

# Most likely: JWT secret missing
echo "JWT_ACCESS_SECRET is set?"
echo $JWT_ACCESS_SECRET
```

### "Refresh token not working"
```bash
# Open browser DevTools → Network
# Make request that returns 401
# Check if new request after refresh goes through

# If stuck in refresh loop:
# Hard refresh (Cmd+Shift+R) 
# Clear localStorage + cookies
# Re-login
```

### "Multi-tenant isolation broken"
```bash
# Check user can see another org's tickets:
curl http://localhost:5000/api/orgs/WRONG_ORG_ID/projects/.../tickets \
  -H "Authorization: Bearer TOKEN"

# Should return 403 Forbidden, not the ticket list
```

---

## Next Implementation Tasks (After Tests Pass)

**Priority 1 (Do First):**
1. Implement `/client/src/pages/TicketsPage.tsx`
   - Table with columns: ID, Title, Status, Priority, Assignee, Created
   - Filters: status, priority, type
   - Sort: click header
   - Create button → modal form

2. Implement `/client/src/pages/TicketDetailPage.tsx`
   - View all fields
   - Edit: title, description, type, priority
   - Status dropdown
   - Assignee dropdown
   - Comments list + create comment form
   - Delete ticket button

**Priority 2 (Do Next):**
3. Notifications dropdown in Navbar
4. Add ActiveOrgContext for client
5. Activity timeline in TicketDetail

**Priority 3 (Polish):**
6. Empty states
7. Loading skeletons
8. Better error messages
9. Analytics dashboard (optional)


# MongoDB Connection String for MithileshDB Cluster

## ✅ Your Existing Cluster Configuration

**Cluster Name:** MithileshDB  
**Database User:** Devtracker  
**Connection Type:** MongoDB Driver (Node.js)

---

## 🔗 Connection String Format

From the MongoDB Atlas dialog, your connection string is:

```
mongodb+srv://Devtracker:<db_password>@mithileshdb.yzvmeu8.mongodb.net/?appName=MithileshDB
```

### To Use with DevTracker X:

1. **Replace `<db_password>`** with your actual Devtracker user password
2. **Add database name** before the `?`:

```
mongodb+srv://Devtracker:YOUR_PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

### Example (with placeholder):
```
mongodb+srv://Devtracker:MySecurePassword123@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

---

## 📋 Where to Use This String

### **Development (Local)**
Add to `server/.env`:
```env
MONGODB_URI=mongodb+srv://Devtracker:YOUR_PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

### **Production (Render)**
Add to Render Environment Variables dashboard:
```
MONGODB_URI=mongodb+srv://Devtracker:YOUR_PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

---

## ✅ Network Access Verification

Your MithileshDB cluster should allow connections from:

1. **Local Development:** Your machine's IP (for local testing)
2. **Production (Render):** All IPs `0.0.0.0/0` (since Render uses rotating IPs)

**To verify/configure:**
1. Go to MongoDB Atlas → MithileshDB cluster
2. Click "Network Access" (left menu)
3. Ensure required IPs are whitelisted

---

## 🧪 Test the Connection

```bash
# Test locally after adding to .env
cd server
npm run dev

# You should see: "MongoDB connected successfully"
```

---

## 🚀 Next Steps

1. ✅ Get your password for the "Devtracker" user
2. ✅ Replace `YOUR_PASSWORD` in connection string
3. ✅ Add to `server/.env` for local testing
4. ✅ Follow `DEPLOYMENT_QUICK_REFERENCE.md` for Render deployment
5. ✅ Add same MONGODB_URI to Render environment variables

---

**Connection String Ready?** → Move to **DEPLOYMENT_QUICK_REFERENCE.md** Step 2 (Render Backend)

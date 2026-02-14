# Quick Deployment Reference Card

## 🚀 3-Step Deployment Process

### Step 1: Database (MongoDB Atlas) ✅
**Already Set Up!** 

See: `MONGODB_CONNECTION.md`

```
1. Get Devtracker password from MongoDB Atlas
2. Finalize connection string in MONGODB_CONNECTION.md
3. Test: cd server && npm run dev
   (Should show "MongoDB connected successfully")
```

**Connection String Format (Your MithileshDB Cluster):**
```
mongodb+srv://Devtracker:PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

### Step 2: Backend (Render)
```
1. Go to render.com
2. Sign in with GitHub
3. New → Web Service → Deploy from GitHub
4. Select this repo
5. Root Directory: /server
6. Build: npm install && npm run build
7. Start: npm start
8. Add environment variables (see below)
9. Deploy
10. Copy Render URL (e.g., https://devtracker-x-api.onrender.com)
```

**Environment Variables for Render:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://Devtracker:PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
JWT_SECRET=[Generate 32-char random string]
JWT_REFRESH_SECRET=[Generate 32-char random string]
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
LOG_LEVEL=info
CORS_ORIGIN=https://yourapp.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**⚠️ DO NOT SET:** `PORT` (Render injects it automatically)

### Step 3: Frontend (Vercel)
```
1. Go to vercel.com
2. Sign in with GitHub
3. Import this repo
4. Root Directory: / (root of repo)
5. Build: npm -w client run build
6. Add VITE_API_URL environment variable
7. Deploy
```

**Environment Variables for Vercel:**
```
VITE_API_URL=https://devtracker-x-api.onrender.com/api
```

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] Frontend loads at https://yourapp.vercel.app
- [ ] Health check: `curl https://devtracker-x-api.onrender.com/api/health` returns `{"ok": true}`
- [ ] Can sign up (creates user in MongoDB)
- [ ] Can log in (returns JWT token)
- [ ] Can create organization
- [ ] Can create project
- [ ] Can create ticket
- [ ] API docs available at https://devtracker-x-api.onrender.com/api/docs

---

## 📱 Share Your App

Once deployed, share these URLs:
- **Frontend**: https://yourapp.vercel.app
- **API Docs**: https://devtracker-x-api.onrender.com/api/docs
- **Health**: https://devtracker-x-api.onrender.com/api/health

---

## 💾 Backup & Logs

**View Logs:**
- Render: Dashboard → Logs tab
- Vercel: Dashboard → Deployments → View Logs

**Get MongoDB Backup:**
- MongoDB Atlas → Backup tab → Download snapshot

---

## 🔑 Generate Secure Secrets

Use one of these to generate JWT secrets:

**Option 1: PowerShell**
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 126)}))) -join '') | Select-Object -First 32
```

**Option 2: Online Tools**
- https://randomkeygen.com/ (Use "CodeIgniter Encryption Keys")

**Option 3: Command Line (if openssl installed)**
```bash
openssl rand -base64 32
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Cannot connect to MongoDB | Check IP whitelist (0.0.0.0/0 for demo), verify password |
| CORS error from frontend | Update CORS_ORIGIN in Render (exact URL, no trailing slash), redeploy |
| Build fails on Vercel | Check root directory is `/`, build command correct |
| API not responding | Check Render logs, verify MONGODB_URI, health endpoint returns 200 |
| Login doesn't work | Check JWT_SECRET same on all deploys, browser cookies enabled |
| Render startup is slow | Free tier has cold starts. Upgrade to paid ($7/mo) for better performance |

---

## ⚡ Key Best Practices

✅ **DO:**
- Keep CORS_ORIGIN exact (no trailing slash)
- Let Render inject PORT via environment
- Generate real JWT secrets (not placeholders)
- Whitelist MongoDB IPs for production
- Test health endpoint after deployment

❌ **DON'T:**
- Hardcode PORT in environment variables
- Commit `.env` files to GitHub
- Use placeholder secrets in production
- Allow all IPs on production MongoDB (for real apps)
- Use Render free tier for production apps

---

## 📞 Support

See full `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.


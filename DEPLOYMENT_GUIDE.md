# DevTracker X - Deployment Guide (Render + MongoDB Atlas + Vercel)

## 📋 Pre-Deployment Checklist

- [ ] All code committed to GitHub
- [ ] MongoDB Atlas account created
- [ ] Render account created
- [ ] Vercel account created
- [ ] Environment variables prepared

---

## 🗄️ Part 1: MongoDB Atlas Connection (Already Set Up!)

### ✅ You Already Have a Cluster
Your MithileshDB cluster is ready to use!

**See:** `MONGODB_CONNECTION.md` for your specific connection string

### Quick Steps:
1. Open `MONGODB_CONNECTION.md`
2. Get your Devtracker user password from MongoDB Atlas
3. Replace `YOUR_PASSWORD` in the connection string
4. Copy the complete connection string

**Format:**
```
mongodb+srv://Devtracker:YOUR_PASSWORD@mithileshdb.yzvmeu8.mongodb.net/devtracker-x?retryWrites=true&w=majority&appName=MithileshDB
```

✅ **Connection string ready - move to Part 2 (Render)**

---

## 🚀 Part 2: Deploy Server on Render (15 minutes)

### Step 2.1: Prepare Repository
```bash
# Make sure you're at root directory
cd c:\Users\91730\OneDrive\Documents\devtracker-x

# Ensure all changes are committed
git add .
git commit -m "Deployment setup"
git push origin main
```

### Step 2.2: Connect Render to GitHub
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repos

### Step 2.3: Create New Web Service
1. Click "New +" → "Web Service"
2. Select "Build and deploy from a Git repository"
3. Search for "Bug-Tracker-MERN-Stack"
4. Select the repository
5. Click "Connect"

### Step 2.4: Configure Web Service
Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | devtracker-x-api |
| **Region** | Closest to your users (US East recommended) |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Root Directory** | `server` |

### Step 2.5: Add Environment Variables
1. Scroll to "Environment" section
2. Click "Add Environment Variable"
3. Add these variables (do NOT set PORT - Render injects it):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://devtracker_user:PASSWORD@cluster.mongodb.net/devtracker-x?retryWrites=true&w=majority
JWT_SECRET=generate-random-32-char-string-here
JWT_REFRESH_SECRET=generate-another-random-32-char-string
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
LOG_LEVEL=info
CORS_ORIGIN=https://yourapp.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**⚠️ CRITICAL SECURITY NOTES:**
- Don't set `PORT` - Render injects it automatically via `process.env.PORT`
- Generate real JWT secrets using the generate-secrets.bat script
- `CORS_ORIGIN` must be exact frontend URL with no trailing slash
- Never commit real secrets to GitHub

### Step 2.6: Deploy
1. Click "Create Web Service"
2. Render will build and deploy automatically
3. Watch deployment logs in the dashboard
4. Once deployed, Render provides your API URL (e.g., `https://devtracker-x-api.onrender.com`)
5. Test health endpoint: `curl https://devtracker-x-api.onrender.com/api/health`

✅ **Save your Render API URL - you'll need it for Vercel**
```
Example: https://devtracker-x-api.onrender.com
```

✅ **Save your API URL - you'll need it for Vercel**

---

## 🎨 Part 3: Deploy Client on Vercel (10 minutes)

### Step 3.1: Connect Vercel to GitHub
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repos

### Step 3.2: Import Project
1. Click "Add New" → "Project"
2. Search for "Bug-Tracker-MERN-Stack"
3. Select the repo
4. Click "Import"

### Step 3.3: Configure Vercel Settings
1. **Root Directory**: `/` (root of repo)
2. **Framework**: Vite (should auto-detect)
3. **Build Command**: `npm -w client run build`
4. **Output Directory**: `client/dist`
5. **Install Command**: `npm install`

### Step 3.4: Add Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add:
```
VITE_API_URL=https://devtracker-x-api.onrender.com/api
```
(Replace `devtracker-x-api` with your actual Render service name from Step 2.6)

### Step 3.5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Get your frontend URL (e.g., `https://yourapp.vercel.app`)
4. Update Railway CORS_ORIGIN with this URL (if different)

✅ **Your app is now live!**

---

## 🔗 Part 4: Connect Everything

### Update CORS on Render
1. Go back to Render Web Service dashboard
2. Go to "Environment Variables"
3. Edit `CORS_ORIGIN` variable
4. Set it to your exact Vercel URL: `https://yourapp.vercel.app` (no trailing slash)
5. Save changes (auto-redeploys)

### Verify Health Endpoint
Your API should have a health check endpoint at:
```
GET https://devtracker-x-api.onrender.com/api/health
```

Expected response:
```json
{"ok": true}
```

Test it:
```bash
curl https://devtracker-x-api.onrender.com/api/health
```

### Verify Frontend Works
1. Open `https://yourapp.vercel.app` in browser
2. Try to sign up / log in
3. Check browser console for errors
4. Check Render logs for any API issues

---

## 📊 Monitoring & Maintenance

### View Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Dashboard → Deployments → View Logs

### Update Code
```bash
# Make changes, then:
git add .
git commit -m "Your message"
git push origin main

# Both services auto-deploy!
```

### View Metrics
- **Render**: Dashboard → Deployments tab, metrics
- **Vercel**: Analytics tab

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
- [ ] Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Verify MONGODB_URI is correct (no typos)
- [ ] Check MongoDB user exists and password is correct
- [ ] Verify database name in connection string

### Error: "CORS error" from frontend
- [ ] Check CORS_ORIGIN in Render matches your Vercel URL (no trailing slash)
- [ ] Check VITE_API_URL in Vercel matches Render URL
- [ ] Check both URLs in browser (exact match, no trailing slashes)
- [ ] Verify both services have been redeployed after env var changes

### Error: "Build failed on Vercel"
- [ ] Check build command: `npm -w client run build`
- [ ] Verify root directory is `/`
- [ ] Check client/package.json exists
- [ ] View Vercel logs for specific error

### Error: "Deployment failed on Render"
- [ ] Check Procfile exists in server/
- [ ] Verify package.json build/start scripts exist
- [ ] Check server/src exists
- [ ] View Render logs for specific error

### Cannot login after deployment
- [ ] Verify JWT_SECRET is set same way across deploys
- [ ] Check cookies are being sent (browser DevTools → Application)
- [ ] Check server logs in Render for auth errors
- [ ] Verify CORS_ORIGIN is correct

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | 512MB storage | Free |
| Render | Limited (cold starts) | $7-20/mo (paid tier recommended) |
| Vercel | Unlimited builds | Free |
| **Total** | | **$7-20/mo** |

---

## 🎉 You're Done!

Your MERN app is now deployed and accessible worldwide!

**App URLs:**
- Frontend: https://yourapp.vercel.app
- API: https://devtracker-x-api.onrender.com
- API Docs: https://devtracker-x-api.onrender.com/api/docs
- Health Check: https://devtracker-x-api.onrender.com/api/health
- MongoDB: Hosted on MongoDB Atlas

**Next Steps:**
- [ ] Test all features in production
- [ ] Set up custom domain (optional)
- [ ] Configure error monitoring (Sentry)
- [ ] Set up analytics
- [ ] Share app with beta users

---

**Questions?** Check logs on Render (server) or Vercel (client) for detailed error messages.

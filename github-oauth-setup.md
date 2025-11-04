# GitHub OAuth Setup Guide

## 🔧 Fix GitHub Authentication

### **Step 1: Create/Update GitHub OAuth App**

1. **Go to GitHub Developer Settings:**
   - Visit: https://github.com/settings/applications/new
   - Or go to: GitHub Settings → Developer settings → OAuth Apps

2. **Fill out the form:**
   ```
   Application name: Crypto Portfolio Tracker
   Homepage URL: http://localhost:3000
   Application description: Personal crypto portfolio management app
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

3. **Click "Register application"**

4. **Copy the credentials:**
   - **Client ID**: Copy this to `GITHUB_CLIENT_ID` in .env.local
   - **Client Secret**: Generate and copy to `GITHUB_CLIENT_SECRET` in .env.local

### **Step 2: Update Environment Variables**

Your `.env.local` should have:
```bash
GITHUB_CLIENT_ID=your_actual_client_id
GITHUB_CLIENT_SECRET=your_actual_client_secret
```

### **Step 3: Important URLs**

Make sure your GitHub OAuth app has these exact URLs:

**Homepage URL:**
```
http://localhost:3000
```

**Authorization callback URL:**
```
http://localhost:3000/api/auth/callback/github
```

### **Step 4: Test Authentication**

1. Restart your development server: `npm run dev`
2. Click "Sign In with GitHub" in your app
3. You should be redirected to GitHub for authorization
4. After approval, you'll be redirected back to your app

### **Common Issues:**

❌ **"redirect_uri_mismatch"**
- Make sure callback URL in GitHub app matches exactly: `http://localhost:3000/api/auth/callback/github`

❌ **"Client ID not found"**  
- Check that `GITHUB_CLIENT_ID` is correct in .env.local
- Make sure .env.local is in the root directory

❌ **"Invalid client secret"**
- Regenerate the client secret in GitHub
- Update `GITHUB_CLIENT_SECRET` in .env.local

### **Production Setup:**

When deploying to production, update these URLs:
```
Homepage URL: https://yourdomain.com
Authorization callback URL: https://yourdomain.com/api/auth/callback/github
```

And update your environment variables accordingly.
# NextAuth Secret Generation Methods

## Method 1: Using Node.js crypto (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Method 2: Using OpenSSL (if available)
```bash
openssl rand -hex 32
```

## Method 3: Using online generator
Visit: https://generate-secret.vercel.app/32

## Method 4: Using NextAuth CLI
```bash
npx next-auth secret
```

## Method 5: Manual PowerShell (Windows)
```powershell
[System.Web.Security.Membership]::GeneratePassword(64, 0)
```

## Current Secret (Generated)
NEXTAUTH_SECRET=29a1d99a6c8193eaa8a617b4d522fc6e6309bf85d5786ccface9bf66b73d14ae

## Security Notes:
- Keep this secret private and secure
- Use different secrets for development/staging/production
- Never commit secrets to git repositories
- Rotate secrets periodically for enhanced security

## NextAuth Setup Commands:
```bash
npm install next-auth
npm install @next-auth/mongodb-adapter  # For MongoDB integration
```

## Environment Variables Needed:
- NEXTAUTH_SECRET (✅ Created)
- NEXTAUTH_URL (✅ Set to http://localhost:3000)
- Provider secrets (Google, GitHub, etc. - optional)
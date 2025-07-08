# 🚀 Complete Deployment Guide - Meraki Entertainment Live Bidding

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- Git installed
- A Supabase account
- A Vercel account (for deployment)
- Access to your domain (optional)

## 🗄️ Step 1: Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Note down your project URL and keys

### 1.2 Configure Database

1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. **IMPORTANT: Set Your Event Times**

   Open `scripts/create-tables-v2.sql` and find this section:
   \`\`\`sql
   -- **_ CHANGE THESE TIMES FOR YOUR LIVE EVENT _**
   bidding_starts_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-01-20 18:00:00+05:30', -- Event start time in IST
   bidding_ends_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-01-20 23:00:00+05:30', -- Event end time in IST
   \`\`\`

   **Change the dates and times to your event schedule:**

   - Format: `'YYYY-MM-DD HH:MM:SS+05:30'`
   - Example: `'2024-02-15 19:30:00+05:30'` for Feb 15, 2024 at 7:30 PM IST

4. Copy and paste the entire SQL script
5. Click "Run" to execute

### 1.3 Enable Real-time

1. In Supabase dashboard, go to "Database" → "Replication"
2. Enable replication for tables: `tables`, `bids`, `users`
3. Go to "Settings" → "API"
4. Copy your project URL and anon key

## 🔧 Step 2: Local Setup

### 2.1 Clone and Install

\`\`\`bash

# Clone the repository

git clone <your-repo-url>
cd meraki-entertainment-website

# Install dependencies

npm install
\`\`\`

### 2.2 Environment Configuration

Create `.env.local` file:
\`\`\`env

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL

DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
\`\`\`

### 2.3 Test Locally

\`\`\`bash

# Start development server

npm run dev

# Open http://localhost:3000

# Test login with user1/password1

\`\`\`

## 🌐 Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

\`\`\`bash
npm install -g vercel
\`\`\`

### 3.2 Deploy

\`\`\`bash

# Login to Vercel

vercel login

# Deploy to production

vercel --prod
\`\`\`

### 3.3 Configure Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add all variables from your `.env.local` file

### 3.4 Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS records as instructed

## ⏰ Step 4: Set Your Event Times

### 4.1 Update Database Times

**CRITICAL: Set your actual event times before going live!**

1. Go to Supabase SQL Editor
2. Run this query with YOUR event times:

\`\`\`sql
-- **_ UPDATE THESE TIMES FOR YOUR LIVE EVENT _**
UPDATE tables SET
bidding_starts_at = '2024-02-15 19:00:00+05:30', -- Your event start time
bidding_ends_at = '2024-02-15 23:00:00+05:30' -- Your event end time
WHERE is_active = true;
\`\`\`

### 4.2 Time Format Examples

- **Evening Event**: `'2024-02-15 19:30:00+05:30'` (7:30 PM IST)
- **Afternoon Event**: `'2024-02-15 14:00:00+05:30'` (2:00 PM IST)
- **Late Night**: `'2024-02-15 22:00:00+05:30'` (10:00 PM IST)

## 👥 Step 5: User Management

### 5.1 Test Users Available

- **Usernames**: user1, user2, user3... up to user40
- **Passwords**: password1, password2, password3... up to password40

### 5.2 Create Custom Users (Optional)

\`\`\`sql
INSERT INTO users (username, password_hash, email) VALUES
('vip1', '$2b$10$hash_here', 'vip1@event.com'),
('vip2', '$2b$10$hash_here', 'vip2@event.com');
\`\`\`

## 🧪 Step 6: Testing Multi-User Bidding

### 6.1 Pre-Event Testing

1. **Share your deployed URL** with team members
2. **Each person logs in** with different credentials:

   - Person 1: user1/password1
   - Person 2: user2/password2
   - Person 3: user3/password3
   - etc.

3. **Test scenarios**:
   - Multiple people bidding on same table
   - Rapid successive bids
   - Network disconnection/reconnection
   - Mobile device testing

### 6.2 Load Testing

1. Use the testing dashboard at `/test` (login as user1)
2. Activate multiple simulated users
3. Run automated bidding simulation
4. Monitor performance and database

## 📱 Step 7: Mobile Optimization

### 7.1 Test on Mobile Devices

- iOS Safari
- Android Chrome
- Various screen sizes
- Touch interactions

### 7.2 Performance Optimization

- Enable Vercel Edge Network
- Configure caching headers
- Optimize images

## 🔒 Step 8: Security & Monitoring

### 8.1 Security Checklist

- [ ] Environment variables secured
- [ ] Database RLS policies enabled
- [ ] Rate limiting configured
- [ ] HTTPS enabled

### 8.2 Monitoring Setup

1. **Health Check**: Monitor `/api/health`
2. **Error Tracking**: Check Vercel logs
3. **Database Monitoring**: Supabase dashboard
4. **Real-time Status**: Connection indicators in UI

## 🎯 Step 9: Go Live Checklist

### 9.1 Pre-Event (1 hour before)

- [ ] Verify event times are correct
- [ ] Test all user logins
- [ ] Check real-time updates working
- [ ] Verify mobile compatibility
- [ ] Monitor server health

### 9.2 During Event

- [ ] Monitor connection status
- [ ] Watch for bid conflicts
- [ ] Check database performance
- [ ] Support users with login issues

### 9.3 Post-Event

- [ ] Export bid results
- [ ] Backup database
- [ ] Generate reports
- [ ] Collect feedback

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Bidding has not started yet"

- Check your event times in database
- Ensure times are in IST format
- Verify current server time

#### 2. Real-time updates not working

- Check Supabase real-time is enabled
- Verify WebSocket connections
- Check browser console for errors

#### 3. Login issues

- Verify user credentials
- Check database connection
- Ensure authentication is working

#### 4. Bid conflicts

- This is normal behavior
- System shows appropriate errors
- Users should refresh and retry

#### 5. Performance issues

- Monitor database connections
- Check Vercel function limits
- Consider upgrading plans if needed

## 📞 Support Contacts

During your live event, ensure you have:

- Database admin access
- Vercel dashboard access
- Technical support contact
- Backup communication method

## 🎉 Success Metrics

Track these during your event:

- Total active users
- Total bids placed
- Average response time
- Connection stability
- User satisfaction

---

## 🔄 Quick Commands Reference

\`\`\`bash

# Deploy updates

vercel --prod

# Check logs

vercel logs

# Test locally

npm run dev

# Database backup

pg_dump your-database-url > backup.sql
\`\`\`

## 📊 Event Time Management

### To Change Event Times:

1. **Before Event**: Update database using SQL
2. **During Event**: Only extend end time if needed
3. **After Event**: Archive results

### SQL to Update Times:

\`\`\`sql
-- Extend event by 1 hour
UPDATE tables SET
bidding_ends_at = bidding_ends_at + INTERVAL '1 hour'
WHERE is_active = true;

-- Start event immediately
UPDATE tables SET
bidding_starts_at = NOW()
WHERE is_active = true;
\`\`\`

Remember: **Always test your complete setup before the live event!**

# 🚨 Vercel Deployment Troubleshooting

## Common Issues & Solutions

### 1. Build Failures

#### Error: "Module not found"

**Solution**: Check your imports and file paths
\`\`\`bash

# Test build locally first

npm run build
\`\`\`

#### Error: "Type errors"

**Solution**: Fix TypeScript errors
\`\`\`bash

# Check for type errors

npm run lint
\`\`\`

### 2. Environment Variables Missing

#### Error: "Missing environment variables"

**Solution**: Add them in Vercel dashboard

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Git Issues

#### Error: "No such file or directory"

**Solution**: Ensure all files are committed
\`\`\`bash

# Check git status

git status

# Add all files

git add .

# Commit changes

git commit -m "Fix deployment issues"

# Push to GitHub

git push origin main
\`\`\`

### 4. Vercel Configuration

#### Error: "Build command failed"

**Solution**: Check vercel.json configuration

#### Error: "Function timeout"

**Solution**: Increase timeout in vercel.json

### 5. Node.js Version Issues

#### Error: "Unsupported Node.js version"

**Solution**: Specify Node.js version in package.json

## Step-by-Step Deployment

### 1. Pre-deployment Checklist

\`\`\`bash

# Run deployment check

chmod +x scripts/deploy-check.sh
./scripts/deploy-check.sh
\`\`\`

### 2. Commit and Push

\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### 3. Deploy to Vercel

\`\`\`bash

# Install Vercel CLI if not installed

npm install -g vercel

# Login to Vercel

vercel login

# Deploy

vercel --prod
\`\`\`

### 4. Configure Environment Variables

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all required variables

### 5. Test Deployment

1. Visit your deployed URL
2. Test login functionality
3. Test bidding features

## Quick Fixes

### Fix 1: Clean Build

\`\`\`bash

# Remove build artifacts

rm -rf .next
rm -rf node_modules

# Reinstall dependencies

npm install

# Test build

npm run build
\`\`\`

### Fix 2: Update Dependencies

\`\`\`bash

# Update to latest versions

npm update

# Check for vulnerabilities

npm audit fix
\`\`\`

### Fix 3: Simplify Configuration

Remove complex configurations that might cause issues:

- Remove experimental features from next.config.mjs
- Simplify vercel.json
- Check for conflicting dependencies

## Environment Variables Template

Create these in Vercel dashboard:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Common Error Messages

### "Build failed with exit code 1"

- Check build logs in Vercel dashboard
- Test build locally: `npm run build`
- Fix any TypeScript/ESLint errors

### "Function execution timed out"

- Increase timeout in vercel.json
- Optimize slow API routes
- Check database connection

### "Module not found: Can't resolve"

- Check import paths
- Ensure all dependencies are in package.json
- Check file case sensitivity

## Getting Help

If deployment still fails:

1. Check Vercel build logs
2. Test locally with `npm run build`
3. Verify all environment variables
4. Check GitHub repository has all files
5. Try deploying a minimal version first

# StratoAI Backend - Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase project configured
- Stripe account with API keys
- Resend account with API key
- GitHub token for repository analysis
- Cloud storage for backups (S3, Google Cloud, etc.)

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_POOL_SIZE=10

# Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Email Service
RESEND_API_KEY=re_your_resend_api_key
RESEND_WEBHOOK_SECRET=your_resend_webhook_secret

# Repository Analysis
GITHUB_TOKEN=ghp_your_github_token
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Security
ALLOWED_ORIGINS=https://stratoai.com,https://app.stratoai.com

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn
ENABLE_METRICS=true
```

### Staging Environment Variables

```bash
STAGING_SUPABASE_URL=your_staging_supabase_url
STAGING_SUPABASE_ANON_KEY=your_staging_anon_key
STAGING_SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
STAGING_STRIPE_SECRET_KEY=sk_test_staging_key
STAGING_RESEND_API_KEY=re_staging_key
STAGING_JWT_SECRET=staging_jwt_secret
```

## 🚀 Deployment Process

### 1. Manual Deployment

```bash
# Install dependencies
npm ci

# Run tests
npm test
npm run test:integration

# Run security audit
npm run security:audit

# Deploy to staging
npm run deploy:staging

# Deploy to production (requires manual approval)
npm run deploy:production
```

### 2. Automated Deployment (GitHub Actions)

The project includes GitHub Actions workflows for automated deployment:

- **Staging**: Automatically deploys when pushing to `staging` branch
- **Production**: Automatically deploys when pushing to `main` branch

#### Required GitHub Secrets

```
# Production
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
RESEND_API_KEY
JWT_SECRET
SENTRY_DSN

# Staging
STAGING_SUPABASE_URL
STAGING_SUPABASE_ANON_KEY
STAGING_SUPABASE_SERVICE_ROLE_KEY
STAGING_STRIPE_SECRET_KEY
STAGING_RESEND_API_KEY
STAGING_JWT_SECRET
```

### 3. Database Migrations

```bash
# Run migrations manually
supabase db push

# Or use the deployment script
node scripts/deploy.js
```

## 🔒 Security Checklist

### Pre-deployment Security Checks

- [ ] All environment variables are properly set
- [ ] JWT_SECRET is at least 32 characters long
- [ ] HTTPS is enforced in production
- [ ] CORS origins are properly configured
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Input sanitization is active
- [ ] No sensitive data in logs
- [ ] Database RLS policies are enabled
- [ ] Webhook signatures are verified

### Security Headers

The application automatically sets these security headers in production:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## 📊 Monitoring & Alerting

### Health Checks

- **Basic**: `GET /health`
- **Detailed**: `GET /api/health`

### Monitoring Endpoints

- **Metrics**: Built-in request/response metrics
- **Cron Job Status**: `/api/cron/{jobName}/stats`
- **Webhook Health**: Automatic failure tracking

### Sentry Integration

Configure Sentry for error monitoring:

```bash
SENTRY_DSN=your_sentry_dsn
```

### Alert Thresholds

- Error rate: 5%
- Response time: 5 seconds
- Webhook failures: 3 consecutive
- Cron job failures: 2 consecutive

## 💾 Backup Strategy

### Automated Backups

```bash
# Create backup
npm run backup

# Backup is automatically uploaded to cloud storage
# Old backups are cleaned up (7-day retention)
```

### Backup Schedule

- **Production**: Daily at 2 AM UTC
- **Staging**: Weekly
- **Retention**: 7 days local, 30 days cloud

### Restore Process

1. Download backup from cloud storage
2. Stop application
3. Restore database: `supabase db reset --file backup.sql`
4. Start application
5. Verify functionality

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variable Missing

```bash
Error: Missing required environment variables: JWT_SECRET
```

**Solution**: Ensure all required environment variables are set.

#### 2. Database Connection Failed

```bash
Error: Failed to connect to Supabase
```

**Solution**: 
- Check SUPABASE_URL and keys
- Verify network connectivity
- Check Supabase project status

#### 3. Webhook Signature Verification Failed

```bash
Error: Invalid webhook signature
```

**Solution**:
- Verify webhook secrets match
- Check request headers
- Ensure raw body is used for verification

#### 4. High Error Rate Alert

**Solution**:
- Check application logs
- Verify database connectivity
- Check external service status
- Review recent deployments

### Log Analysis

```bash
# View application logs
docker logs stratoai-backend

# Filter error logs
docker logs stratoai-backend | grep ERROR

# Monitor real-time logs
docker logs -f stratoai-backend
```

## 📈 Performance Optimization

### Database Optimization

- Use connection pooling (SUPABASE_POOL_SIZE)
- Enable query optimization
- Monitor slow queries
- Use appropriate indexes

### Caching Strategy

- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

### Rate Limiting

- API endpoints: 100 requests/minute
- Authentication: 5 attempts/15 minutes
- Webhooks: 1000 requests/minute

## 🔄 Rollback Procedure

### Automatic Rollback

GitHub Actions includes automatic rollback on deployment failure.

### Manual Rollback

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or deploy specific version
git checkout <previous-commit>
npm run deploy:production
```

### Database Rollback

```bash
# Restore from backup
supabase db reset --file backup-previous.sql

# Run any necessary data migrations
node scripts/migrate-data.js
```

## 📞 Support

For deployment issues:

1. Check this documentation
2. Review application logs
3. Check monitoring dashboards
4. Contact DevOps team
5. Create incident ticket

---

**Last Updated**: December 2024  
**Version**: 1.0.0
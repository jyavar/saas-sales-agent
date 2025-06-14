# StratoAI Backend - Security Guide

## 🔒 Security Overview

This document outlines the security measures implemented in the StratoAI Backend and provides guidelines for maintaining security in production.

## 🛡️ Security Features

### 1. Authentication & Authorization

#### JWT-based Authentication
- Secure token generation with configurable expiration
- Minimum 32-character secret requirement
- Automatic token refresh mechanism
- Secure logout with token invalidation

#### Role-based Access Control (RBAC)
- **Admin**: Full system access
- **Owner**: Tenant management and user administration
- **User**: Standard application features

#### Multi-tenant Security
- Tenant-based data isolation
- Row Level Security (RLS) policies
- Automatic tenant context validation

### 2. Input Validation & Sanitization

#### Zod Schema Validation
- Comprehensive input validation for all endpoints
- Type-safe data processing
- Custom validation rules for business logic

#### XSS Prevention
- Automatic HTML sanitization
- Script tag removal
- Event handler attribute filtering

#### SQL Injection Protection
- Parameterized queries via Supabase
- Input validation before database operations
- Prepared statements for all queries

### 3. Network Security

#### HTTPS Enforcement
- Automatic HTTPS redirect in production
- Strict Transport Security (HSTS) headers
- Secure cookie flags

#### CORS Configuration
- Configurable allowed origins
- Credential support for authenticated requests
- Preflight request handling

#### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 4. Rate Limiting

#### Endpoint Protection
- **Authentication**: 5 attempts per 15 minutes
- **API Endpoints**: 100 requests per minute
- **Webhooks**: 1000 requests per minute

#### IP-based Tracking
- Automatic cleanup of old entries
- Configurable time windows
- Custom rate limits per endpoint type

### 5. Data Protection

#### Encryption at Rest
- Database encryption via Supabase
- Secure environment variable storage
- Encrypted backup files

#### Encryption in Transit
- TLS 1.2+ for all communications
- Certificate pinning for external APIs
- Secure webhook payload transmission

#### Sensitive Data Handling
- No sensitive data in logs
- Automatic credential masking
- Secure token storage

### 6. Webhook Security

#### Signature Verification
- HMAC-SHA256 signature validation
- Timestamp verification to prevent replay attacks
- Provider-specific signature formats

#### Idempotency Protection
- Event deduplication
- Automatic retry handling
- Failure tracking and alerting

## 🔧 Security Configuration

### Environment Variables

#### Required Security Variables
```bash
JWT_SECRET=minimum_32_character_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
RESEND_WEBHOOK_SECRET=your_resend_webhook_secret
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
```

#### Security Settings
```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://stratoai.com,https://app.stratoai.com
ENABLE_HTTPS_REDIRECT=true
ENABLE_SECURITY_HEADERS=true
```

### Database Security

#### Row Level Security Policies
```sql
-- Users can only access their own tenant data
CREATE POLICY "tenant_isolation" ON campaigns
  FOR ALL USING (
    tenant_id IN (
      SELECT id FROM tenants WHERE owner_id = auth.uid()
    )
  );
```

#### Service Role Usage
- Limited to server-side operations only
- Never exposed to client-side code
- Separate keys for different environments

### API Security

#### Authentication Middleware
```javascript
// Verify JWT token
const token = req.headers.authorization?.replace('Bearer ', '');
const user = await verifyToken(token);

// Check user permissions
if (!hasPermission(user, requiredRole)) {
  throw new ForbiddenError();
}
```

#### Input Validation
```javascript
// Validate all inputs
const validation = validateData(req.body, schema);
if (!validation.success) {
  throw new ValidationError(validation.errors);
}
```

## 🚨 Security Monitoring

### Error Tracking

#### Sentry Integration
- Automatic error capture
- Security event monitoring
- Performance tracking
- User context preservation

#### Alert Thresholds
- **High Error Rate**: >5% of requests
- **Authentication Failures**: >10 per minute
- **Rate Limit Violations**: >50 per minute
- **Webhook Failures**: >3 consecutive failures

### Audit Logging

#### Security Events
- Authentication attempts (success/failure)
- Authorization failures
- Rate limit violations
- Webhook signature failures
- Admin actions

#### Log Format
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "WARN",
  "event": "auth_failure",
  "requestId": "req-123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "email": "user@example.com",
    "reason": "invalid_password"
  }
}
```

## 🔍 Security Testing

### Automated Security Checks

#### GitHub Actions Security Scan
```yaml
- name: Run security audit
  run: npm audit --audit-level=high

- name: Check for vulnerabilities
  run: |
    if npm audit --audit-level=high --json | jq '.vulnerabilities | length' | grep -q '^0$'; then
      echo "No high-severity vulnerabilities found"
    else
      echo "High-severity vulnerabilities detected"
      exit 1
    fi
```

#### Dependency Scanning
- Automatic vulnerability detection
- High-severity vulnerability blocking
- Regular dependency updates

### Manual Security Testing

#### Penetration Testing Checklist
- [ ] SQL injection attempts
- [ ] XSS payload testing
- [ ] Authentication bypass attempts
- [ ] Authorization escalation tests
- [ ] Rate limiting validation
- [ ] CORS policy verification
- [ ] Webhook signature tampering
- [ ] Session management testing

## 🚨 Incident Response

### Security Incident Procedure

#### 1. Detection
- Monitor security alerts
- Review error logs
- Check authentication failures
- Analyze unusual traffic patterns

#### 2. Assessment
- Determine incident severity
- Identify affected systems
- Assess data exposure risk
- Document initial findings

#### 3. Containment
- Block malicious IPs
- Revoke compromised tokens
- Disable affected accounts
- Isolate affected systems

#### 4. Recovery
- Apply security patches
- Reset compromised credentials
- Restore from clean backups
- Verify system integrity

#### 5. Post-Incident
- Document lessons learned
- Update security procedures
- Implement additional controls
- Notify stakeholders if required

### Emergency Contacts

#### Security Team
- **Primary**: security@stratoai.com
- **Secondary**: devops@stratoai.com
- **Emergency**: +1-XXX-XXX-XXXX

#### External Resources
- **Supabase Support**: support@supabase.com
- **Stripe Security**: security@stripe.com
- **Resend Support**: support@resend.com

## 📋 Security Checklist

### Pre-deployment Security Review

#### Environment Security
- [ ] All secrets properly configured
- [ ] No hardcoded credentials in code
- [ ] Environment variables validated
- [ ] HTTPS enforced in production
- [ ] Security headers enabled

#### Application Security
- [ ] Input validation implemented
- [ ] Authentication working correctly
- [ ] Authorization rules enforced
- [ ] Rate limiting configured
- [ ] Error handling secure

#### Database Security
- [ ] RLS policies enabled
- [ ] Service role keys secured
- [ ] Connection encryption enabled
- [ ] Backup encryption configured
- [ ] Access logs enabled

#### API Security
- [ ] Webhook signatures verified
- [ ] CORS properly configured
- [ ] Request logging enabled
- [ ] Error responses sanitized
- [ ] Admin endpoints protected

### Regular Security Maintenance

#### Weekly Tasks
- [ ] Review security logs
- [ ] Check for failed authentication attempts
- [ ] Monitor rate limiting violations
- [ ] Verify webhook health

#### Monthly Tasks
- [ ] Update dependencies
- [ ] Review access permissions
- [ ] Audit user accounts
- [ ] Test backup restoration

#### Quarterly Tasks
- [ ] Security penetration testing
- [ ] Review and update policies
- [ ] Security training for team
- [ ] Incident response drill

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)
- [Helmet.js](https://helmetjs.github.io/)

### Training
- Security awareness training
- Secure coding practices
- Incident response procedures
- Regular security updates

---

**Last Updated**: December 2024  
**Security Version**: 1.0.0  
**Next Review**: March 2025
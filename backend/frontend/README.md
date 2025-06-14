# Strato AI Sales Agent - Frontend

Multi-tenant Next.js 14 frontend for the Strato AI Sales Agent platform.

## 🎯 Features

### ✅ Multi-Tenant Architecture
- **Subdomain Detection**: Automatic tenant detection from subdomain (e.g., `acme.stratoai.app`)
- **Tenant Context**: Global tenant context with branding and settings
- **Dynamic Routing**: Tenant-aware routing with middleware
- **Tenant Isolation**: Complete data isolation between tenants

### ✅ Authentication Integration
- **JWT Authentication**: Seamless integration with backend JWT
- **Tenant-Aware Auth**: Authentication with tenant context
- **Session Management**: Automatic session refresh and validation
- **Protected Routes**: Route guards for authenticated areas

### ✅ Dynamic Branding
- **Custom Colors**: Tenant-specific primary and secondary colors
- **Logo Support**: Custom tenant logos
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Responsive Design**: Mobile-first responsive design

### ✅ Feature Flags
- **Plan-Based Features**: Features enabled/disabled based on tenant plan
- **Dynamic UI**: UI adapts based on available features
- **Graceful Degradation**: Smooth handling of disabled features

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Multi-Tenant Setup

#### Option 1: Using Subdomain (Recommended)
1. Add to your `/etc/hosts` file:
   ```
   127.0.0.1 acme.localhost
   127.0.0.1 demo.localhost
   ```
2. Visit: `http://acme.localhost:3000`

#### Option 2: Using Headers
Visit `http://localhost:3000` and the middleware will handle tenant detection.

## 🏗️ Architecture

### Middleware Flow
```
Request → Middleware → Tenant Detection → Route Rewrite → App
```

1. **Middleware** (`middleware.ts`):
   - Extracts tenant slug from subdomain
   - Rewrites URL to include tenant context
   - Sets headers for tenant information

2. **Tenant Provider** (`TenantContext.tsx`):
   - Fetches tenant data from backend
   - Provides tenant context to entire app
   - Handles tenant loading and error states

3. **Theme Provider** (`ThemeContext.tsx`):
   - Applies tenant branding (colors, logo)
   - Updates CSS custom properties
   - Provides theme utilities

4. **Auth Hook** (`use-auth.ts`):
   - Manages user authentication
   - Includes tenant context in API calls
   - Handles session persistence

### File Structure
```
frontend/
├── app/
│   ├── tenant/[slug]/          # Tenant-specific routes
│   │   ├── layout.tsx          # Tenant layout with providers
│   │   ├── page.tsx            # Tenant home (login/redirect)
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── leads/              # Leads management
│   │   ├── campaigns/          # Campaign management
│   │   └── settings/           # Settings pages
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles with CSS variables
├── components/
│   ├── auth/                   # Authentication components
│   ├── guards/                 # Route guards
│   ├── layout/                 # Layout components
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   └── api/                    # API client
└── middleware.ts               # Next.js middleware
```

## 🎨 Theming System

### CSS Custom Properties
The theming system uses CSS custom properties that are dynamically updated:

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-primary-rgb: 59, 130, 246;
  --color-secondary-rgb: 100, 116, 139;
}
```

### Tailwind Integration
Tailwind classes use the CSS variables:

```css
.bg-primary {
  background-color: var(--color-primary);
}

.text-primary {
  color: var(--color-primary);
}
```

### Dynamic Updates
Theme colors are updated when tenant context changes:

```typescript
useEffect(() => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', primaryColor);
  root.style.setProperty('--color-secondary', secondaryColor);
}, [primaryColor, secondaryColor]);
```

## 🔐 Authentication Flow

### 1. User visits tenant subdomain
```
https://acme.stratoai.app → Middleware detects "acme"
```

### 2. Tenant context loaded
```typescript
const { tenant, isLoading, error } = useTenant();
```

### 3. Authentication check
```typescript
const { isAuthenticated, login } = useAuth();
```

### 4. API calls include tenant context
```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'X-Tenant-ID': tenantSlug,
  'Content-Type': 'application/json'
};
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Layout Adaptation
- **Mobile**: Collapsible sidebar, stacked layout
- **Tablet**: Condensed sidebar, responsive grid
- **Desktop**: Full sidebar, multi-column layout

## 🧪 Testing Multi-Tenant

### Test Scenarios

1. **Different Tenants**:
   ```bash
   # Tenant A
   http://acme.localhost:3000
   
   # Tenant B  
   http://demo.localhost:3000
   ```

2. **Tenant Not Found**:
   ```bash
   http://nonexistent.localhost:3000
   # Should show "Organization Not Found"
   ```

3. **No Tenant (Main Site)**:
   ```bash
   http://localhost:3000
   # Should redirect to main site
   ```

### Backend Integration

Ensure your backend is running with multi-tenant support:

```bash
# Backend should be running on port 3000
npm start

# Test tenant endpoint
curl -H "X-Tenant-ID: acme" http://localhost:3000/api/tenant
```

## 🚀 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.stratoai.com
```

### Build and Deploy
```bash
npm run build
npm start
```

### Domain Configuration
Configure your DNS to point subdomains to your deployment:

```
*.stratoai.app → Your deployment
acme.stratoai.app → Your deployment  
demo.stratoai.app → Your deployment
```

## 🔧 Customization

### Adding New Features
1. Check tenant feature flags:
   ```typescript
   const { tenant } = useTenant();
   const featureEnabled = tenant?.settings?.features?.newFeature;
   ```

2. Conditionally render UI:
   ```typescript
   {featureEnabled && <NewFeatureComponent />}
   ```

### Custom Branding
1. Update tenant settings in backend
2. Frontend automatically applies new branding
3. CSS custom properties update dynamically

### New Tenant Plans
1. Add plan limits in backend
2. Update UI to respect new limits
3. Add plan-specific features

## 📞 Support

- **Documentation**: Available in `/docs`
- **API Reference**: Backend provides OpenAPI docs
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests

---

**🎯 The frontend is now fully integrated with the multi-tenant backend and ready for production deployment!**
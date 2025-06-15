"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TenantLayout;
const TenantContext_1 = require("@/lib/contexts/TenantContext");
const ThemeContext_1 = require("@/lib/contexts/ThemeContext");
const TenantGuard_1 = require("@/components/guards/TenantGuard");
const headers_1 = require("next/headers");
function TenantLayout({ children, params }) {
    const headersList = (0, headers_1.headers)();
    const tenantSlug = headersList.get('x-tenant-slug') || params.slug;
    return (<TenantContext_1.TenantProvider tenantSlug={tenantSlug}>
      <ThemeContext_1.ThemeProvider>
        <TenantGuard_1.TenantGuard>
          {children}
        </TenantGuard_1.TenantGuard>
      </ThemeContext_1.ThemeProvider>
    </TenantContext_1.TenantProvider>);
}

"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TenantHomePage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const TenantContext_1 = require("@/lib/contexts/TenantContext");
const use_auth_1 = require("@/lib/hooks/use-auth");
const LoadingSpinner_1 = require("@/components/ui/LoadingSpinner");
const LoginForm_1 = require("@/components/auth/LoginForm");
function TenantHomePage({ params }) {
    var _a, _b;
    const router = (0, navigation_1.useRouter)();
    const { tenant, isLoading: tenantLoading, error: tenantError } = (0, TenantContext_1.useTenant)();
    const { isAuthenticated, isLoading: authLoading } = (0, use_auth_1.useAuth)();
    // Redirect authenticated users to dashboard
    (0, react_1.useEffect)(() => {
        if (!authLoading && !tenantLoading && isAuthenticated && tenant) {
            router.push(`/tenant/${params.slug}/dashboard`);
        }
    }, [isAuthenticated, authLoading, tenantLoading, tenant, router, params.slug]);
    // Show loading while checking tenant and auth
    if (tenantLoading || authLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner_1.LoadingSpinner size="lg"/>
      </div>);
    }
    // Show error if tenant not found or inactive
    if (tenantError) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {tenantError === 'Tenant not found' ? 'Organization Not Found' : 'Access Denied'}
          </h1>
          <p className="text-gray-600 mb-6">
            {tenantError === 'Tenant not found'
                ? 'The organization you\'re looking for doesn\'t exist or has been removed.'
                : 'This organization is currently inactive.'}
          </p>
          <a href="https://stratoai.org" className="text-blue-600 hover:text-blue-800 underline">
            Return to Strato AI
          </a>
        </div>
      </div>);
    }
    // Show login form for unauthenticated users
    if (!isAuthenticated) {
        return (<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            {((_b = (_a = tenant === null || tenant === void 0 ? void 0 : tenant.settings) === null || _a === void 0 ? void 0 : _a.branding) === null || _b === void 0 ? void 0 : _b.logo) ? (<img className="mx-auto h-12 w-auto" src={tenant.settings.branding.logo} alt={tenant.name}/>) : (<h2 className="text-3xl font-bold text-gray-900">
                {(tenant === null || tenant === void 0 ? void 0 : tenant.name) || 'Strato AI'}
              </h2>)}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your {(tenant === null || tenant === void 0 ? void 0 : tenant.name) || 'organization'} dashboard
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm_1.LoginForm />
          </div>
        </div>
      </div>);
    }
    // This shouldn't be reached due to the redirect effect above
    return (<div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner_1.LoadingSpinner size="lg"/>
    </div>);
}

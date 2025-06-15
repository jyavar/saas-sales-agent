"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const TenantContext_1 = require("@/lib/contexts/TenantContext");
const ThemeContext_1 = require("@/lib/contexts/ThemeContext");
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Leads', href: '/leads', icon: 'leads' },
    { name: 'Campaigns', href: '/campaigns', icon: 'campaigns', feature: 'campaigns' },
    { name: 'Analytics', href: '/analytics', icon: 'analytics', feature: 'analytics' },
    { name: 'Settings', href: '/settings', icon: 'settings' },
];
const icons = {
    dashboard: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z"/>
    </svg>),
    leads: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>),
    campaigns: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>),
    analytics: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>),
    settings: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>),
};
function Sidebar() {
    var _a;
    const pathname = (0, navigation_1.usePathname)();
    const { tenant, tenantSlug } = (0, TenantContext_1.useTenant)();
    const { logo, tenantName, primaryColor } = (0, ThemeContext_1.useTheme)();
    // Filter navigation based on tenant features
    const filteredNavigation = navigation.filter(item => {
        var _a, _b, _c;
        if (!item.feature)
            return true;
        return (_c = (_b = (_a = tenant === null || tenant === void 0 ? void 0 : tenant.settings) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b[item.feature]) !== null && _c !== void 0 ? _c : true;
    });
    return (<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200">
          <link_1.default href={`/tenant/${tenantSlug}/dashboard`} className="flex items-center">
            {logo ? (<img className="h-8 w-auto" src={logo} alt={tenantName}/>) : (<div className="flex items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  {tenantName.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  {tenantName}
                </span>
              </div>)}
          </link_1.default>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {filteredNavigation.map((item) => {
            const href = `/tenant/${tenantSlug}${item.href}`;
            const isActive = pathname === href;
            return (<link_1.default key={item.name} href={href} className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <span className={`mr-3 flex-shrink-0 ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {icons[item.icon]}
                  </span>
                  {item.name}
                </link_1.default>);
        })}
          </nav>
        </div>

        {/* Tenant Info */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                {((_a = tenant === null || tenant === void 0 ? void 0 : tenant.name) === null || _a === void 0 ? void 0 : _a.charAt(0).toUpperCase()) || 'T'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {(tenant === null || tenant === void 0 ? void 0 : tenant.name) || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {(tenant === null || tenant === void 0 ? void 0 : tenant.plan) || 'free'} plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);
}

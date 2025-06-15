"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsPage;
const DashboardLayout_1 = require("@/components/layout/DashboardLayout");
const TenantSettings_1 = require("@/components/settings/TenantSettings");
const BrandingSettings_1 = require("@/components/settings/BrandingSettings");
const TeamSettings_1 = require("@/components/settings/TeamSettings");
const ApiKeySettings_1 = require("@/components/settings/ApiKeySettings");
const react_1 = require("react");
const tabs = [
    { id: 'general', name: 'General', component: TenantSettings_1.TenantSettings },
    { id: 'branding', name: 'Branding', component: BrandingSettings_1.BrandingSettings },
    { id: 'team', name: 'Team', component: TeamSettings_1.TeamSettings },
    { id: 'api', name: 'API Keys', component: ApiKeySettings_1.ApiKeySettings },
];
function SettingsPage() {
    var _a;
    const [activeTab, setActiveTab] = (0, react_1.useState)('general');
    const ActiveComponent = ((_a = tabs.find(tab => tab.id === activeTab)) === null || _a === void 0 ? void 0 : _a.component) || TenantSettings_1.TenantSettings;
    return (<DashboardLayout_1.DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your organization settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.name}
              </button>))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          <ActiveComponent />
        </div>
      </div>
    </DashboardLayout_1.DashboardLayout>);
}

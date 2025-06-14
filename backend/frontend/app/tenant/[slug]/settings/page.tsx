'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TenantSettings } from '@/components/settings/TenantSettings';
import { BrandingSettings } from '@/components/settings/BrandingSettings';
import { TeamSettings } from '@/components/settings/TeamSettings';
import { ApiKeySettings } from '@/components/settings/ApiKeySettings';
import { useState } from 'react';

const tabs = [
  { id: 'general', name: 'General', component: TenantSettings },
  { id: 'branding', name: 'Branding', component: BrandingSettings },
  { id: 'team', name: 'Team', component: TeamSettings },
  { id: 'api', name: 'API Keys', component: ApiKeySettings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || TenantSettings;

  return (
    <DashboardLayout>
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg">
          <ActiveComponent />
        </div>
      </div>
    </DashboardLayout>
  );
}
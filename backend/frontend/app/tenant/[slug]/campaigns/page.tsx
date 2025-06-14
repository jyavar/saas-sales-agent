'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CampaignsTable } from '@/components/campaigns/CampaignsTable';
import { CreateCampaignButton } from '@/components/campaigns/CreateCampaignButton';
import { useTenant } from '@/lib/contexts/TenantContext';

export default function CampaignsPage() {
  const { tenant } = useTenant();

  // Check if campaigns feature is enabled
  const campaignsEnabled = tenant?.settings?.features?.campaigns ?? true;

  if (!campaignsEnabled) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Campaigns Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            The campaigns feature is not enabled for your plan.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Upgrade Plan
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">
              Create and manage your email campaigns
            </p>
          </div>
          <CreateCampaignButton />
        </div>

        {/* Campaigns Table */}
        <CampaignsTable />
      </div>
    </DashboardLayout>
  );
}
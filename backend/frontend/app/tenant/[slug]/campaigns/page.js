"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CampaignsPage;
const DashboardLayout_1 = require("@/components/layout/DashboardLayout");
const CampaignsTable_1 = require("@/components/campaigns/CampaignsTable");
const CreateCampaignButton_1 = require("@/components/campaigns/CreateCampaignButton");
const TenantContext_1 = require("@/lib/contexts/TenantContext");
function CampaignsPage() {
    var _a, _b, _c;
    const { tenant } = (0, TenantContext_1.useTenant)();
    // Check if campaigns feature is enabled
    const campaignsEnabled = (_c = (_b = (_a = tenant === null || tenant === void 0 ? void 0 : tenant.settings) === null || _a === void 0 ? void 0 : _a.features) === null || _b === void 0 ? void 0 : _b.campaigns) !== null && _c !== void 0 ? _c : true;
    if (!campaignsEnabled) {
        return (<DashboardLayout_1.DashboardLayout>
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
      </DashboardLayout_1.DashboardLayout>);
    }
    return (<DashboardLayout_1.DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">
              Create and manage your email campaigns
            </p>
          </div>
          <CreateCampaignButton_1.CreateCampaignButton />
        </div>

        {/* Campaigns Table */}
        <CampaignsTable_1.CampaignsTable />
      </div>
    </DashboardLayout_1.DashboardLayout>);
}

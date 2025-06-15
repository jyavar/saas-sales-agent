"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const DashboardLayout_1 = require("@/components/layout/DashboardLayout");
const DashboardStats_1 = require("@/components/dashboard/DashboardStats");
const RecentLeads_1 = require("@/components/dashboard/RecentLeads");
const CampaignOverview_1 = require("@/components/dashboard/CampaignOverview");
const QuickActions_1 = require("@/components/dashboard/QuickActions");
function DashboardPage() {
    return (<DashboardLayout_1.DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your sales activities.
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats_1.DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <RecentLeads_1.RecentLeads />
            <CampaignOverview_1.CampaignOverview />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions_1.QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout_1.DashboardLayout>);
}

"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeadsPage;
const DashboardLayout_1 = require("@/components/layout/DashboardLayout");
const LeadsTable_1 = require("@/components/leads/LeadsTable");
const LeadsFilters_1 = require("@/components/leads/LeadsFilters");
const CreateLeadButton_1 = require("@/components/leads/CreateLeadButton");
const react_1 = require("react");
function LeadsPage() {
    const [filters, setFilters] = (0, react_1.useState)({
        search: '',
        status: '',
        source: '',
        priority: '',
    });
    return (<DashboardLayout_1.DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">
              Manage and track your sales leads
            </p>
          </div>
          <CreateLeadButton_1.CreateLeadButton />
        </div>

        {/* Filters */}
        <LeadsFilters_1.LeadsFilters filters={filters} onFiltersChange={setFilters}/>

        {/* Leads Table */}
        <LeadsTable_1.LeadsTable filters={filters}/>
      </div>
    </DashboardLayout_1.DashboardLayout>);
}

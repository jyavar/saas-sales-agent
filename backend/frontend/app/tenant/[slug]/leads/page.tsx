'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadsFilters } from '@/components/leads/LeadsFilters';
import { CreateLeadButton } from '@/components/leads/CreateLeadButton';
import { useState } from 'react';

export default function LeadsPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    priority: '',
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">
              Manage and track your sales leads
            </p>
          </div>
          <CreateLeadButton />
        </div>

        {/* Filters */}
        <LeadsFilters filters={filters} onFiltersChange={setFilters} />

        {/* Leads Table */}
        <LeadsTable filters={filters} />
      </div>
    </DashboardLayout>
  );
}
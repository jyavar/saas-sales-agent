"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLayout = DashboardLayout;
const Sidebar_1 = require("./Sidebar");
const Header_1 = require("./Header");
const use_auth_1 = require("@/lib/hooks/use-auth");
const LoadingSpinner_1 = require("@/components/ui/LoadingSpinner");
function DashboardLayout({ children }) {
    const { isLoading, isAuthenticated } = (0, use_auth_1.useAuth)();
    // Show loading while checking authentication
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner_1.LoadingSpinner size="lg"/>
      </div>);
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to access the dashboard.
          </p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <Sidebar_1.Sidebar />
      
      <div className="lg:pl-64">
        <Header_1.Header />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>);
}

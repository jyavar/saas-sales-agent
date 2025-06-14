import { TenantProvider } from '@/lib/contexts/TenantContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { TenantGuard } from '@/components/guards/TenantGuard';
import { headers } from 'next/headers';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
  const headersList = headers();
  const tenantSlug = headersList.get('x-tenant-slug') || params.slug;

  return (
    <TenantProvider tenantSlug={tenantSlug}>
      <ThemeProvider>
        <TenantGuard>
          {children}
        </TenantGuard>
      </ThemeProvider>
    </TenantProvider>
  );
}
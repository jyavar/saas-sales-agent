'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTenant } from './TenantContext';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  tenantName: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  resetToDefaults: () => void;
}

const defaultTheme = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  tenantName: 'Strato AI',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { tenant } = useTenant();
  const [primaryColor, setPrimaryColorState] = useState(defaultTheme.primaryColor);
  const [secondaryColor, setSecondaryColorState] = useState(defaultTheme.secondaryColor);
  const [logo, setLogo] = useState<string | undefined>();
  const [tenantName, setTenantName] = useState(defaultTheme.tenantName);

  // Update theme when tenant changes
  useEffect(() => {
    if (tenant?.settings?.branding) {
      const { branding } = tenant.settings;
      setPrimaryColorState(branding.primaryColor || defaultTheme.primaryColor);
      setSecondaryColorState(branding.secondaryColor || defaultTheme.secondaryColor);
      setLogo(branding.logo);
      setTenantName(tenant.name || defaultTheme.tenantName);
    } else {
      // Reset to defaults when no tenant
      setPrimaryColorState(defaultTheme.primaryColor);
      setSecondaryColorState(defaultTheme.secondaryColor);
      setLogo(undefined);
      setTenantName(defaultTheme.tenantName);
    }
  }, [tenant]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    
    // Convert hex to RGB for alpha variants
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);

    if (primaryRgb) {
      root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }

    if (secondaryRgb) {
      root.style.setProperty('--color-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }
  }, [primaryColor, secondaryColor]);

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const setSecondaryColor = (color: string) => {
    setSecondaryColorState(color);
  };

  const resetToDefaults = () => {
    setPrimaryColorState(defaultTheme.primaryColor);
    setSecondaryColorState(defaultTheme.secondaryColor);
    setLogo(undefined);
    setTenantName(defaultTheme.tenantName);
  };

  const value: ThemeContextType = {
    primaryColor,
    secondaryColor,
    logo,
    tenantName,
    setPrimaryColor,
    setSecondaryColor,
    resetToDefaults,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = ThemeProvider;
exports.useTheme = useTheme;
const react_1 = __importStar(require("react"));
const TenantContext_1 = require("./TenantContext");
const defaultTheme = {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    tenantName: 'Strato AI',
};
const ThemeContext = (0, react_1.createContext)(undefined);
function ThemeProvider({ children }) {
    const { tenant } = (0, TenantContext_1.useTenant)();
    const [primaryColor, setPrimaryColorState] = (0, react_1.useState)(defaultTheme.primaryColor);
    const [secondaryColor, setSecondaryColorState] = (0, react_1.useState)(defaultTheme.secondaryColor);
    const [logo, setLogo] = (0, react_1.useState)();
    const [tenantName, setTenantName] = (0, react_1.useState)(defaultTheme.tenantName);
    // Update theme when tenant changes
    (0, react_1.useEffect)(() => {
        var _a;
        if ((_a = tenant === null || tenant === void 0 ? void 0 : tenant.settings) === null || _a === void 0 ? void 0 : _a.branding) {
            const { branding } = tenant.settings;
            setPrimaryColorState(branding.primaryColor || defaultTheme.primaryColor);
            setSecondaryColorState(branding.secondaryColor || defaultTheme.secondaryColor);
            setLogo(branding.logo);
            setTenantName(tenant.name || defaultTheme.tenantName);
        }
        else {
            // Reset to defaults when no tenant
            setPrimaryColorState(defaultTheme.primaryColor);
            setSecondaryColorState(defaultTheme.secondaryColor);
            setLogo(undefined);
            setTenantName(defaultTheme.tenantName);
        }
    }, [tenant]);
    // Apply CSS custom properties
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', primaryColor);
        root.style.setProperty('--color-secondary', secondaryColor);
        // Convert hex to RGB for alpha variants
        const hexToRgb = (hex) => {
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
    const setPrimaryColor = (color) => {
        setPrimaryColorState(color);
    };
    const setSecondaryColor = (color) => {
        setSecondaryColorState(color);
    };
    const resetToDefaults = () => {
        setPrimaryColorState(defaultTheme.primaryColor);
        setSecondaryColorState(defaultTheme.secondaryColor);
        setLogo(undefined);
        setTenantName(defaultTheme.tenantName);
    };
    const value = {
        primaryColor,
        secondaryColor,
        logo,
        tenantName,
        setPrimaryColor,
        setSecondaryColor,
        resetToDefaults,
    };
    return (<ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>);
}
function useTheme() {
    const context = (0, react_1.useContext)(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
exports.default = ThemeContext;

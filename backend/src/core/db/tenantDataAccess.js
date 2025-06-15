"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantById = getTenantById;
exports.listTenants = listTenants;
exports.createTenant = createTenant;
exports.updateTenant = updateTenant;
exports.deleteTenant = deleteTenant;
const supabase_js_1 = require("../../services/supabase.js");
const logger_js_1 = require("../../utils/common/logger.js");
function getTenantById(tenantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.query('tenants', {
                filters: { id: tenantId },
                limit: 1
            });
            if (!result.data || result.data.length === 0)
                return null;
            return result.data[0];
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] getTenantById failed', { error: error.message, tenantId });
            throw error;
        }
    });
}
function listTenants() {
    return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 50, offset = 0) {
        try {
            const result = yield supabase_js_1.supabaseService.query('tenants', {
                filters,
                limit,
                offset
            });
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] listTenants failed', { error: error.message });
            throw error;
        }
    });
}
function createTenant(tenant) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date().toISOString();
            const result = yield supabase_js_1.supabaseService.insert('tenants', Object.assign(Object.assign({}, tenant), { created_at: now, updated_at: now }), null);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] createTenant failed', { error: error.message, name: tenant.name });
            throw error;
        }
    });
}
function updateTenant(tenantId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.update('tenants', tenantId, Object.assign(Object.assign({}, updates), { updated_at: new Date().toISOString() }), null);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] updateTenant failed', { error: error.message, tenantId });
            throw error;
        }
    });
}
function deleteTenant(tenantId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase_js_1.supabaseService.delete('tenants', tenantId, null);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] deleteTenant failed', { error: error.message, tenantId });
            throw error;
        }
    });
}

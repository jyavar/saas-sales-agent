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
exports.getAgentActionById = getAgentActionById;
exports.listAgentActions = listAgentActions;
exports.createAgentAction = createAgentAction;
exports.updateAgentAction = updateAgentAction;
exports.deleteAgentAction = deleteAgentAction;
const supabase_js_1 = require("../../services/supabase.js");
const logger_js_1 = require("../../utils/common/logger.js");
function getAgentActionById(tenantId, actionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.query('agent_actions', {
                filters: { id: actionId, tenant_id: tenantId },
                limit: 1
            });
            if (!result.data || result.data.length === 0)
                return null;
            return result.data[0];
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] getAgentActionById failed', { error: error.message, actionId, tenantId });
            throw error;
        }
    });
}
function listAgentActions(tenantId_1) {
    return __awaiter(this, arguments, void 0, function* (tenantId, filters = {}, limit = 50, offset = 0) {
        try {
            const result = yield supabase_js_1.supabaseService.query('agent_actions', {
                filters: Object.assign(Object.assign({}, filters), { tenant_id: tenantId }),
                limit,
                offset
            });
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] listAgentActions failed', { error: error.message, tenantId });
            throw error;
        }
    });
}
function createAgentAction(tenantId, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date().toISOString();
            const result = yield supabase_js_1.supabaseService.insert('agent_actions', Object.assign(Object.assign({}, action), { tenant_id: tenantId, created_at: now, updated_at: now }), tenantId);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] createAgentAction failed', { error: error.message, tenantId, action_type: action.action_type });
            throw error;
        }
    });
}
function updateAgentAction(tenantId, actionId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.update('agent_actions', actionId, Object.assign(Object.assign({}, updates), { updated_at: new Date().toISOString() }), tenantId);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] updateAgentAction failed', { error: error.message, actionId, tenantId });
            throw error;
        }
    });
}
function deleteAgentAction(tenantId, actionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase_js_1.supabaseService.delete('agent_actions', actionId, tenantId);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] deleteAgentAction failed', { error: error.message, actionId, tenantId });
            throw error;
        }
    });
}

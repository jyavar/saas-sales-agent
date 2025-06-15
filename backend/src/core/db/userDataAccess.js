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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.listUsers = listUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.createUserWithAuth = createUserWithAuth;
exports.signInUser = signInUser;
exports.signOutUser = signOutUser;
exports.getUserByToken = getUserByToken;
exports.updateUserProfile = updateUserProfile;
const supabase_js_1 = require("../../services/supabase.js");
const logger_js_1 = require("../../utils/common/logger.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.query('users', {
                filters: { id: userId },
                limit: 1
            });
            if (!result.data || result.data.length === 0)
                return null;
            return result.data[0];
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] getUserById failed', { error: error.message, userId });
            throw error;
        }
    });
}
function listUsers() {
    return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 50, offset = 0) {
        try {
            const result = yield supabase_js_1.supabaseService.query('users', {
                filters,
                limit,
                offset
            });
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] listUsers failed', { error: error.message });
            throw error;
        }
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date().toISOString();
            const result = yield supabase_js_1.supabaseService.insert('users', Object.assign(Object.assign({}, user), { created_at: now, updated_at: now }), null);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] createUser failed', { error: error.message, email: user.email });
            throw error;
        }
    });
}
function updateUser(userId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.update('users', userId, Object.assign(Object.assign({}, updates), { updated_at: new Date().toISOString() }), null);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] updateUser failed', { error: error.message, userId });
            throw error;
        }
    });
}
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase_js_1.supabaseService.delete('users', userId, null);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] deleteUser failed', { error: error.message, userId });
            throw error;
        }
    });
}
function createUserWithAuth(email, password, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_js_1.supabaseService.client.auth.signUp({
                email,
                password,
                options: { data: { name } }
            });
            if (error)
                throw error;
            // Insert into users table
            const userProfile = {
                id: data.user.id,
                email,
                name,
                role: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            yield supabase_js_1.supabaseService.insert('users', userProfile, null);
            return { user: userProfile, session: data.session };
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] createUserWithAuth failed', { error: error.message, email });
            throw error;
        }
    });
}
function signInUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_js_1.supabaseService.client.auth.signInWithPassword({ email, password });
            if (error)
                throw error;
            // Get user profile
            const { data: profile, error: profileError } = yield supabase_js_1.supabaseService.adminClient
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();
            if (profileError)
                throw profileError;
            return { user: profile, session: data.session };
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] signInUser failed', { error: error.message, email });
            throw error;
        }
    });
}
function signOutUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_js_1.supabaseService.client.auth.signOut();
            if (error)
                throw error;
            return { success: true };
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] signOutUser failed', { error: error.message });
            throw error;
        }
    });
}
function getUserByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const userId = decoded.sub;
            return yield getUserById(userId);
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] getUserByToken failed', { error: error.message });
            return null;
        }
    });
}
function updateUserProfile(userId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield supabase_js_1.supabaseService.update('users', userId, Object.assign(Object.assign({}, updates), { updated_at: new Date().toISOString() }), null);
            return result.data;
        }
        catch (error) {
            logger_js_1.logger.error('[DAL] updateUserProfile failed', { error: error.message, userId });
            throw error;
        }
    });
}

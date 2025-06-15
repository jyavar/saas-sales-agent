/**
 * Enhanced Supabase service with multi-tenant support
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/common/logger.js';
import { DatabaseError } from '../utils/common/errorHandler.ts';

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required Supabase environment variables: ${missingVars.join(', ')}`);
}

// Create Supabase clients
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Enhanced Supabase service class with multi-tenant support
 */
export class SupabaseService {
  constructor() {
    this.client = supabase;
    this.adminClient = supabaseAdmin;
  }

  /**
   * Create user with Supabase Auth
   */
  async createUser(userData, req = null) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (error) {
        logger.error('User creation failed', {
          error: error.message,
          email: userData.email,
          requestId: req?.id
        });
        return { success: false, error: error.message };
      }

      // Create profile
      if (data.user) {
        const { error: profileError } = await this.adminClient
          .from('profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            role: 'user'
          });

        if (profileError) {
          logger.error('Profile creation failed', {
            error: profileError.message,
            userId: data.user.id,
            requestId: req?.id
          });
        }
      }

      logger.info('User created successfully', {
        userId: data.user?.id,
        email: userData.email,
        requestId: req?.id
      });

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      logger.error('User creation error', {
        error: error.message,
        requestId: req?.id
      });
      throw new DatabaseError('Failed to create user', error);
    }
  }

  /**
   * Sign in user
   */
  async signIn(email, password, req = null) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.warn('Sign in failed', {
          error: error.message,
          email,
          requestId: req?.id
        });
        return { success: false, error: 'Invalid credentials' };
      }

      // Get user profile
      const { data: profile, error: profileError } = await this.adminClient
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        logger.error('Profile fetch failed', {
          error: profileError.message,
          userId: data.user.id,
          requestId: req?.id
        });
      }

      logger.info('User signed in successfully', {
        userId: data.user.id,
        email,
        requestId: req?.id
      });

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.user_metadata?.name,
          role: profile?.role || 'user'
        },
        session: data.session
      };
    } catch (error) {
      logger.error('Sign in error', {
        error: error.message,
        requestId: req?.id
      });
      throw new DatabaseError('Failed to sign in', error);
    }
  }

  /**
   * Sign out user
   */
  async signOut(accessToken = null, req = null) {
    try {
      const { error } = await this.client.auth.signOut();

      if (error) {
        logger.warn('Sign out failed', {
          error: error.message,
          requestId: req?.id
        });
        return { success: false, error: error.message };
      }

      logger.info('User signed out successfully', {
        requestId: req?.id
      });

      return { success: true };
    } catch (error) {
      logger.error('Sign out error', {
        error: error.message,
        requestId: req?.id
      });
      throw new DatabaseError('Failed to sign out', error);
    }
  }

  /**
   * Get user by token
   */
  async getUser(accessToken, req = null) {
    try {
      const { data: { user }, error } = await this.client.auth.getUser(accessToken);

      if (error || !user) {
        return null;
      }

      // Get user profile
      const { data: profile } = await this.adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name,
        role: profile?.role || 'user'
      };
    } catch (error) {
      logger.error('Get user error', {
        error: error.message,
        requestId: req?.id
      });
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(userId, updates, req = null) {
    try {
      const { data, error } = await this.adminClient
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new DatabaseError('Failed to update user', error);
      }

      logger.info('User updated successfully', {
        userId,
        updates: Object.keys(updates),
        requestId: req?.id
      });

      return data;
    } catch (error) {
      logger.error('Update user error', {
        error: error.message,
        userId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Generic query with tenant filtering
   */
  async query(table, options = {}, req = null) {
    try {
      let query = this.adminClient.from(table);

      // Apply tenant filtering if tenantId is provided
      if (options.tenantId) {
        query = query.eq('tenant_id', options.tenantId);
      }

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Apply sorting
      if (options.sortBy) {
        const ascending = options.sortOrder !== 'desc';
        query = query.order(options.sortBy, { ascending });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      // Apply select
      if (options.select) {
        query = query.select(options.select);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new DatabaseError(`Failed to query ${table}`, error);
      }

      return {
        success: true,
        data: data || [],
        count
      };
    } catch (error) {
      logger.error('Query error', {
        error: error.message,
        table,
        options,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Insert data with tenant context
   */
  async insert(table, data, tenantId = null, req = null) {
    try {
      // Add tenant_id if provided and not already in data
      if (tenantId && !data.tenant_id) {
        data.tenant_id = tenantId;
      }

      const { data: result, error } = await this.adminClient
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to insert into ${table}`, error);
      }

      logger.debug('Data inserted successfully', {
        table,
        id: result.id,
        tenantId,
        requestId: req?.id
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      logger.error('Insert error', {
        error: error.message,
        table,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Update data with tenant validation
   */
  async update(table, id, updates, tenantId = null, req = null) {
    try {
      let query = this.adminClient
        .from(table)
        .update(updates)
        .eq('id', id);

      // Add tenant filtering for security
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.select().single();

      if (error) {
        throw new DatabaseError(`Failed to update ${table}`, error);
      }

      logger.debug('Data updated successfully', {
        table,
        id,
        tenantId,
        requestId: req?.id
      });

      return {
        success: true,
        data
      };
    } catch (error) {
      logger.error('Update error', {
        error: error.message,
        table,
        id,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Delete data with tenant validation
   */
  async delete(table, id, tenantId = null, req = null) {
    try {
      let query = this.adminClient
        .from(table)
        .delete()
        .eq('id', id);

      // Add tenant filtering for security
      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { error } = await query;

      if (error) {
        throw new DatabaseError(`Failed to delete from ${table}`, error);
      }

      logger.debug('Data deleted successfully', {
        table,
        id,
        tenantId,
        requestId: req?.id
      });

      return { success: true };
    } catch (error) {
      logger.error('Delete error', {
        error: error.message,
        table,
        id,
        tenantId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Check database connectivity
   */
  async healthCheck() {
    try {
      const { data, error } = await this.adminClient
        .from('tenants')
        .select('count')
        .limit(1);

      if (error) {
        return { healthy: false, error: error.message };
      }

      return { healthy: true };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

// Create singleton instance
export const supabaseService = new SupabaseService();

export default supabaseService;
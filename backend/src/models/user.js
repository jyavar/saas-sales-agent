/**
 * User model and validation schemas
 */

import { z } from 'zod';

// User role constants
export const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user'
};

// Validation schemas
export const userSchemas = {
  register: z.object({
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name required').max(100, 'Name too long'),
    tenantName: z.string().min(1, 'Company name required').max(100, 'Company name too long')
  }),

  login: z.object({
    email: z.string().email('Valid email required'),
    password: z.string().min(1, 'Password required')
  }),

  updateProfile: z.object({
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    avatar_url: z.string().url().optional()
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation required')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }),

  resetPassword: z.object({
    email: z.string().email('Valid email required')
  }),

  confirmReset: z.object({
    token: z.string().min(1, 'Reset token required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation required')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
};

// User helper functions
export const userHelpers = {
  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = requirements.minLength && score >= 3;

    return {
      isValid,
      score,
      requirements,
      strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong'
    };
  },

  /**
   * Check if user has role
   */
  hasRole(user, role) {
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  },

  /**
   * Check if user is admin
   */
  isAdmin(user) {
    return user.role === USER_ROLES.ADMIN;
  },

  /**
   * Check if user is owner
   */
  isOwner(user) {
    return user.role === USER_ROLES.OWNER;
  },

  /**
   * Get user display name
   */
  getDisplayName(user) {
    return user.name || user.email.split('@')[0];
  },

  /**
   * Get user initials
   */
  getInitials(user) {
    const name = this.getDisplayName(user);
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  /**
   * Sanitize user data for public display
   */
  sanitizeForPublic(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: user.created_at
    };
  },

  /**
   * Generate username from email
   */
  generateUsername(email) {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  }
};

export default {
  USER_ROLES,
  userSchemas,
  userHelpers
};
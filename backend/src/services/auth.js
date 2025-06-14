/**
 * Authentication service
 */

import jwt from 'jsonwebtoken';
import { logger } from '../utils/common/logger.js';
import { UnauthorizedError, ValidationError } from '../utils/common/errorHandler.js';
import {
  createUserWithAuth,
  signInUser,
  signOutUser,
  getUserByToken,
  updateUserProfile
} from '../core/db/userDataAccess';

export class AuthService {
  /**
   * Create user
   */
  async createUser(userData, req = null) {
    try {
      return await createUserWithAuth(userData.email, userData.password, userData.name);
    } catch (error) {
      logger.error('Auth service: Create user failed', {
        error: error.message,
        email: userData.email,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Sign in user
   */
  async signIn(email, password, req = null) {
    try {
      return await signInUser(email, password);
    } catch (error) {
      logger.error('Auth service: Sign in failed', {
        error: error.message,
        email,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Sign out user
   */
  async signOut(accessToken, req = null) {
    try {
      return await signOutUser();
    } catch (error) {
      logger.error('Auth service: Sign out failed', {
        error: error.message,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Get user by token
   */
  async getUser(accessToken, req = null) {
    try {
      return await getUserByToken(accessToken);
    } catch (error) {
      logger.error('Auth service: Get user failed', {
        error: error.message,
        requestId: req?.id
      });
      return null;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updates, req = null) {
    try {
      return await updateUserProfile(userId, updates);
    } catch (error) {
      logger.error('Auth service: Update user failed', {
        error: error.message,
        userId,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Generate JWT token with tenant context
   */
  generateJWT(user, tenantId = null) {
    try {
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: tenantId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      logger.debug('JWT token generated', {
        userId: user.id,
        tenantId,
        expiresIn: '7 days'
      });

      return token;
    } catch (error) {
      logger.error('JWT generation failed', {
        error: error.message,
        userId: user.id
      });
      throw new ValidationError('Failed to generate authentication token');
    }
  }

  /**
   * Verify JWT token
   */
  verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        success: true,
        payload: decoded
      };
    } catch (error) {
      logger.warn('JWT verification failed', {
        error: error.message
      });
      
      if (error.name === 'TokenExpiredError') {
        return {
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        };
      }
      
      return {
        success: false,
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      };
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(refreshToken, req = null) {
    try {
      // In a real implementation, you'd validate the refresh token
      // and generate a new access token
      
      // For now, just verify the token and generate a new one
      const verification = this.verifyJWT(refreshToken);
      
      if (!verification.success) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const user = await this.getUser(refreshToken, req);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const newToken = this.generateJWT(user, verification.payload.tenantId);

      logger.info('Token refreshed successfully', {
        userId: user.id,
        requestId: req?.id
      });

      return {
        success: true,
        accessToken: newToken,
        user
      };
    } catch (error) {
      logger.error('Token refresh failed', {
        error: error.message,
        requestId: req?.id
      });
      throw error;
    }
  }

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const requirements = {
      minLength: password.length >= minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    };

    const score = Object.values(requirements).filter(Boolean).length;
    const isValid = requirements.minLength && score >= 3;

    return {
      isValid,
      score,
      requirements,
      strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong'
    };
  }

  /**
   * Generate secure API key
   */
  generateApiKey(prefix = 'sk_test') {
    const crypto = require('crypto');
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}_${randomBytes}`;
  }

  /**
   * Hash API key for storage
   */
  hashApiKey(apiKey) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}

export const authService = new AuthService();
export default authService;
import { Request } from 'express';

declare global {
  namespace Express {
    interface Tenant {
      id: string;
      slug?: string;
      plan?: string;
      isActive?: boolean;
      [key: string]: any;
    }
    interface User {
      id: string;
      email?: string;
      name?: string;
      role?: string;
      [key: string]: any;
    }
    interface Agent {
      id: string;
      type?: string;
      [key: string]: any;
    }
    interface Session {
      access_token?: string;
      [key: string]: any;
    }
    interface Request {
      tenant?: Tenant;
      user?: User;
      agent?: Agent;
      id?: string;
      session?: Session;
      correlationId?: string;
    }
  }
} 
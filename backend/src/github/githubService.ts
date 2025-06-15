import { z } from 'zod';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import { Octokit } from '@octokit/rest';

// Validación de configuración
const githubConfigSchema = z.object({
  GITHUB_WEBHOOK_SECRET: z.string().min(10, 'GITHUB_WEBHOOK_SECRET is required'),
  GITHUB_TOKEN: z.string().min(10, 'GITHUB_TOKEN is required'),
});

const githubConfig = githubConfigSchema.parse({
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
});

export interface GithubPushEvent {
  ref: string;
  commits: Array<{
    added: string[];
    modified: string[];
    removed: string[];
  }>;
  repository: {
    full_name: string;
  };
}

export interface GithubRepositoryEvent {
  action: string;
  repository: {
    full_name: string;
  };
}

export class GithubService {
  private webhookSecret: string;
  private token: string;
  private octokit: Octokit;

  constructor(webhookSecret: string, token: string) {
    this.webhookSecret = webhookSecret;
    this.token = token;
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Verifica la firma HMAC SHA256 de un webhook de GitHub
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string | undefined): boolean {
    if (!signature) {
      console.warn('[GitHub] Missing webhook signature');
      return false;
    }
    const expected = 'sha256=' + crypto.createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
    const valid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) {
      console.warn('[GitHub] Invalid webhook signature', { signature, expected });
    }
    return valid;
  }

  /**
   * Procesa un webhook de GitHub (push, repository, etc.)
   * Valida la firma antes de procesar
   */
  async processWebhook(eventType: string, event: any, payloadRaw: string | Buffer, signature: string | undefined) {
    if (!this.verifyWebhookSignature(payloadRaw, signature)) {
      throw new Error('Invalid GitHub webhook signature');
    }
    try {
      switch (eventType) {
        case 'push':
          return await this.handlePushEvent(event);
        case 'repository':
          return await this.handleRepositoryEvent(event);
        default:
          console.info('[GitHub] Unhandled webhook event', { type: eventType });
          return { success: true, message: 'Event ignored' };
      }
    } catch (error: any) {
      console.error('[GitHub] Webhook processing failed:', error.message);
      throw error;
    }
  }

  /**
   * Maneja un evento push de GitHub
   */
  async handlePushEvent(pushData: GithubPushEvent) {
    try {
      const isMainBranch = pushData.ref === 'refs/heads/main';
      const hasSignificantChanges = pushData.commits.some(commit =>
        commit.added.includes('package.json') ||
        commit.modified.includes('package.json')
      );

      if (isMainBranch && hasSignificantChanges) {
        console.info('[GitHub] Push requires re-analysis', {
          repository: pushData.repository.full_name,
          commits: pushData.commits.length
        });
        return {
          success: true,
          message: 'Push processed',
          shouldReanalyze: true
        };
      }
      return {
        success: true,
        message: 'Push ignored',
        shouldReanalyze: false
      };
    } catch (error: any) {
      console.error('[GitHub] Push processing failed:', error.message);
      throw error;
    }
  }

  /**
   * Maneja un evento repository de GitHub
   */
  async handleRepositoryEvent(repoData: GithubRepositoryEvent) {
    try {
      console.info('[GitHub] Repository event processed', {
        action: repoData.action,
        repository: repoData.repository.full_name
      });
      return { success: true, message: 'Repository event processed' };
    } catch (error: any) {
      console.error('[GitHub] Repository event processing failed:', error.message);
      throw error;
    }
  }

  /**
   * Analiza un repositorio (lee README.md y package.json)
   */
  async analyzeRepository(repoFullName: string) {
    try {
      const [owner, repo] = repoFullName.split('/');
      // Leer README.md
      const readmeResp = await this.octokit.repos.getReadme({ owner, repo });
      let readmeContent = '';
      if (readmeResp.data && readmeResp.data.type === 'file' && typeof readmeResp.data.content === 'string' && typeof readmeResp.data.encoding === 'string') {
        readmeContent = Buffer.from(readmeResp.data.content, readmeResp.data.encoding as BufferEncoding).toString('utf-8');
      }
      // Leer package.json
      let packageJsonContent = null;
      try {
        const pkgResp = await this.octokit.repos.getContent({ owner, repo, path: 'package.json' });
        if (Array.isArray(pkgResp.data)) throw new Error('package.json is a directory');
        if (pkgResp.data && pkgResp.data.type === 'file' && typeof pkgResp.data.content === 'string' && typeof pkgResp.data.encoding === 'string') {
          packageJsonContent = Buffer.from(pkgResp.data.content, pkgResp.data.encoding as BufferEncoding).toString('utf-8');
        }
      } catch (err) {
        console.warn('[GitHub] package.json not found', { repoFullName });
      }
      // TODO: Extraer features, dependencias, descripción, etc.
      console.info('[GitHub] Repository analyzed', { repoFullName });
      return {
        success: true,
        readme: readmeContent,
        packageJson: packageJsonContent,
      };
    } catch (error: any) {
      console.error('[GitHub] Repository analysis failed:', error.message);
      throw error;
    }
  }
}

export const githubService = new GithubService(
  githubConfig.GITHUB_WEBHOOK_SECRET,
  githubConfig.GITHUB_TOKEN
); 
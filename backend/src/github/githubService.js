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
exports.githubService = exports.GithubService = void 0;
const zod_1 = require("zod");
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
const rest_1 = require("@octokit/rest");
// Validación de configuración
const githubConfigSchema = zod_1.z.object({
    GITHUB_WEBHOOK_SECRET: zod_1.z.string().min(10, 'GITHUB_WEBHOOK_SECRET is required'),
    GITHUB_TOKEN: zod_1.z.string().min(10, 'GITHUB_TOKEN is required'),
});
const githubConfig = githubConfigSchema.parse({
    GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
});
class GithubService {
    constructor(webhookSecret, token) {
        this.webhookSecret = webhookSecret;
        this.token = token;
        this.octokit = new rest_1.Octokit({ auth: token });
    }
    /**
     * Verifica la firma HMAC SHA256 de un webhook de GitHub
     */
    verifyWebhookSignature(payload, signature) {
        if (!signature) {
            console.warn('[GitHub] Missing webhook signature');
            return false;
        }
        const expected = 'sha256=' + crypto_1.default.createHmac('sha256', this.webhookSecret)
            .update(payload)
            .digest('hex');
        const valid = crypto_1.default.timingSafeEqual(buffer_1.Buffer.from(signature), buffer_1.Buffer.from(expected));
        if (!valid) {
            console.warn('[GitHub] Invalid webhook signature', { signature, expected });
        }
        return valid;
    }
    /**
     * Procesa un webhook de GitHub (push, repository, etc.)
     * Valida la firma antes de procesar
     */
    processWebhook(eventType, event, payloadRaw, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.verifyWebhookSignature(payloadRaw, signature)) {
                throw new Error('Invalid GitHub webhook signature');
            }
            try {
                switch (eventType) {
                    case 'push':
                        return yield this.handlePushEvent(event);
                    case 'repository':
                        return yield this.handleRepositoryEvent(event);
                    default:
                        console.info('[GitHub] Unhandled webhook event', { type: eventType });
                        return { success: true, message: 'Event ignored' };
                }
            }
            catch (error) {
                console.error('[GitHub] Webhook processing failed:', error.message);
                throw error;
            }
        });
    }
    /**
     * Maneja un evento push de GitHub
     */
    handlePushEvent(pushData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMainBranch = pushData.ref === 'refs/heads/main';
                const hasSignificantChanges = pushData.commits.some(commit => commit.added.includes('package.json') ||
                    commit.modified.includes('package.json'));
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
            }
            catch (error) {
                console.error('[GitHub] Push processing failed:', error.message);
                throw error;
            }
        });
    }
    /**
     * Maneja un evento repository de GitHub
     */
    handleRepositoryEvent(repoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info('[GitHub] Repository event processed', {
                    action: repoData.action,
                    repository: repoData.repository.full_name
                });
                return { success: true, message: 'Repository event processed' };
            }
            catch (error) {
                console.error('[GitHub] Repository event processing failed:', error.message);
                throw error;
            }
        });
    }
    /**
     * Analiza un repositorio (lee README.md y package.json)
     */
    analyzeRepository(repoFullName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [owner, repo] = repoFullName.split('/');
                // Leer README.md
                const readmeResp = yield this.octokit.repos.getReadme({ owner, repo });
                const readmeContent = buffer_1.Buffer.from(readmeResp.data.content, readmeResp.data.encoding).toString('utf-8');
                // Leer package.json
                let packageJsonContent = null;
                try {
                    const pkgResp = yield this.octokit.repos.getContent({ owner, repo, path: 'package.json' });
                    if (Array.isArray(pkgResp.data))
                        throw new Error('package.json is a directory');
                    packageJsonContent = buffer_1.Buffer.from(pkgResp.data.content, pkgResp.data.encoding).toString('utf-8');
                }
                catch (err) {
                    console.warn('[GitHub] package.json not found', { repoFullName });
                }
                // TODO: Extraer features, dependencias, descripción, etc.
                console.info('[GitHub] Repository analyzed', { repoFullName });
                return {
                    success: true,
                    readme: readmeContent,
                    packageJson: packageJsonContent,
                };
            }
            catch (error) {
                console.error('[GitHub] Repository analysis failed:', error.message);
                throw error;
            }
        });
    }
}
exports.GithubService = GithubService;
exports.githubService = new GithubService(githubConfig.GITHUB_WEBHOOK_SECRET, githubConfig.GITHUB_TOKEN);

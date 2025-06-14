import { createCampaign as persistCampaign } from '../core/db/campaignDataAccess.js';
import { logger } from '../utils/common/logger.js';
// Importa el agente como módulo Node.js (ajusta el path si es necesario)
import { runAgentForCampaign } from '../../../agent/core/agentRunner';

export const campaignController = {
  async createCampaign(req, res, next) {
    try {
      const { name, repoUrl, tenantId } = req.body;
      if (!name || !repoUrl || !tenantId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      // Persistir campaña (puedes enriquecer con más campos si lo deseas)
      const campaign = await persistCampaign(tenantId, {
        name,
        subject: name, // Placeholder, puedes ajustar
        content: '',   // Placeholder, puedes ajustar
        status: 'draft',
      });
      logger.info('Campaign created', { campaignId: campaign.id, tenantId });

      // Ejecutar agente
      let agentResult = null;
      try {
        agentResult = await runAgentForCampaign({
          campaignId: campaign.id,
          repoUrl,
          tenantId,
          campaignName: name,
        });
        logger.info('Agent executed for campaign', { campaignId: campaign.id, agentResult });
      } catch (agentError) {
        logger.error('Agent execution failed', { campaignId: campaign.id, error: agentError.message });
        agentResult = { error: agentError.message };
      }

      return res.status(201).json({ campaign, agentResult });
    } catch (error) {
      logger.error('Error creating campaign', { error: error.message });
      next(error);
    }
  },
}; 
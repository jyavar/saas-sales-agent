import { createCampaign as persistCampaign } from '../core/db/campaignDataAccess.js';
import { logger } from '../utils/common/logger.js';
// Importa el agente como módulo Node.js (ajusta el path si es necesario)
import { runAgentForCampaign } from '../../../agent/core/agentRunner';
import { validateData } from '../utils/validation.js';
import { campaignSchemas } from '../models/campaign.js';

export const campaignController = {
  async createCampaign(req, res, next) {
    try {
      // Validación estricta con Zod
      const validation = validateData(req.body, campaignSchemas.create);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid campaign data', errors: validation.errors });
      }
      const { name, repoUrl, tenantId } = validation.data;
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

  async updateCampaign(req, res, next) {
    try {
      const validation = validateData(req.body, campaignSchemas.update);
      if (!validation.success) {
        return res.status(400).json({ error: 'Invalid input', issues: validation.errors });
      }
      // Aquí iría la lógica de actualización real, por ejemplo:
      // const updated = await persistUpdateCampaign(req.params.id, validation.data);
      // return res.json({ success: true, campaign: updated });
      return res.json({ success: true, message: 'Validación exitosa (mock)' });
    } catch (error) {
      logger.error('Error updating campaign', { error: error.message });
      next(error);
    }
  },
}; 
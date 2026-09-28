import { getSocialChannelsStatus, syncAllSocialMediaFeeds } from '../services/socialCollector.js';
import { DiscoveryModel } from '../models/discoveryModel.js';

export const getSocialChannels = async (req, res) => {
  try {
    const channels = getSocialChannelsStatus();
    return res.json({ channels });
  } catch (err) {
    console.error('[SocialController] getSocialChannels error:', err);
    return res.status(500).json({ error: 'Failed to retrieve connected social channels.' });
  }
};

export const syncSocial = async (req, res) => {
  try {
    const result = await syncAllSocialMediaFeeds();
    const updatedDiscoveries = await DiscoveryModel.list();
    return res.json({
      message: 'Multi-platform social media feeds synchronized successfully.',
      stats: result,
      discoveries: updatedDiscoveries
    });
  } catch (err) {
    console.error('[SocialController] syncSocial error:', err);
    return res.status(500).json({ error: 'Failed to synchronize social media feeds.' });
  }
};

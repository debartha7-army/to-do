import { DiscoveryModel } from '../models/discoveryModel.js';
import { syncOfficialRssFeeds } from '../services/rssCollector.js';

export const getDiscoveries = async (req, res) => {
  try {
    const { category, search, source } = req.query;
    const discoveries = await DiscoveryModel.list({ category, search, source });
    return res.json({ discoveries });
  } catch (err) {
    console.error('[DiscoveriesController] getDiscoveries error:', err);
    return res.status(500).json({ error: 'Failed to retrieve space-science discoveries.' });
  }
};

export const createDiscovery = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      source_name,
      source_url,
      category,
      image_url,
      tags,
      published_at
    } = req.body;

    if (!title || !source_name) {
      return res.status(400).json({ error: 'Discovery title and source name are required.' });
    }

    const userId = req.user ? req.user.id : null;

    const newDiscovery = await DiscoveryModel.create(
      {
        title,
        summary,
        content,
        source_name,
        source_url,
        category,
        image_url,
        tags,
        published_at: published_at || new Date().toISOString()
      },
      userId
    );

    return res.status(201).json({
      message: 'Discovery logged successfully.',
      discovery: newDiscovery
    });
  } catch (err) {
    console.error('[DiscoveriesController] createDiscovery error:', err);
    return res.status(500).json({ error: 'Failed to save discovery entry.' });
  }
};

export const syncFeeds = async (req, res) => {
  try {
    const syncResult = await syncOfficialRssFeeds(req.user);
    const updatedDiscoveries = await DiscoveryModel.list();
    return res.json({
      message: 'Official space-science RSS feeds synchronized successfully.',
      stats: syncResult,
      discoveries: updatedDiscoveries
    });
  } catch (err) {
    console.error('[DiscoveriesController] syncFeeds error:', err);
    return res.status(500).json({ error: 'Failed to sync official RSS feeds.' });
  }
};

import { EventModel } from '../models/eventModel.js';
import { DiscoveryModel } from '../models/discoveryModel.js';
import { ReportModel } from '../models/reportModel.js';

export const deleteUserRecord = async (req, res) => {
  try {
    const { kind, id } = req.params;
    const userId = req.user.id;

    if (!id || !kind) {
      return res.status(400).json({ error: 'Missing entity type kind or ID parameter.' });
    }

    let deleted = false;

    switch (kind.toLowerCase()) {
      case 'events':
        deleted = await EventModel.deleteByIdAndUser(id, userId);
        break;
      case 'discoveries':
        deleted = await DiscoveryModel.deleteByIdAndUser(id, userId);
        break;
      case 'reports':
        deleted = await ReportModel.deleteByIdAndUser(id, userId);
        break;
      default:
        return res.status(400).json({
          error: `Invalid resource kind '${kind}'. Allowed kinds: events, discoveries, reports.`
        });
    }

    if (!deleted) {
      return res.status(404).json({
        error: `Record not found, or you do not have permission to delete this ${kind} record.`
      });
    }

    return res.json({
      message: `Record ${id} in ${kind} was successfully deleted.`
    });
  } catch (err) {
    console.error('[DeleteController] deleteUserRecord error:', err);
    return res.status(500).json({ error: 'Server error processing record deletion.' });
  }
};

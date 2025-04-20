import express from 'express';
import Version from '../models/version.js';

const router = express.Router();

router.post('/save', async (req, res) => {
  try {
    const { code } = req.body;

    // Find latest version
    const latest = await Version.findOne().sort({ version: -1 });
    const newVersion = latest ? latest.version + 1 : 1;
    // Save new version
    const saved = await Version.create({ code, version: newVersion });
    res.json({ success: true, version: saved.version });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/previous/:version', async (req, res) => {
    try {
      const currentVersion = parseInt(req.params.version, 10);
  
      const previous = await Version.findOne({ version: { $lt: currentVersion } })
                                    .sort({ version: -1 });
  
      if (!previous) {
        return res.status(404).json({ success: false, message: 'No previous version found' });
      }
  
      res.json({ success: true, code: previous.code, version: previous.version });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error fetching previous version' });
    }
  });
  

export default router;

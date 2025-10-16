const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');
const { MessageMedia } = require('whatsapp-web.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/set', async (req, res) => {
	try {
		const { sessionId, status } = req.body;

		if (!sessionId || !status) {
			return res
				.status(400)
				.json({ error: 'sessionId and status are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.setStatus(status);

		res.json({ success: true, message: 'Status updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/text', async (req, res) => {
	try {
		const { sessionId, text, options } = req.body;

		if (!sessionId || !text) {
			return res.status(400).json({ error: 'sessionId and text are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.sendMessage('status@broadcast', text, options);

		res.json({ success: true, message: 'Status text posted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/media', upload.single('file'), async (req, res) => {
	try {
		const { sessionId, caption } = req.body;

		if (!sessionId) {
			return res.status(400).json({ error: 'sessionId is required' });
		}

		const client = clientManager.getClient(sessionId);
		let media;

		if (req.file) {
			media = new MessageMedia(
				req.file.mimetype,
				req.file.buffer.toString('base64'),
				req.file.originalname
			);
		} else if (req.body.mediaUrl) {
			media = await MessageMedia.fromUrl(req.body.mediaUrl);
		} else {
			return res.status(400).json({ error: 'File or mediaUrl is required' });
		}

		await client.sendMessage('status@broadcast', media, {
			caption: caption || '',
		});

		res.json({ success: true, message: 'Status media posted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

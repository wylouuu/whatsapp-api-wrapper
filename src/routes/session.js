const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');

router.post('/start', async (req, res) => {
	try {
		const { sessionId, options } = req.body;

		if (!sessionId) {
			return res.status(400).json({ error: 'sessionId is required' });
		}

		const result = await clientManager.createSession(sessionId, options);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/stop/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const result = await clientManager.destroySession(sessionId);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/logout/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const result = await clientManager.logoutSession(sessionId);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/qr/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const qrData = clientManager.getQRCode(sessionId);
		res.json(qrData);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.get('/qr/:sessionId/image', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const qrData = clientManager.getQRCode(sessionId);

		const base64Data = qrData.qrImage.replace(/^data:image\/png;base64,/, '');
		const img = Buffer.from(base64Data, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length,
		});
		res.end(img);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.get('/status/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const state = clientManager.getSessionState(sessionId);
		res.json(state);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.get('/list', (req, res) => {
	try {
		const sessions = clientManager.getAllSessions();
		res.json({ sessions });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/info/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const info = await client.info;
		res.json({ info });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/state/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const state = await client.getState();
		res.json({ state });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

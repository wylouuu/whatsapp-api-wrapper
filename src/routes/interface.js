const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');

router.post('/open-chat-window', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.openChatWindow(chatId);

		res.json({ success: true, message: 'Chat window opened successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/open-chat-window-at', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.openChatWindowAt(messageId);

		res.json({
			success: true,
			message: 'Chat window opened at message successfully',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/open-chat-drawer', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.openChatDrawer(chatId);

		res.json({ success: true, message: 'Chat drawer opened successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/open-message-drawer', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.openMessageDrawer(messageId);

		res.json({ success: true, message: 'Message drawer opened successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/open-chat-search', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.openChatSearch(chatId);

		res.json({ success: true, message: 'Chat search opened successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/close-right-drawer', async (req, res) => {
	try {
		const { sessionId } = req.body;

		if (!sessionId) {
			return res.status(400).json({ error: 'sessionId is required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.closeRightDrawer();

		res.json({ success: true, message: 'Right drawer closed successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/features/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const features = await client.interface.getFeatures();

		res.json({ success: true, features });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/enable-features', async (req, res) => {
	try {
		const { sessionId, features } = req.body;

		if (!sessionId || !features || !Array.isArray(features)) {
			return res
				.status(400)
				.json({ error: 'sessionId and features (array) are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.enableFeatures(features);

		res.json({ success: true, message: 'Features enabled successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/disable-features', async (req, res) => {
	try {
		const { sessionId, features } = req.body;

		if (!sessionId || !features || !Array.isArray(features)) {
			return res
				.status(400)
				.json({ error: 'sessionId and features (array) are required' });
		}

		const client = clientManager.getClient(sessionId);
		await client.interface.disableFeatures(features);

		res.json({ success: true, message: 'Features disabled successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/check-feature-status', async (req, res) => {
	try {
		const { sessionId, feature } = req.body;

		if (!sessionId || !feature) {
			return res
				.status(400)
				.json({ error: 'sessionId and feature are required' });
		}

		const client = clientManager.getClient(sessionId);
		const status = await client.interface.checkFeatureStatus(feature);

		res.json({ success: true, status });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

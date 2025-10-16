const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');

router.get('/list/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chats = await client.getChats();
		const chatList = chats.map((chat) => ({
			id: chat.id._serialized,
			name: chat.name,
			isGroup: chat.isGroup,
			isReadOnly: chat.isReadOnly,
			unreadCount: chat.unreadCount,
			timestamp: chat.timestamp,
			archived: chat.archived,
			pinned: chat.pinned,
			isMuted: chat.isMuted,
			muteExpiration: chat.muteExpiration,
		}));

		res.json({ success: true, chats: chatList });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/get/:sessionId/:chatId', async (req, res) => {
	try {
		const { sessionId, chatId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(chatId);

		res.json({
			success: true,
			chat: {
				id: chat.id._serialized,
				name: chat.name,
				isGroup: chat.isGroup,
				isReadOnly: chat.isReadOnly,
				unreadCount: chat.unreadCount,
				timestamp: chat.timestamp,
				archived: chat.archived,
				pinned: chat.pinned,
				isMuted: chat.isMuted,
				muteExpiration: chat.muteExpiration,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/messages/:sessionId/:chatId', async (req, res) => {
	try {
		const { sessionId, chatId } = req.params;
		const { limit, searchOptions } = req.query;

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);

		const options = searchOptions
			? JSON.parse(searchOptions)
			: { limit: parseInt(limit) || 50 };
		const messages = await chat.fetchMessages(options);

		const messageList = messages.map((msg) => ({
			id: msg.id._serialized,
			body: msg.body,
			type: msg.type,
			timestamp: msg.timestamp,
			from: msg.from,
			to: msg.to,
			author: msg.author,
			fromMe: msg.fromMe,
			hasMedia: msg.hasMedia,
			ack: msg.ack,
			isStarred: msg.isStarred,
			isForwarded: msg.isForwarded,
			hasQuotedMsg: msg.hasQuotedMsg,
		}));

		res.json({ success: true, messages: messageList });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/archive', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.archive();

		res.json({ success: true, message: 'Chat archived successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unarchive', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.unarchive();

		res.json({ success: true, message: 'Chat unarchived successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/pin', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.pin();

		res.json({ success: true, message: 'Chat pinned successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unpin', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.unpin();

		res.json({ success: true, message: 'Chat unpinned successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/mute', async (req, res) => {
	try {
		const { sessionId, chatId, unmuteDate } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.mute(unmuteDate);

		res.json({ success: true, message: 'Chat muted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unmute', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.unmute();

		res.json({ success: true, message: 'Chat unmuted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/mark-unread', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.markUnread();

		res.json({ success: true, message: 'Chat marked as unread' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/clear-messages', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.clearMessages();

		res.json({ success: true, message: 'Chat messages cleared successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/delete', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.delete();

		res.json({ success: true, message: 'Chat deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/pinned-messages/:sessionId/:chatId', async (req, res) => {
	try {
		const { sessionId, chatId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(chatId);
		const pinnedMessages = await chat.getPinnedMessages();

		res.json({ success: true, pinnedMessages });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/labels/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const labels = await client.getLabels();

		res.json({
			success: true,
			labels: labels.map((label) => ({
				id: label.id,
				name: label.name,
				hexColor: label.hexColor,
			})),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/chat-labels/:sessionId/:chatId', async (req, res) => {
	try {
		const { sessionId, chatId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(chatId);
		const labels = await chat.getLabels();

		res.json({
			success: true,
			labels: labels.map((label) => ({
				id: label.id,
				name: label.name,
				hexColor: label.hexColor,
			})),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/change-labels', async (req, res) => {
	try {
		const { sessionId, chatId, labelIds } = req.body;

		if (!sessionId || !chatId || !labelIds) {
			return res
				.status(400)
				.json({ error: 'sessionId, chatId, and labelIds are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.changeLabels(labelIds);

		res.json({ success: true, message: 'Chat labels changed successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

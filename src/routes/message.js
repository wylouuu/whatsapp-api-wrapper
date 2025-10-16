const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');
const { MessageMedia } = require('whatsapp-web.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/send', async (req, res) => {
	try {
		const { sessionId, chatId, message, options } = req.body;

		if (!sessionId || !chatId || !message) {
			return res
				.status(400)
				.json({ error: 'sessionId, chatId, and message are required' });
		}

		const client = clientManager.getClient(sessionId);
		const result = await client.sendMessage(chatId, message, options);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/send-media', upload.single('file'), async (req, res) => {
	try {
		const { sessionId, chatId, caption, options } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
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
		} else if (req.body.mediaPath) {
			media = MessageMedia.fromFilePath(req.body.mediaPath);
		} else {
			return res
				.status(400)
				.json({ error: 'File, mediaUrl, or mediaPath is required' });
		}

		const result = await client.sendMessage(chatId, media, {
			caption: caption || '',
			...JSON.parse(options || '{}'),
		});

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/send-location', async (req, res) => {
	try {
		const { sessionId, chatId, latitude, longitude, description } = req.body;

		if (!sessionId || !chatId || !latitude || !longitude) {
			return res
				.status(400)
				.json({
					error: 'sessionId, chatId, latitude, and longitude are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const location = new (require('whatsapp-web.js').Location)(
			latitude,
			longitude,
			description
		);
		const result = await client.sendMessage(chatId, location);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/send-contact', async (req, res) => {
	try {
		const { sessionId, chatId, contactId } = req.body;

		if (!sessionId || !chatId || !contactId) {
			return res
				.status(400)
				.json({ error: 'sessionId, chatId, and contactId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const contact = await client.getContactById(contactId);
		const result = await client.sendMessage(chatId, contact);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/send-poll', async (req, res) => {
	try {
		const { sessionId, chatId, pollName, pollOptions, options } = req.body;

		if (!sessionId || !chatId || !pollName || !pollOptions) {
			return res
				.status(400)
				.json({
					error: 'sessionId, chatId, pollName, and pollOptions are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const { Poll } = require('whatsapp-web.js');
		const poll = new Poll(pollName, pollOptions, options);
		const result = await client.sendMessage(chatId, poll);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/broadcast', async (req, res) => {
	try {
		const { sessionId, chatIds, message } = req.body;

		if (!sessionId || !chatIds || !Array.isArray(chatIds) || !message) {
			return res
				.status(400)
				.json({
					error: 'sessionId, chatIds (array), and message are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const results = [];

		for (const chatId of chatIds) {
			try {
				const result = await client.sendMessage(chatId, message);
				results.push({
					chatId,
					success: true,
					messageId: result.id._serialized,
				});
			} catch (error) {
				results.push({
					chatId,
					success: false,
					error: error.message,
				});
			}
		}

		res.json({ success: true, results });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/broadcast-media', upload.single('file'), async (req, res) => {
	try {
		const { sessionId, chatIds, caption } = req.body;

		if (!sessionId || !chatIds) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatIds are required' });
		}

		const parsedChatIds = JSON.parse(chatIds);
		if (!Array.isArray(parsedChatIds)) {
			return res.status(400).json({ error: 'chatIds must be an array' });
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

		const results = [];

		for (const chatId of parsedChatIds) {
			try {
				const result = await client.sendMessage(chatId, media, {
					caption: caption || '',
				});
				results.push({
					chatId,
					success: true,
					messageId: result.id._serialized,
				});
			} catch (error) {
				results.push({
					chatId,
					success: false,
					error: error.message,
				});
			}
		}

		res.json({ success: true, results });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/reply', async (req, res) => {
	try {
		const { sessionId, messageId, message, options } = req.body;

		if (!sessionId || !messageId || !message) {
			return res
				.status(400)
				.json({ error: 'sessionId, messageId, and message are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		const result = await msg.reply(message, null, options);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/forward', async (req, res) => {
	try {
		const { sessionId, messageId, chatId } = req.body;

		if (!sessionId || !messageId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId, messageId, and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		const result = await msg.forward(chatId);

		res.json({
			success: true,
			messageId: result.id._serialized,
			timestamp: result.timestamp,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/react', async (req, res) => {
	try {
		const { sessionId, messageId, reaction } = req.body;

		if (!sessionId || !messageId || !reaction) {
			return res
				.status(400)
				.json({ error: 'sessionId, messageId, and reaction are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.react(reaction);

		res.json({ success: true, message: 'Reaction sent successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/edit', async (req, res) => {
	try {
		const { sessionId, messageId, newContent, options } = req.body;

		if (!sessionId || !messageId || !newContent) {
			return res
				.status(400)
				.json({ error: 'sessionId, messageId, and newContent are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.edit(newContent, options);

		res.json({ success: true, message: 'Message edited successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/delete', async (req, res) => {
	try {
		const { sessionId, messageId, everyone } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.delete(everyone || false);

		res.json({ success: true, message: 'Message deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/star', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.star();

		res.json({ success: true, message: 'Message starred successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unstar', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.unstar();

		res.json({ success: true, message: 'Message unstarred successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/pin', async (req, res) => {
	try {
		const { sessionId, messageId, duration } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.pin(duration);

		res.json({ success: true, message: 'Message pinned successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unpin', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		await msg.unpin();

		res.json({ success: true, message: 'Message unpinned successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/info/:sessionId/:messageId', async (req, res) => {
	try {
		const { sessionId, messageId } = req.params;

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		const info = await msg.getInfo();

		res.json({ success: true, info });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/reactions/:sessionId/:messageId', async (req, res) => {
	try {
		const { sessionId, messageId } = req.params;

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);
		const reactions = await msg.getReactions();

		res.json({ success: true, reactions });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/download-media', async (req, res) => {
	try {
		const { sessionId, messageId } = req.body;

		if (!sessionId || !messageId) {
			return res
				.status(400)
				.json({ error: 'sessionId and messageId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const msg = await client.getMessageById(messageId);

		if (!msg.hasMedia) {
			return res.status(400).json({ error: 'Message does not have media' });
		}

		const media = await msg.downloadMedia();

		res.json({
			success: true,
			media: {
				mimetype: media.mimetype,
				data: media.data,
				filename: media.filename,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/mark-seen', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.sendSeen();

		res.json({ success: true, message: 'Chat marked as seen' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/typing', async (req, res) => {
	try {
		const { sessionId, chatId, duration } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.sendStateTyping();

		if (duration) {
			setTimeout(async () => {
				await chat.clearState();
			}, duration);
		}

		res.json({ success: true, message: 'Typing state sent' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/recording', async (req, res) => {
	try {
		const { sessionId, chatId, duration } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.sendStateRecording();

		if (duration) {
			setTimeout(async () => {
				await chat.clearState();
			}, duration);
		}

		res.json({ success: true, message: 'Recording state sent' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/clear-state', async (req, res) => {
	try {
		const { sessionId, chatId } = req.body;

		if (!sessionId || !chatId) {
			return res
				.status(400)
				.json({ error: 'sessionId and chatId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(chatId);
		await chat.clearState();

		res.json({ success: true, message: 'Chat state cleared' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

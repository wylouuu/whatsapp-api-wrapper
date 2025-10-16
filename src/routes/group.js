const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');
const { MessageMedia } = require('whatsapp-web.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', async (req, res) => {
	try {
		const { sessionId, name, participants } = req.body;

		if (!sessionId || !name || !participants || !Array.isArray(participants)) {
			return res
				.status(400)
				.json({
					error: 'sessionId, name, and participants (array) are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const group = await client.createGroup(name, participants);

		res.json({
			success: true,
			group: {
				gid: group.gid._serialized,
				title: group.title,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/info/:sessionId/:groupId', async (req, res) => {
	try {
		const { sessionId, groupId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		res.json({
			success: true,
			group: {
				id: chat.id._serialized,
				name: chat.name,
				description: chat.description,
				owner: chat.owner,
				createdAt: chat.createdAt,
				participants: chat.participants.map((p) => ({
					id: p.id._serialized,
					isAdmin: p.isAdmin,
					isSuperAdmin: p.isSuperAdmin,
				})),
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/add-participants', async (req, res) => {
	try {
		const { sessionId, groupId, participants, options } = req.body;

		if (
			!sessionId ||
			!groupId ||
			!participants ||
			!Array.isArray(participants)
		) {
			return res
				.status(400)
				.json({
					error: 'sessionId, groupId, and participants (array) are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		const result = await chat.addParticipants(participants, options);

		res.json({ success: true, result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/remove-participants', async (req, res) => {
	try {
		const { sessionId, groupId, participants } = req.body;

		if (
			!sessionId ||
			!groupId ||
			!participants ||
			!Array.isArray(participants)
		) {
			return res
				.status(400)
				.json({
					error: 'sessionId, groupId, and participants (array) are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.removeParticipants(participants);

		res.json({ success: true, message: 'Participants removed successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/promote-participants', async (req, res) => {
	try {
		const { sessionId, groupId, participants } = req.body;

		if (
			!sessionId ||
			!groupId ||
			!participants ||
			!Array.isArray(participants)
		) {
			return res
				.status(400)
				.json({
					error: 'sessionId, groupId, and participants (array) are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.promoteParticipants(participants);

		res.json({ success: true, message: 'Participants promoted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/demote-participants', async (req, res) => {
	try {
		const { sessionId, groupId, participants } = req.body;

		if (
			!sessionId ||
			!groupId ||
			!participants ||
			!Array.isArray(participants)
		) {
			return res
				.status(400)
				.json({
					error: 'sessionId, groupId, and participants (array) are required',
				});
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.demoteParticipants(participants);

		res.json({ success: true, message: 'Participants demoted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-subject', async (req, res) => {
	try {
		const { sessionId, groupId, subject } = req.body;

		if (!sessionId || !groupId || !subject) {
			return res
				.status(400)
				.json({ error: 'sessionId, groupId, and subject are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.setSubject(subject);

		res.json({ success: true, message: 'Group subject updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-description', async (req, res) => {
	try {
		const { sessionId, groupId, description } = req.body;

		if (!sessionId || !groupId || !description) {
			return res
				.status(400)
				.json({ error: 'sessionId, groupId, and description are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.setDescription(description);

		res.json({
			success: true,
			message: 'Group description updated successfully',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-picture', upload.single('file'), async (req, res) => {
	try {
		const { sessionId, groupId } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

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

		await chat.setPicture(media);

		res.json({ success: true, message: 'Group picture updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/delete-picture', async (req, res) => {
	try {
		const { sessionId, groupId } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.deletePicture();

		res.json({ success: true, message: 'Group picture deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/invite-code/:sessionId/:groupId', async (req, res) => {
	try {
		const { sessionId, groupId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		const inviteCode = await chat.getInviteCode();

		res.json({ success: true, inviteCode });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/revoke-invite', async (req, res) => {
	try {
		const { sessionId, groupId } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		const newInviteCode = await chat.revokeInvite();

		res.json({ success: true, newInviteCode });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/join-by-code', async (req, res) => {
	try {
		const { sessionId, inviteCode } = req.body;

		if (!sessionId || !inviteCode) {
			return res
				.status(400)
				.json({ error: 'sessionId and inviteCode are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chatId = await client.acceptInvite(inviteCode);

		res.json({ success: true, chatId });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/leave', async (req, res) => {
	try {
		const { sessionId, groupId } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.leave();

		res.json({ success: true, message: 'Left group successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-messages-admins-only', async (req, res) => {
	try {
		const { sessionId, groupId, adminsOnly } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.setMessagesAdminsOnly(adminsOnly !== false);

		res.json({ success: true, message: 'Group settings updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-info-admins-only', async (req, res) => {
	try {
		const { sessionId, groupId, adminsOnly } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.setInfoAdminsOnly(adminsOnly !== false);

		res.json({ success: true, message: 'Group settings updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/set-add-members-admins-only', async (req, res) => {
	try {
		const { sessionId, groupId, adminsOnly } = req.body;

		if (!sessionId || !groupId) {
			return res
				.status(400)
				.json({ error: 'sessionId and groupId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.setAddMembersAdminsOnly(adminsOnly !== false);

		res.json({ success: true, message: 'Group settings updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/membership-requests/:sessionId/:groupId', async (req, res) => {
	try {
		const { sessionId, groupId } = req.params;
		const client = clientManager.getClient(sessionId);

		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		const requests = await chat.getGroupMembershipRequests();

		res.json({ success: true, requests });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/approve-membership-requests', async (req, res) => {
	try {
		const { sessionId, groupId, options } = req.body;

		if (!sessionId || !groupId || !options) {
			return res
				.status(400)
				.json({ error: 'sessionId, groupId, and options are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.approveGroupMembershipRequests(options);

		res.json({
			success: true,
			message: 'Membership requests approved successfully',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/reject-membership-requests', async (req, res) => {
	try {
		const { sessionId, groupId, options } = req.body;

		if (!sessionId || !groupId || !options) {
			return res
				.status(400)
				.json({ error: 'sessionId, groupId, and options are required' });
		}

		const client = clientManager.getClient(sessionId);
		const chat = await client.getChatById(groupId);

		if (!chat.isGroup) {
			return res.status(400).json({ error: 'Specified chat is not a group' });
		}

		await chat.rejectGroupMembershipRequests(options);

		res.json({
			success: true,
			message: 'Membership requests rejected successfully',
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

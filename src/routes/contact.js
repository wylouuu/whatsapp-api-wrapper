const express = require('express');
const router = express.Router();
const clientManager = require('../clientManager');

router.get('/list/:sessionId', async (req, res) => {
	try {
		const { sessionId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contacts = await client.getContacts();
		const contactList = contacts.map((contact) => ({
			id: contact.id._serialized,
			name: contact.name,
			pushname: contact.pushname,
			shortName: contact.shortName,
			number: contact.number,
			isMe: contact.isMe,
			isUser: contact.isUser,
			isGroup: contact.isGroup,
			isWAContact: contact.isWAContact,
			isMyContact: contact.isMyContact,
			isBlocked: contact.isBlocked,
			isBusiness: contact.isBusiness,
			isEnterprise: contact.isEnterprise,
		}));

		res.json({ success: true, contacts: contactList });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/get/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);

		res.json({
			success: true,
			contact: {
				id: contact.id._serialized,
				name: contact.name,
				pushname: contact.pushname,
				shortName: contact.shortName,
				number: contact.number,
				isMe: contact.isMe,
				isUser: contact.isUser,
				isGroup: contact.isGroup,
				isWAContact: contact.isWAContact,
				isMyContact: contact.isMyContact,
				isBlocked: contact.isBlocked,
				isBusiness: contact.isBusiness,
				isEnterprise: contact.isEnterprise,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/profile-pic/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);
		const profilePicUrl = await contact.getProfilePicUrl();

		res.json({ success: true, profilePicUrl });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/about/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);
		const about = await contact.getAbout();

		res.json({ success: true, about });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/common-groups/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);
		const commonGroups = await contact.getCommonGroups();

		res.json({
			success: true,
			commonGroups: commonGroups.map((group) => ({
				id: group.id._serialized,
				name: group.name,
			})),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/block', async (req, res) => {
	try {
		const { sessionId, contactId } = req.body;

		if (!sessionId || !contactId) {
			return res
				.status(400)
				.json({ error: 'sessionId and contactId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const contact = await client.getContactById(contactId);
		await contact.block();

		res.json({ success: true, message: 'Contact blocked successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post('/unblock', async (req, res) => {
	try {
		const { sessionId, contactId } = req.body;

		if (!sessionId || !contactId) {
			return res
				.status(400)
				.json({ error: 'sessionId and contactId are required' });
		}

		const client = clientManager.getClient(sessionId);
		const contact = await client.getContactById(contactId);
		await contact.unblock();

		res.json({ success: true, message: 'Contact unblocked successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/formatted-number/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);
		const formattedNumber = await contact.getFormattedNumber();

		res.json({ success: true, formattedNumber });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/country-code/:sessionId/:contactId', async (req, res) => {
	try {
		const { sessionId, contactId } = req.params;
		const client = clientManager.getClient(sessionId);

		const contact = await client.getContactById(contactId);
		const countryCode = await contact.getCountryCode();

		res.json({ success: true, countryCode });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/number-exists/:sessionId/:number', async (req, res) => {
	try {
		const { sessionId, number } = req.params;
		const client = clientManager.getClient(sessionId);

		const numberId = await client.getNumberId(number);

		res.json({
			success: true,
			exists: numberId !== null,
			numberId: numberId ? numberId._serialized : null,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

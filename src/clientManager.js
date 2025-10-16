const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

class ClientManager {
	constructor() {
		this.clients = new Map();
		this.qrCodes = new Map();
		this.sessionStates = new Map();
	}

	async createSession(sessionId, options = {}) {
		if (this.clients.has(sessionId)) {
			throw new Error('Session already exists');
		}

		const clientOptions = {
			authStrategy: new LocalAuth({
				clientId: sessionId,
				dataPath: './.wwebjs_auth',
			}),
			puppeteer: {
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--no-first-run',
					'--no-zygote',
					'--disable-gpu',
				],
			},
			...options,
		};

		const client = new Client(clientOptions);

		client.on('qr', async (qr) => {
			console.log(`QR Code received for session: ${sessionId}`);
			try {
				const qrImage = await qrcode.toDataURL(qr);
				this.qrCodes.set(sessionId, { qr, qrImage });
				this.sessionStates.set(sessionId, 'qr');
			} catch (error) {
				console.error('Error generating QR code:', error);
			}
		});

		client.on('authenticated', () => {
			console.log(`Session authenticated: ${sessionId}`);
			this.sessionStates.set(sessionId, 'authenticated');
			this.qrCodes.delete(sessionId);
		});

		client.on('auth_failure', (msg) => {
			console.error(`Authentication failed for session ${sessionId}:`, msg);
			this.sessionStates.set(sessionId, 'auth_failure');
		});

		client.on('ready', () => {
			console.log(`Client ready for session: ${sessionId}`);
			this.sessionStates.set(sessionId, 'ready');
		});

		client.on('disconnected', (reason) => {
			console.log(`Client disconnected for session ${sessionId}:`, reason);
			this.sessionStates.set(sessionId, 'disconnected');
		});

		client.on('loading_screen', (percent) => {
			console.log(`Loading screen for session ${sessionId}: ${percent}%`);
		});

		this.clients.set(sessionId, client);
		this.sessionStates.set(sessionId, 'initializing');

		try {
			await client.initialize();
		} catch (error) {
			this.clients.delete(sessionId);
			this.sessionStates.delete(sessionId);
			throw error;
		}

		return { success: true, message: 'Session created successfully' };
	}

	async destroySession(sessionId) {
		const client = this.clients.get(sessionId);
		if (!client) {
			throw new Error('Session not found');
		}

		try {
			await client.destroy();
			this.clients.delete(sessionId);
			this.qrCodes.delete(sessionId);
			this.sessionStates.delete(sessionId);

			const sessionPath = path.join('./.wwebjs_auth', `session-${sessionId}`);
			if (fs.existsSync(sessionPath)) {
				fs.rmSync(sessionPath, { recursive: true, force: true });
			}

			return { success: true, message: 'Session destroyed successfully' };
		} catch (error) {
			throw new Error(`Failed to destroy session: ${error.message}`);
		}
	}

	async logoutSession(sessionId) {
		const client = this.clients.get(sessionId);
		if (!client) {
			throw new Error('Session not found');
		}

		try {
			await client.logout();
			return { success: true, message: 'Session logged out successfully' };
		} catch (error) {
			throw new Error(`Failed to logout session: ${error.message}`);
		}
	}

	getQRCode(sessionId) {
		const qrData = this.qrCodes.get(sessionId);
		if (!qrData) {
			throw new Error(
				'QR code not available. Session might be authenticated or not initialized.'
			);
		}
		return qrData;
	}

	getSessionState(sessionId) {
		if (!this.sessionStates.has(sessionId)) {
			throw new Error('Session not found');
		}
		return {
			sessionId,
			state: this.sessionStates.get(sessionId),
			hasQR: this.qrCodes.has(sessionId),
		};
	}

	getAllSessions() {
		const sessions = [];
		this.sessionStates.forEach((state, sessionId) => {
			sessions.push({
				sessionId,
				state,
				hasQR: this.qrCodes.has(sessionId),
			});
		});
		return sessions;
	}

	getClient(sessionId) {
		const client = this.clients.get(sessionId);
		if (!client) {
			throw new Error('Session not found');
		}
		const state = this.sessionStates.get(sessionId);
		if (state !== 'ready') {
			throw new Error(`Session not ready. Current state: ${state}`);
		}
		return client;
	}

	isSessionReady(sessionId) {
		return this.sessionStates.get(sessionId) === 'ready';
	}
}

module.exports = new ClientManager();

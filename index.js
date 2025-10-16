require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const sessionRoutes = require('./src/routes/session');
const messageRoutes = require('./src/routes/message');
const contactRoutes = require('./src/routes/contact');
const chatRoutes = require('./src/routes/chat');
const groupRoutes = require('./src/routes/group');
const statusRoutes = require('./src/routes/status');
const interfaceRoutes = require('./src/routes/interface');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));
app.use('/api', limiter);

app.get('/', (req, res) => {
	res.json({
		status: 'online',
		message: 'WhatsApp Web API is running',
		version: '1.0.0',
		endpoints: {
			session: '/api/session',
			message: '/api/message',
			contact: '/api/contact',
			chat: '/api/chat',
			group: '/api/group',
			status: '/api/status',
			interface: '/api/interface',
		},
		documentation: 'See API_DOCUMENTATION.md for complete API reference',
	});
});

app.get('/health', (req, res) => {
	res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/session', sessionRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/interface', interfaceRoutes);

app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
	console.error('Error:', err);
	res.status(500).json({
		error: 'Internal server error',
		message: err.message,
	});
});

const server = app.listen(PORT, () => {
	console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     WhatsApp Web API Server                                   ║
║     Version: 1.0.0                                           ║
║                                                               ║
║     Server running on: http://localhost:${PORT}                 ║
║                                                               ║
║     API Endpoints:                                            ║
║     - Session Management:  /api/session                       ║
║     - Messaging:          /api/message                        ║
║     - Contacts:           /api/contact                        ║
║     - Chats:              /api/chat                           ║
║     - Groups:             /api/group                          ║
║     - Status:             /api/status                         ║
║     - Interface:          /api/interface                      ║
║                                                               ║
║     Documentation: API_DOCUMENTATION.md                       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
});

process.on('SIGINT', async () => {
	console.log('\nShutting down gracefully...');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;

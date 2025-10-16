const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const sessionId = 'test-session';

// Test colors
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
};

function log(message, color = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, fn) {
	try {
		log(`\n[TEST] ${name}`, 'blue');
		const result = await fn();
		log(`[PASS] ${name}`, 'green');
		return result;
	} catch (error) {
		log(`[FAIL] ${name}: ${error.message}`, 'red');
		if (error.response?.data) {
			console.log('Response:', error.response.data);
		}
		return null;
	}
}

async function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
	log('='.repeat(60), 'yellow');
	log('WhatsApp API Test Suite', 'yellow');
	log('='.repeat(60), 'yellow');

	// Test 1: Health Check
	await testEndpoint('Health Check', async () => {
		const response = await axios.get('http://localhost:3000/health');
		console.log('Server Status:', response.data.status);
		return response.data;
	});

	// Test 2: Start Session
	await testEndpoint('Start Session', async () => {
		const response = await axios.post(`${API_BASE}/session/start`, {
			sessionId: sessionId,
		});
		console.log('Session Started:', response.data);
		return response.data;
	});

	// Wait for session to initialize
	log('\nWaiting 5 seconds for session to initialize...', 'yellow');
	await wait(5000);

	// Test 3: Check Session Status
	const statusResult = await testEndpoint('Check Session Status', async () => {
		const response = await axios.get(`${API_BASE}/session/status/${sessionId}`);
		console.log('Session State:', response.data.state);
		console.log('Has QR:', response.data.hasQR);
		return response.data;
	});

	// Test 4: Get QR Code if available
	if (statusResult?.hasQR) {
		await testEndpoint('Get QR Code', async () => {
			const response = await axios.get(`${API_BASE}/session/qr/${sessionId}`);
			console.log('QR Code Available: Yes');
			console.log('Scan this QR code with WhatsApp to continue tests...');
			return response.data;
		});

		log('\nℹ️  Please scan the QR code at:', 'blue');
		log(`http://localhost:3000/api/session/qr/${sessionId}/image`, 'blue');
		log(
			'\nAfter scanning, wait for "ready" state to test messaging features',
			'yellow'
		);
	}

	// Test 5: List All Sessions
	await testEndpoint('List All Sessions', async () => {
		const response = await axios.get(`${API_BASE}/session/list`);
		console.log('Total Sessions:', response.data.sessions.length);
		return response.data;
	});

	// If session is ready, test more features
	if (statusResult?.state === 'ready') {
		log('\n🎉 Session is ready! Testing more features...', 'green');

		// Test 6: Get Session Info
		await testEndpoint('Get Session Info', async () => {
			const response = await axios.get(`${API_BASE}/session/info/${sessionId}`);
			console.log('Account Info:', response.data.info);
			return response.data;
		});

		// Test 7: Get Contacts
		await testEndpoint('Get Contacts', async () => {
			const response = await axios.get(`${API_BASE}/contact/list/${sessionId}`);
			console.log('Total Contacts:', response.data.contacts.length);
			return response.data;
		});

		// Test 8: Get Chats
		await testEndpoint('Get Chats', async () => {
			const response = await axios.get(`${API_BASE}/chat/list/${sessionId}`);
			console.log('Total Chats:', response.data.chats.length);
			return response.data;
		});

		log('\n✅ All tests for ready session completed!', 'green');
		log('\nℹ️  To test messaging:', 'blue');
		log('   1. Get a chat ID from the chats list', 'blue');
		log('   2. Use the send message endpoint', 'blue');
		log(`   Example: curl -X POST ${API_BASE}/message/send \\`, 'blue');
		log(`     -H "Content-Type: application/json" \\`, 'blue');
		log(
			`     -d '{"sessionId":"${sessionId}","chatId":"CHAT_ID","message":"Test"}'`,
			'blue'
		);
	} else {
		log('\n⚠️  Session not ready yet. Scan QR code and rerun tests.', 'yellow');
	}

	log('\n' + '='.repeat(60), 'yellow');
	log('Test Suite Completed', 'yellow');
	log('='.repeat(60), 'yellow');
}

// Run tests
log('\nMake sure the API server is running on http://localhost:3000', 'yellow');
log('Press Ctrl+C to cancel...\n', 'yellow');

setTimeout(() => {
	runTests().catch((error) => {
		log(`\n❌ Test suite failed: ${error.message}`, 'red');
		process.exit(1);
	});
}, 2000);

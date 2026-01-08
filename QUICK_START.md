# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Server will run on: `http://localhost:3000`

---

## Basic Workflow

### Step 1: Start a Session

```bash
curl -X POST http://localhost:3000/api/session/start \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"mySession"}'
```

### Step 2: Get QR Code

Open in browser or use curl:

```bash
# View QR code image in browser
http://localhost:3000/api/session/qr/mySession/image

# Or get base64 QR code
curl http://localhost:3000/api/session/qr/mySession
```

### Step 3: Scan QR Code

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices → Link a Device
3. Scan the QR code

### Step 4: Wait for Ready Status

```bash
curl http://localhost:3000/api/session/status/mySession
```

Wait for `"state": "ready"`

### Step 5: Send Your First Message

```bash
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "mySession",
    "chatId": "628123456789@c.us",
    "message": "Hello from WhatsApp API! 🚀"
  }'
```

---

## Common Examples

### Send Image

```bash
curl -X POST http://localhost:3000/api/message/send-media \
  -F "sessionId=mySession" \
  -F "chatId=628123456789@c.us" \
  -F "file=@/path/to/image.jpg" \
  -F "caption=Check this out!"
```

### Broadcast Message

```bash
curl -X POST http://localhost:3000/api/message/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "mySession",
    "chatIds": [
      "628123456789@c.us",
      "628987654321@c.us"
    ],
    "message": "Broadcast message to all!"
  }'
```

### Get All Contacts

```bash
curl http://localhost:3000/api/contact/list/mySession
```

### Get All Chats

```bash
curl http://localhost:3000/api/chat/list/mySession
```

### Create Group

```bash
curl -X POST http://localhost:3000/api/group/create \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "mySession",
    "name": "My Group",
    "participants": [
      "628123456789@c.us",
      "628987654321@c.us"
    ]
  }'
```

---

## Important Notes

### Chat ID Format

- **Individual**: `[country_code][number]@c.us`
  - Example: `628123456789@c.us` (Indonesia)
  - Example: `14155552671@c.us` (USA)
- **Group**: `[group_id]@g.us`
  - Example: `628123456789-1234567890@g.us`

### Check if Number Exists

Before sending messages, verify the number is registered:

```bash
curl http://localhost:3000/api/contact/number-exists/mySession/628123456789
```

### Session States

- `initializing` - Starting up
- `qr` - QR code ready to scan
- `authenticated` - QR scanned successfully
- `ready` - Ready to send messages ✅
- `disconnected` - Session lost

---

## Testing with Postman

1. Import both files from `postman/` folder:
   - `WhatsApp-Web-API.postman_collection.json`
   - `WhatsApp-Web-API.postman_environment.json`
2. Select the environment "WhatsApp Web API Environment"
3. Update `baseUrl` if needed (default: `http://localhost:3000/api`)
4. Start testing! Variables are automatically managed - no copy-paste needed!

See [postman/README.md](./postman/README.md) for detailed instructions.

---

## Using with Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const sessionId = 'mySession';

// Start session
async function startSession() {
	const response = await axios.post(`${API_BASE}/session/start`, {
		sessionId: sessionId,
	});
	console.log('Session started:', response.data);
}

// Send message
async function sendMessage(chatId, message) {
	const response = await axios.post(`${API_BASE}/message/send`, {
		sessionId: sessionId,
		chatId: chatId,
		message: message,
	});
	console.log('Message sent:', response.data);
}

// Usage
startSession();
// Wait for QR scan and ready status
// sendMessage('628123456789@c.us', 'Hello!');
```

---

## Using with Python

```python
import requests

API_BASE = 'http://localhost:3000/api'
session_id = 'mySession'

# Start session
def start_session():
    response = requests.post(f'{API_BASE}/session/start', json={
        'sessionId': session_id
    })
    print('Session started:', response.json())

# Send message
def send_message(chat_id, message):
    response = requests.post(f'{API_BASE}/message/send', json={
        'sessionId': session_id,
        'chatId': chat_id,
        'message': message
    })
    print('Message sent:', response.json())

# Usage
start_session()
# Wait for QR scan and ready status
# send_message('628123456789@c.us', 'Hello!')
```

---

## Using with PHP

```php
<?php
$API_BASE = 'http://localhost:3000/api';
$sessionId = 'mySession';

// Start session
function startSession() {
    global $API_BASE, $sessionId;

    $curl = curl_init("$API_BASE/session/start");
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode([
        'sessionId' => $sessionId
    ]));
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    curl_close($curl);

    return json_decode($response, true);
}

// Send message
function sendMessage($chatId, $message) {
    global $API_BASE, $sessionId;

    $curl = curl_init("$API_BASE/message/send");
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode([
        'sessionId' => $sessionId,
        'chatId' => $chatId,
        'message' => $message
    ]));
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    curl_close($curl);

    return json_decode($response, true);
}

// Usage
$result = startSession();
print_r($result);
?>
```

---

## Docker Quick Start

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Troubleshooting

### QR Code Not Showing

```bash
# Check session status
curl http://localhost:3000/api/session/status/mySession

# If needed, stop and restart
curl -X POST http://localhost:3000/api/session/stop/mySession
curl -X POST http://localhost:3000/api/session/start -d '{"sessionId":"mySession"}'
```

### Message Not Sending

1. Check session status is `ready`
2. Verify chat ID format
3. Ensure number exists on WhatsApp

### Session Lost

If session disconnects, you may need to scan QR again:

```bash
# Get new QR code
curl http://localhost:3000/api/session/qr/mySession
```

---

## Next Steps

- Read full documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Explore all endpoints in Postman
- Implement webhooks for incoming messages
- Add authentication for production use

Happy automating! 🚀

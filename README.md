# WhatsApp Web API

Complete REST API wrapper for WhatsApp Web using [whatsapp-web.js](https://docs.wwebjs.dev/). This API allows you to automate WhatsApp messaging, manage contacts, groups, and more through HTTP endpoints.

## Features

✅ **Multi-Session Support** - Handle multiple WhatsApp accounts simultaneously  
✅ **Complete Message Management** - Send text, media, location, contacts, polls  
✅ **Broadcast Messages** - Send messages to multiple chats at once  
✅ **Contact Management** - Get contacts, profile pictures, block/unblock  
✅ **Chat Operations** - Archive, pin, mute, delete chats  
✅ **Group Management** - Create, manage members, settings, invite codes  
✅ **Message Operations** - React, reply, edit, delete, star, pin messages  
✅ **Status Updates** - Post text and media to WhatsApp status  
✅ **Interface Controls** - Control WhatsApp Web UI programmatically  
✅ **Production Ready** - Docker support, rate limiting, error handling

## Quick Start

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd whatsapp-api
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

### Using Docker

```bash
# Build image
docker build -t whatsapp-api .

# Run container
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/session-data:/app/.wwebjs_auth \
  --name whatsapp-api \
  whatsapp-api
```

## Usage

### 1. Start a Session

```bash
curl -X POST http://localhost:3000/api/session/start \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"user123"}'
```

### 2. Get QR Code

```bash
# Get QR code as JSON
curl http://localhost:3000/api/session/qr/user123

# Get QR code as image
curl http://localhost:3000/api/session/qr/user123/image -o qr.png
```

Scan the QR code with your WhatsApp mobile app (Linked Devices).

### 3. Check Session Status

```bash
curl http://localhost:3000/api/session/status/user123
```

Wait until status is `ready` before sending messages.

### 4. Send a Message

```bash
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user123",
    "chatId": "628123456789@c.us",
    "message": "Hello from WhatsApp API!"
  }'
```

### 5. Send Media

```bash
curl -X POST http://localhost:3000/api/message/send-media \
  -F "sessionId=user123" \
  -F "chatId=628123456789@c.us" \
  -F "file=@/path/to/image.jpg" \
  -F "caption=Check this out!"
```

### 6. Broadcast Message

```bash
curl -X POST http://localhost:3000/api/message/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user123",
    "chatIds": ["628123456789@c.us", "628987654321@c.us"],
    "message": "Broadcast to multiple chats!"
  }'
```

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Available Endpoints

- **Session Management**: `/api/session/*`
- **Messaging**: `/api/message/*`
- **Contacts**: `/api/contact/*`
- **Chats**: `/api/chat/*`
- **Groups**: `/api/group/*`
- **Status**: `/api/status/*`
- **Interface**: `/api/interface/*`

### Postman Collection

Import the Postman collection and environment from the `postman/` folder:
- **Collection**: `postman/WhatsApp-Web-API.postman_collection.json`
- **Environment**: `postman/WhatsApp-Web-API.postman_environment.json`

See [postman/README.md](./postman/README.md) for detailed setup instructions and automatic variable management features.

## Chat ID Format

WhatsApp uses specific formats for chat IDs:

- **Individual chats**: `[country_code][number]@c.us`
  - Example: `628123456789@c.us` (Indonesian number)
  - Example: `14155552671@c.us` (US number)
- **Group chats**: `[group_id]@g.us`
  - Example: `628123456789-1234567890@g.us`
- **Broadcast/Status**: `status@broadcast`

## Architecture

```
whatsapp-api/
├── src/
│   ├── clientManager.js      # Multi-session WhatsApp client manager
│   └── routes/
│       ├── session.js         # Session management endpoints
│       ├── message.js         # Messaging endpoints
│       ├── contact.js         # Contact management endpoints
│       ├── chat.js            # Chat operations endpoints
│       ├── group.js           # Group management endpoints
│       ├── status.js          # Status update endpoints
│       └── interface.js       # Interface control endpoints
├── index.js                   # Main Express server
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
```

### Rate Limiting

Default rate limit: 1000 requests per 15 minutes per IP

Adjust in `index.js`:

```javascript
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
});
```

## Best Practices

### For Production Use

1. **Implement Authentication**: Add API key or JWT authentication
2. **Use HTTPS**: Deploy behind a reverse proxy (nginx, traefik)
3. **Monitor Resources**: Watch CPU and memory usage for multiple sessions
4. **Session Persistence**: Keep session data backed up
5. **Error Handling**: Implement proper error logging and monitoring
6. **Rate Limiting**: Respect WhatsApp's rate limits to avoid bans
7. **Message Delays**: Add 1-2 second delays between messages

### Avoiding Bans

- Don't spam messages
- Use realistic delays between actions
- Don't run on VPS/cloud (higher ban risk)
- Limit number of messages per day
- Don't use unofficial modifications

## Troubleshooting

### QR Code Not Generated

- Check if session already exists
- Restart the session
- Check Docker logs: `docker logs whatsapp-api`

### Session Not Ready

- Wait 20-30 seconds after scanning QR
- Check session status endpoint
- Verify WhatsApp is connected on mobile

### Messages Not Sending

- Verify session state is `ready`
- Check chat ID format
- Ensure number is registered on WhatsApp
- Check rate limits

### Docker Issues

```bash
# View logs
docker logs whatsapp-api

# Restart container
docker restart whatsapp-api

# Remove and recreate
docker-compose down
docker-compose up -d
```

## Performance

### Resource Requirements

Per session:

- CPU: ~0.5 core
- RAM: ~500MB - 1GB
- Disk: ~100MB for session data

### Scaling

For handling 100+ sessions:

- Use dedicated server
- Monitor memory usage
- Implement session rotation
- Use Redis for session management (advanced)

## Security

### Recommendations

1. **Don't expose publicly** without authentication
2. **Use environment variables** for sensitive data
3. **Implement API keys** for access control
4. **Use HTTPS** in production
5. **Whitelist IPs** if possible
6. **Regular backups** of session data

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Disclaimer

This project is **not affiliated with WhatsApp** or Meta Platforms, Inc.

**Important**: WhatsApp does not officially support bots or unofficial clients. Using this API may result in your WhatsApp account being banned. Use at your own risk.

For official WhatsApp Business API, visit [WhatsApp Business Platform](https://business.whatsapp.com/).

## License

ISC License

## Support

- Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- whatsapp-web.js: [https://docs.wwebjs.dev/](https://docs.wwebjs.dev/)
- Issues: Open a GitHub issue

## Acknowledgments

Built with:

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web client
- [Express.js](https://expressjs.com/) - Web framework
- [Puppeteer](https://pptr.dev/) - Browser automation

---

**Made for developers who need WhatsApp automation** 🚀

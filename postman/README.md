# Postman Collection for WhatsApp Web API

This folder contains the Postman collection and environment files for testing the WhatsApp Web API Wrapper.

## Files

- **WhatsApp-Web-API.postman_collection.json** - Complete Postman collection with all API endpoints
- **WhatsApp-Web-API.postman_environment.json** - Environment variables for easy configuration
- **README.md** - This file

## Quick Start

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Import both files:
   - `WhatsApp-Web-API.postman_collection.json`
   - `WhatsApp-Web-API.postman_environment.json`
4. Select the environment **"WhatsApp Web API Environment"** from the dropdown

### 2. Configure Base URL

1. Click on the environment name in the top right
2. Click **Edit** (or click the eye icon)
3. Update `baseUrl` if your API is running on a different host/port:
   - Default: `http://localhost:3000/api`
   - For Docker: `http://localhost:3000/api`
   - For production: `https://your-domain.com/api`

### 3. Start Using the API

The collection includes **automatic variable management** scripts that will:

- **Auto-generate sessionId** if not set
- **Auto-save sessionId** when you start a session
- **Auto-save chatId** when you list chats (first chat)
- **Auto-save contactId** when you list contacts (first contact)
- **Auto-save groupId** when you create or join a group
- **Auto-save messageId** when you send a message
- **Auto-save inviteCode** when you get a group invite code

## How It Works

### Automatic Variable Extraction

The collection includes pre-request and test scripts that automatically extract values from API responses:

1. **Pre-request Scripts** (Collection Level):
   - Auto-generates `sessionId` if not set (format: `session_<timestamp>`)

2. **Test Scripts** (Collection Level):
   - Extracts `sessionId` from start session response
   - Extracts `messageId` from send message responses
   - Extracts `groupId` from create/join group responses
   - Extracts `chatId` from list chats (first chat)
   - Extracts `contactId` from list contacts (first contact)
   - Extracts `inviteCode` from get invite code response

3. **Individual Request Scripts**:
   - Some requests have specific test scripts to save values immediately after the request

### Manual Variable Override

You can manually set any variable:

1. Click on the environment name
2. Click **Edit**
3. Update the value
4. Click **Save**

Or use the **Set** button in the environment panel to quickly update values.

## Usage Flow

### Typical Workflow

1. **Start Session**:
   - Run "Start Session" request
   - `sessionId` is automatically saved

2. **Get QR Code**:
   - Run "Get QR Code Image" request
   - Scan QR code with WhatsApp mobile app

3. **Check Status**:
   - Run "Check Session Status" repeatedly until state is "ready"

4. **List Chats/Contacts**:
   - Run "Get All Chats" or "Get All Contacts"
   - First `chatId`/`contactId` is automatically saved

5. **Send Message**:
   - Run "Send Text Message"
   - `lastMessageId` is automatically saved

6. **Use Saved Values**:
   - All subsequent requests use the saved variables automatically
   - No need to copy-paste values!

## Environment Variables

| Variable | Description | Auto-Saved From |
|----------|-------------|-----------------|
| `baseUrl` | API base URL | Manual setup |
| `sessionId` | Current session ID | Start Session |
| `chatId` | Current chat ID | List Chats |
| `contactId` | Current contact ID | List Contacts |
| `groupId` | Current group ID | Create/Join Group |
| `lastMessageId` | Last sent message ID | Send Message |
| `inviteCode` | Group invite code | Get Invite Code |

## Tips

1. **Multiple Sessions**: To test multiple sessions, create a new environment or manually change `sessionId`

2. **Different Chats**: Update `chatId` manually or run "Get All Chats" to get a different chat

3. **Testing Groups**: Create a group first, then `groupId` will be saved automatically

4. **Message Operations**: After sending a message, `lastMessageId` is saved and can be used for:
   - Reply
   - Forward
   - React
   - Edit
   - Delete
   - Pin/Unpin
   - Star/Unstar

5. **View Variables**: Click the eye icon next to the environment name to see current values

## Troubleshooting

### Variables Not Saving

- Check that the environment is selected (top right dropdown)
- Verify the response is JSON format
- Check Postman console (View → Show Postman Console) for script errors

### Wrong Values

- Manually update variables in the environment
- Or run the appropriate "List" request to refresh values

### Base URL Issues

- Ensure your API server is running
- Check the port matches your configuration
- For Docker, use `http://localhost:3000/api`

## Collection Structure

The collection is organized into folders:

- **Session Management** - Start, stop, QR code, status
- **Messaging** - Send messages, media, reactions, etc.
- **Contacts** - List, get, block contacts
- **Chats** - List chats, messages, archive, pin, mute
- **Groups** - Create, manage groups, participants
- **Status** - Set status, post status updates
- **Interface Controls** - Control WhatsApp Web UI

Each request includes:
- Proper HTTP method
- Required headers
- Request body examples
- Automatic variable extraction scripts
- Descriptions

## Support

For API documentation, see:
- `API_DOCUMENTATION.md` - Complete API reference
- `README.md` - Project overview
- `QUICK_START.md` - Quick start guide


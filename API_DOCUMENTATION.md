# WhatsApp Web API Documentation

Complete API wrapper for WhatsApp Web using whatsapp-web.js

## Base URL

```
http://localhost:3000/api
```

## Table of Contents

1. [Session Management](#session-management)
2. [Messaging](#messaging)
3. [Contacts](#contacts)
4. [Chats](#chats)
5. [Groups](#groups)
6. [Status](#status)
7. [Interface Controls](#interface-controls)

---

## Session Management

### Start Session

Create a new WhatsApp session.

**Endpoint:** `POST /session/start`

**Request Body:**

```json
{
	"sessionId": "user123",
	"options": {}
}
```

**Response:**

```json
{
	"success": true,
	"message": "Session created successfully"
}
```

---

### Get QR Code

Get QR code for session authentication.

**Endpoint:** `GET /session/qr/:sessionId`

**Response:**

```json
{
	"qr": "base64_qr_string",
	"qrImage": "data:image/png;base64,..."
}
```

---

### Get QR Code Image

Get QR code as PNG image.

**Endpoint:** `GET /session/qr/:sessionId/image`

**Response:** PNG Image

---

### Check Session Status

Check the status of a session.

**Endpoint:** `GET /session/status/:sessionId`

**Response:**

```json
{
	"sessionId": "user123",
	"state": "ready",
	"hasQR": false
}
```

**Possible States:**

- `initializing` - Session is being initialized
- `qr` - QR code is available for scanning
- `authenticated` - Session is authenticated
- `ready` - Session is ready to use
- `auth_failure` - Authentication failed
- `disconnected` - Session disconnected

---

### List All Sessions

Get all active sessions.

**Endpoint:** `GET /session/list`

**Response:**

```json
{
	"sessions": [
		{
			"sessionId": "user123",
			"state": "ready",
			"hasQR": false
		}
	]
}
```

---

### Get Session Info

Get WhatsApp account info for a session.

**Endpoint:** `GET /session/info/:sessionId`

**Response:**

```json
{
	"info": {
		"wid": "628123456789@c.us",
		"pushname": "John Doe",
		"platform": "android"
	}
}
```

---

### Get Session State

Get the current state of WhatsApp Web.

**Endpoint:** `GET /session/state/:sessionId`

**Response:**

```json
{
	"state": "CONNECTED"
}
```

---

### Logout Session

Logout from a session without destroying it.

**Endpoint:** `POST /session/logout/:sessionId`

**Response:**

```json
{
	"success": true,
	"message": "Session logged out successfully"
}
```

---

### Stop Session

Stop and destroy a session completely.

**Endpoint:** `POST /session/stop/:sessionId`

**Response:**

```json
{
	"success": true,
	"message": "Session destroyed successfully"
}
```

---

## Messaging

### Send Text Message

Send a text message to a chat.

**Endpoint:** `POST /message/send`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"message": "Hello, World!",
	"options": {
		"linkPreview": true
	}
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"timestamp": 1634567890
}
```

---

### Send Media Message

Send media (image, video, audio, document) to a chat.

**Endpoint:** `POST /message/send-media`

**Request Body (multipart/form-data):**

- `sessionId`: Session ID
- `chatId`: Chat ID
- `file`: File to send (or use `mediaUrl` or `mediaPath`)
- `caption`: Optional caption
- `options`: JSON string of additional options

**Alternative (JSON):**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"mediaUrl": "https://example.com/image.jpg",
	"caption": "Check this out!"
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"timestamp": 1634567890
}
```

---

### Send Location

Send a location to a chat.

**Endpoint:** `POST /message/send-location`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"latitude": -6.2088,
	"longitude": 106.8456,
	"description": "Jakarta, Indonesia"
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"timestamp": 1634567890
}
```

---

### Send Contact

Send a contact card to a chat.

**Endpoint:** `POST /message/send-contact`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"contactId": "628987654321@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"timestamp": 1634567890
}
```

---

### Send Poll

Send a poll to a chat.

**Endpoint:** `POST /message/send-poll`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"pollName": "What's your favorite color?",
	"pollOptions": ["Red", "Blue", "Green", "Yellow"],
	"options": {
		"allowMultipleAnswers": false
	}
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"timestamp": 1634567890
}
```

---

### Broadcast Message

Send a message to multiple chats.

**Endpoint:** `POST /message/broadcast`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatIds": ["628123456789@c.us", "628987654321@c.us"],
	"message": "Broadcast message"
}
```

**Response:**

```json
{
	"success": true,
	"results": [
		{
			"chatId": "628123456789@c.us",
			"success": true,
			"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
		},
		{
			"chatId": "628987654321@c.us",
			"success": true,
			"messageId": "true_628987654321@c.us_3EB0987654321FEDCBA"
		}
	]
}
```

---

### Broadcast Media

Send media to multiple chats.

**Endpoint:** `POST /message/broadcast-media`

**Request Body (multipart/form-data):**

- `sessionId`: Session ID
- `chatIds`: JSON array of chat IDs
- `file`: File to send (or use `mediaUrl`)
- `caption`: Optional caption

**Response:**

```json
{
	"success": true,
	"results": [
		{
			"chatId": "628123456789@c.us",
			"success": true,
			"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
		}
	]
}
```

---

### Reply to Message

Reply to a specific message.

**Endpoint:** `POST /message/reply`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"message": "This is a reply",
	"options": {}
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628123456789@c.us_3EB0123456789GHIJKL",
	"timestamp": 1634567890
}
```

---

### Forward Message

Forward a message to another chat.

**Endpoint:** `POST /message/forward`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"chatId": "628987654321@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"messageId": "true_628987654321@c.us_3EB0987654321FEDCBA",
	"timestamp": 1634567890
}
```

---

### React to Message

Add a reaction to a message.

**Endpoint:** `POST /message/react`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"reaction": "👍"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Reaction sent successfully"
}
```

---

### Edit Message

Edit a sent message.

**Endpoint:** `POST /message/edit`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"newContent": "Edited message",
	"options": {}
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message edited successfully"
}
```

---

### Delete Message

Delete a message.

**Endpoint:** `POST /message/delete`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"everyone": true
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message deleted successfully"
}
```

---

### Star Message

Star a message.

**Endpoint:** `POST /message/star`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message starred successfully"
}
```

---

### Unstar Message

Unstar a message.

**Endpoint:** `POST /message/unstar`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message unstarred successfully"
}
```

---

### Pin Message

Pin a message in a chat.

**Endpoint:** `POST /message/pin`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF",
	"duration": 86400
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message pinned successfully"
}
```

---

### Unpin Message

Unpin a message.

**Endpoint:** `POST /message/unpin`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message unpinned successfully"
}
```

---

### Get Message Info

Get delivery info for a message.

**Endpoint:** `GET /message/info/:sessionId/:messageId`

**Response:**

```json
{
	"success": true,
	"info": {
		"delivery": [],
		"deliveryRemaining": 0,
		"played": [],
		"playedRemaining": 0,
		"read": [],
		"readRemaining": 0
	}
}
```

---

### Get Message Reactions

Get reactions for a message.

**Endpoint:** `GET /message/reactions/:sessionId/:messageId`

**Response:**

```json
{
	"success": true,
	"reactions": [
		{
			"id": "reaction_id",
			"reaction": "👍",
			"senderId": "628123456789@c.us",
			"timestamp": 1634567890
		}
	]
}
```

---

### Download Media

Download media from a message.

**Endpoint:** `POST /message/download-media`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"media": {
		"mimetype": "image/jpeg",
		"data": "base64_encoded_data",
		"filename": "image.jpg"
	}
}
```

---

### Mark Chat as Seen

Mark a chat as seen.

**Endpoint:** `POST /message/mark-seen`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat marked as seen"
}
```

---

### Send Typing State

Send typing indicator.

**Endpoint:** `POST /message/typing`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"duration": 5000
}
```

**Response:**

```json
{
	"success": true,
	"message": "Typing state sent"
}
```

---

### Send Recording State

Send recording indicator.

**Endpoint:** `POST /message/recording`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"duration": 5000
}
```

**Response:**

```json
{
	"success": true,
	"message": "Recording state sent"
}
```

---

### Clear Chat State

Clear typing/recording state.

**Endpoint:** `POST /message/clear-state`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat state cleared"
}
```

---

## Contacts

### Get All Contacts

Get all contacts.

**Endpoint:** `GET /contact/list/:sessionId`

**Response:**

```json
{
	"success": true,
	"contacts": [
		{
			"id": "628123456789@c.us",
			"name": "John Doe",
			"pushname": "John",
			"shortName": "John",
			"number": "628123456789",
			"isMe": false,
			"isUser": true,
			"isGroup": false,
			"isWAContact": true,
			"isMyContact": true,
			"isBlocked": false,
			"isBusiness": false,
			"isEnterprise": false
		}
	]
}
```

---

### Get Contact by ID

Get contact information.

**Endpoint:** `GET /contact/get/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"contact": {
		"id": "628123456789@c.us",
		"name": "John Doe",
		"pushname": "John",
		"number": "628123456789",
		"isBlocked": false
	}
}
```

---

### Get Profile Picture

Get contact's profile picture URL.

**Endpoint:** `GET /contact/profile-pic/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"profilePicUrl": "https://pps.whatsapp.net/..."
}
```

---

### Get About

Get contact's about/status.

**Endpoint:** `GET /contact/about/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"about": "Hey there! I am using WhatsApp."
}
```

---

### Get Common Groups

Get common groups with a contact.

**Endpoint:** `GET /contact/common-groups/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"commonGroups": [
		{
			"id": "628123456789-1234567890@g.us",
			"name": "Group Name"
		}
	]
}
```

---

### Block Contact

Block a contact.

**Endpoint:** `POST /contact/block`

**Request Body:**

```json
{
	"sessionId": "user123",
	"contactId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Contact blocked successfully"
}
```

---

### Unblock Contact

Unblock a contact.

**Endpoint:** `POST /contact/unblock`

**Request Body:**

```json
{
	"sessionId": "user123",
	"contactId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Contact unblocked successfully"
}
```

---

### Get Formatted Number

Get formatted phone number.

**Endpoint:** `GET /contact/formatted-number/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"formattedNumber": "+62 812-3456-7890"
}
```

---

### Get Country Code

Get country code of a contact.

**Endpoint:** `GET /contact/country-code/:sessionId/:contactId`

**Response:**

```json
{
	"success": true,
	"countryCode": "62"
}
```

---

### Check Number Exists

Check if a number is registered on WhatsApp.

**Endpoint:** `GET /contact/number-exists/:sessionId/:number`

**Response:**

```json
{
	"success": true,
	"exists": true,
	"numberId": "628123456789@c.us"
}
```

---

## Chats

### Get All Chats

Get all chats.

**Endpoint:** `GET /chat/list/:sessionId`

**Response:**

```json
{
	"success": true,
	"chats": [
		{
			"id": "628123456789@c.us",
			"name": "John Doe",
			"isGroup": false,
			"isReadOnly": false,
			"unreadCount": 5,
			"timestamp": 1634567890,
			"archived": false,
			"pinned": false,
			"isMuted": false,
			"muteExpiration": 0
		}
	]
}
```

---

### Get Chat by ID

Get specific chat information.

**Endpoint:** `GET /chat/get/:sessionId/:chatId`

**Response:**

```json
{
	"success": true,
	"chat": {
		"id": "628123456789@c.us",
		"name": "John Doe",
		"isGroup": false,
		"unreadCount": 5,
		"timestamp": 1634567890
	}
}
```

---

### Get Chat Messages

Get messages from a chat.

**Endpoint:** `GET /chat/messages/:sessionId/:chatId?limit=50`

**Query Parameters:**

- `limit`: Number of messages to fetch (default: 50)
- `searchOptions`: JSON string of search options

**Response:**

```json
{
	"success": true,
	"messages": [
		{
			"id": "true_628123456789@c.us_3EB0123456789ABCDEF",
			"body": "Hello!",
			"type": "chat",
			"timestamp": 1634567890,
			"from": "628123456789@c.us",
			"to": "628987654321@c.us",
			"fromMe": false,
			"hasMedia": false
		}
	]
}
```

---

### Archive Chat

Archive a chat.

**Endpoint:** `POST /chat/archive`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat archived successfully"
}
```

---

### Unarchive Chat

Unarchive a chat.

**Endpoint:** `POST /chat/unarchive`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat unarchived successfully"
}
```

---

### Pin Chat

Pin a chat.

**Endpoint:** `POST /chat/pin`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat pinned successfully"
}
```

---

### Unpin Chat

Unpin a chat.

**Endpoint:** `POST /chat/unpin`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat unpinned successfully"
}
```

---

### Mute Chat

Mute a chat.

**Endpoint:** `POST /chat/mute`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"unmuteDate": 1734567890
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat muted successfully"
}
```

---

### Unmute Chat

Unmute a chat.

**Endpoint:** `POST /chat/unmute`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat unmuted successfully"
}
```

---

### Mark as Unread

Mark a chat as unread.

**Endpoint:** `POST /chat/mark-unread`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat marked as unread"
}
```

---

### Clear Messages

Clear all messages in a chat.

**Endpoint:** `POST /chat/clear-messages`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat messages cleared successfully"
}
```

---

### Delete Chat

Delete a chat.

**Endpoint:** `POST /chat/delete`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat deleted successfully"
}
```

---

### Get Pinned Messages

Get pinned messages in a chat.

**Endpoint:** `GET /chat/pinned-messages/:sessionId/:chatId`

**Response:**

```json
{
	"success": true,
	"pinnedMessages": []
}
```

---

### Get All Labels

Get all labels.

**Endpoint:** `GET /chat/labels/:sessionId`

**Response:**

```json
{
	"success": true,
	"labels": [
		{
			"id": "1",
			"name": "Important",
			"hexColor": "#FF0000"
		}
	]
}
```

---

### Get Chat Labels

Get labels for a specific chat.

**Endpoint:** `GET /chat/chat-labels/:sessionId/:chatId`

**Response:**

```json
{
	"success": true,
	"labels": [
		{
			"id": "1",
			"name": "Important",
			"hexColor": "#FF0000"
		}
	]
}
```

---

### Change Chat Labels

Change labels for a chat.

**Endpoint:** `POST /chat/change-labels`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us",
	"labelIds": ["1", "2"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat labels changed successfully"
}
```

---

## Groups

### Create Group

Create a new group.

**Endpoint:** `POST /group/create`

**Request Body:**

```json
{
	"sessionId": "user123",
	"name": "My New Group",
	"participants": ["628123456789@c.us", "628987654321@c.us"]
}
```

**Response:**

```json
{
	"success": true,
	"group": {
		"gid": "628123456789-1234567890@g.us",
		"title": "My New Group"
	}
}
```

---

### Get Group Info

Get group information.

**Endpoint:** `GET /group/info/:sessionId/:groupId`

**Response:**

```json
{
	"success": true,
	"group": {
		"id": "628123456789-1234567890@g.us",
		"name": "Group Name",
		"description": "Group description",
		"owner": "628123456789@c.us",
		"createdAt": 1634567890,
		"participants": [
			{
				"id": "628123456789@c.us",
				"isAdmin": true,
				"isSuperAdmin": true
			}
		]
	}
}
```

---

### Add Participants

Add participants to a group.

**Endpoint:** `POST /group/add-participants`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"participants": ["628111222333@c.us"],
	"options": {}
}
```

**Response:**

```json
{
	"success": true,
	"result": {}
}
```

---

### Remove Participants

Remove participants from a group.

**Endpoint:** `POST /group/remove-participants`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"participants": ["628111222333@c.us"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Participants removed successfully"
}
```

---

### Promote Participants

Promote participants to admin.

**Endpoint:** `POST /group/promote-participants`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"participants": ["628111222333@c.us"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Participants promoted successfully"
}
```

---

### Demote Participants

Demote admins to regular participants.

**Endpoint:** `POST /group/demote-participants`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"participants": ["628111222333@c.us"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Participants demoted successfully"
}
```

---

### Set Group Subject

Change group name.

**Endpoint:** `POST /group/set-subject`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"subject": "New Group Name"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group subject updated successfully"
}
```

---

### Set Group Description

Change group description.

**Endpoint:** `POST /group/set-description`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"description": "New group description"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group description updated successfully"
}
```

---

### Set Group Picture

Set group picture.

**Endpoint:** `POST /group/set-picture`

**Request Body (multipart/form-data):**

- `sessionId`: Session ID
- `groupId`: Group ID
- `file`: Image file (or use `mediaUrl`)

**Response:**

```json
{
	"success": true,
	"message": "Group picture updated successfully"
}
```

---

### Delete Group Picture

Delete group picture.

**Endpoint:** `POST /group/delete-picture`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group picture deleted successfully"
}
```

---

### Get Invite Code

Get group invite link code.

**Endpoint:** `GET /group/invite-code/:sessionId/:groupId`

**Response:**

```json
{
	"success": true,
	"inviteCode": "ABC123DEF456"
}
```

---

### Revoke Invite Code

Revoke and generate new invite code.

**Endpoint:** `POST /group/revoke-invite`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us"
}
```

**Response:**

```json
{
	"success": true,
	"newInviteCode": "XYZ789UVW012"
}
```

---

### Join Group by Code

Join a group using invite code.

**Endpoint:** `POST /group/join-by-code`

**Request Body:**

```json
{
	"sessionId": "user123",
	"inviteCode": "ABC123DEF456"
}
```

**Response:**

```json
{
	"success": true,
	"chatId": "628123456789-1234567890@g.us"
}
```

---

### Leave Group

Leave a group.

**Endpoint:** `POST /group/leave`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Left group successfully"
}
```

---

### Set Messages Admins Only

Set group to allow only admins to send messages.

**Endpoint:** `POST /group/set-messages-admins-only`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"adminsOnly": true
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group settings updated successfully"
}
```

---

### Set Info Admins Only

Set group info editable by admins only.

**Endpoint:** `POST /group/set-info-admins-only`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"adminsOnly": true
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group settings updated successfully"
}
```

---

### Set Add Members Admins Only

Set adding members restricted to admins only.

**Endpoint:** `POST /group/set-add-members-admins-only`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"adminsOnly": true
}
```

**Response:**

```json
{
	"success": true,
	"message": "Group settings updated successfully"
}
```

---

### Get Membership Requests

Get pending membership requests.

**Endpoint:** `GET /group/membership-requests/:sessionId/:groupId`

**Response:**

```json
{
	"success": true,
	"requests": []
}
```

---

### Approve Membership Requests

Approve membership requests.

**Endpoint:** `POST /group/approve-membership-requests`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"options": {
		"requesterIds": ["628111222333@c.us"]
	}
}
```

**Response:**

```json
{
	"success": true,
	"message": "Membership requests approved successfully"
}
```

---

### Reject Membership Requests

Reject membership requests.

**Endpoint:** `POST /group/reject-membership-requests`

**Request Body:**

```json
{
	"sessionId": "user123",
	"groupId": "628123456789-1234567890@g.us",
	"options": {
		"requesterIds": ["628111222333@c.us"]
	}
}
```

**Response:**

```json
{
	"success": true,
	"message": "Membership requests rejected successfully"
}
```

---

## Status

### Set Status

Set WhatsApp status message.

**Endpoint:** `POST /status/set`

**Request Body:**

```json
{
	"sessionId": "user123",
	"status": "Available"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Status updated successfully"
}
```

---

### Post Text Status

Post text to WhatsApp status.

**Endpoint:** `POST /status/text`

**Request Body:**

```json
{
	"sessionId": "user123",
	"text": "This is my status update!",
	"options": {
		"backgroundColor": "#000000",
		"font": 0
	}
}
```

**Response:**

```json
{
	"success": true,
	"message": "Status text posted successfully"
}
```

---

### Post Media Status

Post media to WhatsApp status.

**Endpoint:** `POST /status/media`

**Request Body (multipart/form-data):**

- `sessionId`: Session ID
- `file`: Media file (or use `mediaUrl`)
- `caption`: Optional caption

**Response:**

```json
{
	"success": true,
	"message": "Status media posted successfully"
}
```

---

## Interface Controls

### Open Chat Window

Open a chat window in WhatsApp Web interface.

**Endpoint:** `POST /interface/open-chat-window`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat window opened successfully"
}
```

---

### Open Chat Window at Message

Open chat at specific message.

**Endpoint:** `POST /interface/open-chat-window-at`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat window opened at message successfully"
}
```

---

### Open Chat Drawer

Open chat info drawer.

**Endpoint:** `POST /interface/open-chat-drawer`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat drawer opened successfully"
}
```

---

### Open Message Drawer

Open message info drawer.

**Endpoint:** `POST /interface/open-message-drawer`

**Request Body:**

```json
{
	"sessionId": "user123",
	"messageId": "true_628123456789@c.us_3EB0123456789ABCDEF"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message drawer opened successfully"
}
```

---

### Open Chat Search

Open search in a chat.

**Endpoint:** `POST /interface/open-chat-search`

**Request Body:**

```json
{
	"sessionId": "user123",
	"chatId": "628123456789@c.us"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Chat search opened successfully"
}
```

---

### Close Right Drawer

Close the right drawer.

**Endpoint:** `POST /interface/close-right-drawer`

**Request Body:**

```json
{
	"sessionId": "user123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Right drawer closed successfully"
}
```

---

### Get Features

Get interface features.

**Endpoint:** `GET /interface/features/:sessionId`

**Response:**

```json
{
	"success": true,
	"features": {}
}
```

---

### Enable Features

Enable interface features.

**Endpoint:** `POST /interface/enable-features`

**Request Body:**

```json
{
	"sessionId": "user123",
	"features": ["feature1", "feature2"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Features enabled successfully"
}
```

---

### Disable Features

Disable interface features.

**Endpoint:** `POST /interface/disable-features`

**Request Body:**

```json
{
	"sessionId": "user123",
	"features": ["feature1", "feature2"]
}
```

**Response:**

```json
{
	"success": true,
	"message": "Features disabled successfully"
}
```

---

### Check Feature Status

Check status of a feature.

**Endpoint:** `POST /interface/check-feature-status`

**Request Body:**

```json
{
	"sessionId": "user123",
	"feature": "feature1"
}
```

**Response:**

```json
{
	"success": true,
	"status": true
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
	"error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found (session or resource not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 1000 requests per 15 minutes per IP address
- Exceeding the limit returns HTTP 429

---

## Chat ID Format

WhatsApp uses specific formats for chat IDs:

- **Individual chats**: `[country_code][number]@c.us`
  - Example: `628123456789@c.us`
- **Group chats**: `[group_id]@g.us`
  - Example: `628123456789-1234567890@g.us`
- **Broadcast/Status**: `status@broadcast`

---

## Message ID Format

Message IDs follow this pattern:

```
[fromMe]_[chatId]_[unique_id]
```

Example: `true_628123456789@c.us_3EB0123456789ABCDEF`

---

## Best Practices

1. **Session Management**

   - Use unique session IDs for each WhatsApp account
   - Check session status before sending messages
   - Handle QR code expiration (scan within 60 seconds)

2. **Rate Limiting**

   - Implement delays between messages (1-2 seconds)
   - For broadcasts, use delays of 3-5 seconds between messages
   - Monitor for rate limit responses

3. **Error Handling**

   - Always check for error responses
   - Implement retry logic with exponential backoff
   - Log errors for debugging

4. **Media Files**

   - Keep media files under 16MB for images
   - Use appropriate MIME types
   - Compress images/videos when possible

5. **Production Deployment**
   - Use environment variables for configuration
   - Implement proper logging
   - Set up monitoring and alerts
   - Use HTTPS in production
   - Implement authentication/API keys

---

## Example Usage

### Node.js Example

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Start session
async function startSession() {
	const response = await axios.post(`${API_BASE}/session/start`, {
		sessionId: 'user123',
	});
	console.log(response.data);
}

// Get QR Code
async function getQR() {
	const response = await axios.get(`${API_BASE}/session/qr/user123`);
	console.log('QR Code:', response.data.qrImage);
}

// Send Message
async function sendMessage() {
	const response = await axios.post(`${API_BASE}/message/send`, {
		sessionId: 'user123',
		chatId: '628123456789@c.us',
		message: 'Hello from API!',
	});
	console.log(response.data);
}
```

### Python Example

```python
import requests

API_BASE = 'http://localhost:3000/api'

# Start session
def start_session():
    response = requests.post(f'{API_BASE}/session/start', json={
        'sessionId': 'user123'
    })
    print(response.json())

# Send Message
def send_message():
    response = requests.post(f'{API_BASE}/message/send', json={
        'sessionId': 'user123',
        'chatId': '628123456789@c.us',
        'message': 'Hello from Python!'
    })
    print(response.json())
```

### cURL Example

```bash
# Start session
curl -X POST http://localhost:3000/api/session/start \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"user123"}'

# Get QR Code
curl http://localhost:3000/api/session/qr/user123

# Send Message
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"user123",
    "chatId":"628123456789@c.us",
    "message":"Hello from cURL!"
  }'
```

---

## Support

For issues and questions:

- Check the [whatsapp-web.js documentation](https://docs.wwebjs.dev/)
- Review error messages carefully
- Ensure your session is in `ready` state before operations

---

## License

This API wrapper is provided as-is. WhatsApp is a trademark of Meta Platforms, Inc. This project is not affiliated with WhatsApp or Meta.

# API Endpoints Reference

Base URL: `http://localhost:3000/api`

## Session Management (`/session`)

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/session/start`               | Start new session        |
| POST   | `/session/stop/:sessionId`     | Stop and destroy session |
| POST   | `/session/logout/:sessionId`   | Logout session           |
| GET    | `/session/qr/:sessionId`       | Get QR code (JSON)       |
| GET    | `/session/qr/:sessionId/image` | Get QR code (PNG image)  |
| GET    | `/session/status/:sessionId`   | Check session status     |
| GET    | `/session/list`                | List all sessions        |
| GET    | `/session/info/:sessionId`     | Get account info         |
| GET    | `/session/state/:sessionId`    | Get WhatsApp state       |

## Messaging (`/message`)

| Method | Endpoint                                   | Description                        |
| ------ | ------------------------------------------ | ---------------------------------- |
| POST   | `/message/send`                            | Send text message                  |
| POST   | `/message/send-media`                      | Send media (image/video/audio/doc) |
| POST   | `/message/send-location`                   | Send location                      |
| POST   | `/message/send-contact`                    | Send contact card                  |
| POST   | `/message/send-poll`                       | Send poll                          |
| POST   | `/message/broadcast`                       | Broadcast text to multiple chats   |
| POST   | `/message/broadcast-media`                 | Broadcast media to multiple chats  |
| POST   | `/message/reply`                           | Reply to message                   |
| POST   | `/message/forward`                         | Forward message                    |
| POST   | `/message/react`                           | React to message (emoji)           |
| POST   | `/message/edit`                            | Edit message                       |
| POST   | `/message/delete`                          | Delete message                     |
| POST   | `/message/star`                            | Star message                       |
| POST   | `/message/unstar`                          | Unstar message                     |
| POST   | `/message/pin`                             | Pin message in chat                |
| POST   | `/message/unpin`                           | Unpin message                      |
| GET    | `/message/info/:sessionId/:messageId`      | Get message delivery info          |
| GET    | `/message/reactions/:sessionId/:messageId` | Get message reactions              |
| POST   | `/message/download-media`                  | Download media from message        |
| POST   | `/message/mark-seen`                       | Mark chat as seen                  |
| POST   | `/message/typing`                          | Send typing indicator              |
| POST   | `/message/recording`                       | Send recording indicator           |
| POST   | `/message/clear-state`                     | Clear typing/recording state       |

## Contacts (`/contact`)

| Method | Endpoint                                          | Description                    |
| ------ | ------------------------------------------------- | ------------------------------ |
| GET    | `/contact/list/:sessionId`                        | Get all contacts               |
| GET    | `/contact/get/:sessionId/:contactId`              | Get contact by ID              |
| GET    | `/contact/profile-pic/:sessionId/:contactId`      | Get profile picture URL        |
| GET    | `/contact/about/:sessionId/:contactId`            | Get contact about/status       |
| GET    | `/contact/common-groups/:sessionId/:contactId`    | Get common groups              |
| POST   | `/contact/block`                                  | Block contact                  |
| POST   | `/contact/unblock`                                | Unblock contact                |
| GET    | `/contact/formatted-number/:sessionId/:contactId` | Get formatted number           |
| GET    | `/contact/country-code/:sessionId/:contactId`     | Get country code               |
| GET    | `/contact/number-exists/:sessionId/:number`       | Check if number is on WhatsApp |

## Chats (`/chat`)

| Method | Endpoint                                   | Description         |
| ------ | ------------------------------------------ | ------------------- |
| GET    | `/chat/list/:sessionId`                    | Get all chats       |
| GET    | `/chat/get/:sessionId/:chatId`             | Get chat by ID      |
| GET    | `/chat/messages/:sessionId/:chatId`        | Get chat messages   |
| POST   | `/chat/archive`                            | Archive chat        |
| POST   | `/chat/unarchive`                          | Unarchive chat      |
| POST   | `/chat/pin`                                | Pin chat            |
| POST   | `/chat/unpin`                              | Unpin chat          |
| POST   | `/chat/mute`                               | Mute chat           |
| POST   | `/chat/unmute`                             | Unmute chat         |
| POST   | `/chat/mark-unread`                        | Mark chat as unread |
| POST   | `/chat/clear-messages`                     | Clear all messages  |
| POST   | `/chat/delete`                             | Delete chat         |
| GET    | `/chat/pinned-messages/:sessionId/:chatId` | Get pinned messages |
| GET    | `/chat/labels/:sessionId`                  | Get all labels      |
| GET    | `/chat/chat-labels/:sessionId/:chatId`     | Get chat labels     |
| POST   | `/chat/change-labels`                      | Change chat labels  |

## Groups (`/group`)

| Method | Endpoint                                         | Description                       |
| ------ | ------------------------------------------------ | --------------------------------- |
| POST   | `/group/create`                                  | Create new group                  |
| GET    | `/group/info/:sessionId/:groupId`                | Get group info                    |
| POST   | `/group/add-participants`                        | Add members to group              |
| POST   | `/group/remove-participants`                     | Remove members from group         |
| POST   | `/group/promote-participants`                    | Promote members to admin          |
| POST   | `/group/demote-participants`                     | Demote admins to members          |
| POST   | `/group/set-subject`                             | Change group name                 |
| POST   | `/group/set-description`                         | Change group description          |
| POST   | `/group/set-picture`                             | Set group picture                 |
| POST   | `/group/delete-picture`                          | Delete group picture              |
| GET    | `/group/invite-code/:sessionId/:groupId`         | Get invite code                   |
| POST   | `/group/revoke-invite`                           | Revoke and create new invite code |
| POST   | `/group/join-by-code`                            | Join group using invite code      |
| POST   | `/group/leave`                                   | Leave group                       |
| POST   | `/group/set-messages-admins-only`                | Set messages to admins only       |
| POST   | `/group/set-info-admins-only`                    | Set info editable by admins only  |
| POST   | `/group/set-add-members-admins-only`             | Set adding members to admins only |
| GET    | `/group/membership-requests/:sessionId/:groupId` | Get membership requests           |
| POST   | `/group/approve-membership-requests`             | Approve membership requests       |
| POST   | `/group/reject-membership-requests`              | Reject membership requests        |

## Status (`/status`)

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| POST   | `/status/set`   | Set status message |
| POST   | `/status/text`  | Post text status   |
| POST   | `/status/media` | Post media status  |

## Interface (`/interface`)

| Method | Endpoint                          | Description                |
| ------ | --------------------------------- | -------------------------- |
| POST   | `/interface/open-chat-window`     | Open chat window           |
| POST   | `/interface/open-chat-window-at`  | Open chat at message       |
| POST   | `/interface/open-chat-drawer`     | Open chat info drawer      |
| POST   | `/interface/open-message-drawer`  | Open message info drawer   |
| POST   | `/interface/open-chat-search`     | Open chat search           |
| POST   | `/interface/close-right-drawer`   | Close right drawer         |
| GET    | `/interface/features/:sessionId`  | Get interface features     |
| POST   | `/interface/enable-features`      | Enable interface features  |
| POST   | `/interface/disable-features`     | Disable interface features |
| POST   | `/interface/check-feature-status` | Check feature status       |

---

**Total Endpoints: 100+**

## Legend

- **GET**: Retrieve data (no body required)
- **POST**: Send data (requires request body)
- `:sessionId`: Your session identifier
- `:chatId`: WhatsApp chat ID (e.g., `628123456789@c.us`)
- `:groupId`: WhatsApp group ID (e.g., `628123456789-1234567890@g.us`)
- `:contactId`: Contact ID (same format as chatId)
- `:messageId`: Message ID (e.g., `true_628123456789@c.us_3EB0123456789ABCDEF`)
- `:number`: Phone number (e.g., `628123456789`)

For detailed request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

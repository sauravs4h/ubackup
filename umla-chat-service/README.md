# umla-chat-service

# Code Documentation

This service contains several asynchronous functions that handle various chat-related operations in a Node.js application using MongoDB.

## Overview

```javascript
const handleMessage = async (targetId, senderId, msgContent) => { /* ... */ };
const handleOfflineTarget = async (targetId, senderId, msgContent) => { /* ... */ };
const getAvailableRooms = async (req, res) => { /* ... */ };
const getChat = async (req, res) => { /* ... */ };
const unmatch = async (req, res) => { /* ... */ };
const handleOfferResponseInChatByGuest = async (req, res) => { /* ... */ };
```

Each function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `handleMessage(targetId, senderId, msgContent)`

This function handles sending a message from one user to another. It first finds the chat room containing both users, then creates a new `Chat` document with the message content and updates the `lastMessage` field of the `Room` document.

### Function: `handleOfflineTarget(targetId, senderId, msgContent)`

This function handles sending a push notification to a user who is offline. It first finds the sender and target users, then sends a push notification to the target user's device.

### Function: `getAvailableRooms(req, res)`

This function handles getting all available chat rooms for a user. It finds all `Room` documents where the user is either the first or second user, then returns these documents in the response.

### Function: `getChat(req, res)`

This function handles getting all chat messages in a specific room. It finds all `Chat` documents with the specified room ID, then returns these documents in the response.

### Function: `unmatch(req, res)`

This function handles unmatching two users. It first finds the `Room` document with the specified room ID, then removes the other user's ID from the `match` array of both users' `Swipe` documents and deletes all chat messages and the room itself.

### Function: `handleOfferResponseInChatByGuest(req, res)`

This function handles a guest user responding to an offer in a chat. Depending on the response, it either updates the `offerStatus` field of the `Room` document and sends a push notification to the owner user, or removes the match between the two users, deletes the offer, and sends a push notification to the owner user.


The provided code consists of several asynchronous functions related to handling offers, managing chat messages, and sending push notifications. Here's an overview of each function:

1. **handleOfferResponseInChatByGuest**: This function handles the response to an offer by a guest in a chat. It accepts the offer ID and response from the request body. It finds the offer, current user, and owner user using their IDs. Then, it finds the chat room associated with the offer. Depending on the response (accept or decline), it updates the offer status, sends push notifications to the owner user, and returns an appropriate message.

 **handleUnreadMesaageCount**: This function calculates the count of unread messages for a given sender ID in the chat. It queries the `Chat` collection to count documents where the sender ID matches and the message is not seen.

3. **makeSeenMessage**: This function marks chat messages as seen between two users in a chat room. It finds the chat room based on the source ID (sender) and target ID (receiver). Then, it updates chat messages where the sender ID matches and the messages are not seen, marking them as seen.

4. **getAllConnectedUser**: This function retrieves all connected users for a given user ID. It finds all chat rooms where the user ID matches either the first or second user ID and returns an array of connected user IDs.

5. **notificationTarget**: This function sends push notifications to a target user. It retrieves sender and target user details, finds the chat room between them, and sends a push notification to the target user's device using the `sendPushNotification` function. It includes details such as sender name, message content, and chat room ID in the notification payload.


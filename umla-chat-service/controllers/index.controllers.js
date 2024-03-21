const {
	handleMessage,
	getAvailableRooms,
	getChat,
	unmatch,
	handleOfflineTarget,
	handleUnreadMesaageCount,
	makeSeenMessage,
	getAllConnectedUser,
	notificationTarget
} = require('./chat/chat.controllers');

module.exports = {
	handleMessage,
	handleOfflineTarget,
	getAvailableRooms,
	getChat,
	unmatch,
	handleUnreadMesaageCount,
	makeSeenMessage,
	getAllConnectedUser,
	notificationTarget
};



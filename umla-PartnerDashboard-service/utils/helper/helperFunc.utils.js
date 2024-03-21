const { Swipe, Room, Chat } = require('../../models/index.models');

const blockUser = async (currentUserId, blockUserId, block) => {
	try {
		const [currentUserSwipe, blockUserSwipe, room] = await Promise.all([
			Swipe.findOne({ uid: currentUserId }),
			Swipe.findOne({ uid: blockUserId }),
			Room.findOne({
				$or: [
					{
						'firstUser.userId': currentUserId,
						'secondUser.userId': blockUserId,
					},
					{
						'firstUser.userId': blockUserId,
						'secondUser.userId': currentUserId,
					},
				],
			}),
			Chat.deleteMany({
				$or: [
					{ sender: currentUserId, receiver: blockUserId },
					{ sender: blockUserId, receiver: currentUserId },
				],
			}),
		]);
		currentUserSwipe.match.pull(blockUserId);
		blockUserSwipe.match.pull(currentUserSwipe);
		if (block) {
			currentUserSwipe.blockedUser.push(blockUserId);
			blockUserSwipe.blockedUser.push(currentUserSwipe);
		}
		await Promise.all([
			Room.findOneAndDelete({
				$or: [
					{
						'firstUser.userId': currentUserId,
						'secondUser.userId': blockUserId,
					},
					{
						'firstUser.userId': blockUserId,
						'secondUser.userId': currentUserId,
					},
				],
			}),
			Chat.deleteMany({
				roomId: room._id,
			}),
			currentUserSwipe.save(),
			blockUserSwipe.save(),
		]);
	} catch (err) {
		throw new Error(err);
	}
};
module.exports = { blockUser };

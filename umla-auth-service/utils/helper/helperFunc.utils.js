const axios = require('axios');
require('dotenv').config();

const sendPushNotification = (
	deviceToken,
	title,
	body,
	payloadObject,
	img,
	actionButtonLabel,
	key
) => {
	try {
		bodyData = {
			to: deviceToken,
			priority: 'high',
			mutable_content: true,
			notification: {
				badge: 42,
				title,
				body,
			},
			data: {
				content: {
					id: 1,
					badge: 42,
					channelKey: 'basic_channel',
					displayOnForeground: true,
					notificationLayout: 'BigPicture',
					largeIcon: '',
					bigPicture: img,
					showWhen: true,
					autoDismissible: true,
					privacy: 'Private',
					payload: payloadObject,
				},
				actionButtons: [
					{
						key: key,
						label: actionButtonLabel,
						autoDismissible: true,
					},
					{
						key: 'DISMISS',
						label: 'Dismiss',
						actionType: 'DismissAction',
						isDangerousOption: true,
						autoDismissible: true,
					},
				],
			},
		};

		const response = axios.post(
			'https://fcm.googleapis.com/fcm/send',
			bodyData,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `key=${process.env.FIREBASE_KEY}`,
				},
			}
		);

		return response;
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};

module.exports = { sendPushNotification };

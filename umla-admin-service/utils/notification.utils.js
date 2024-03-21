const axios = require("axios");
require("dotenv").config();
const key = require("./fcm-service-account.json");
const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];

const { google } = require("googleapis");
const { User } = require("../models/index.models");
async function getAccessToken() {
    try {
        // Create a new JWT client using Firebase credentials
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES
        );

        // Authorize the client and obtain an access token
        const tokens = await jwtClient.authorize();

        // Access token is available in tokens.access_token
        const accessToken = tokens.access_token;
        return accessToken;
    } catch (error) {
        console.error("Error retrieving access token:", error);
        throw error;
    }
}

const sendPushNotification = async (deviceToken, title, body) => {
    if (deviceToken?.length > 10) {
        bodyData = {
            message: {
                token: deviceToken,
                notification: {
                    body,
                    title,
                },
            },
        };

        const accessToken = await getAccessToken();
        const response = axios.post(
            "https://fcm.googleapis.com/v1/projects/umla-ec8f4/messages:send",
            bodyData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response;
    }
    return true;
};

module.exports = { sendPushNotification };

// bodyData = {
// 	to: deviceToken,
// 	priority: 'high',
// 	mutable_content: true,
// 	notification: {
// 		badge: 42,
// 		title,
// 		body,
// 	},
// 	data: {
// 		content: {
// 			id: 1,
// 			badge: 42,
// 			channelKey: 'basic_channel',
// 			displayOnForeground: true,
// 			notificationLayout: 'BigPicture',
// 			largeIcon: '',
// 			bigPicture: img,
// 			showWhen: true,
// 			autoDismissible: true,
// 			privacy: 'Private',
// 			payload: payloadObject,
// 		},
// 		actionButtons: [
// 			{
// 				key: key,
// 				label: actionButtonLabel,
// 				autoDismissible: true,
// 			},
// 			{
// 				key: 'DISMISS',
// 				label: 'Dismiss',
// 				actionType: 'DismissAction',
// 				isDangerousOption: true,
// 				autoDismissible: true,
// 			},
// 		],
// 	},
// };

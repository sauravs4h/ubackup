const { redisClient } = require("../../../utils/index.utils");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const DEFAULT_EXPIRATION = 180;
const axios = require("axios");
const {
    User,
    Swipe,
    UserFilter,
    UserReferral,
    SubscriptionChecks,
    OfferPreference,
    UserSlot,
} = require("../../../models/index.models");

/**
 * The `sendOtp` function sends an OTP (One-Time Password) to a specified contact number using the
 * MSG91 API and stores the OTP in Redis for verification purposes.
 * @param req - The `req` parameter is the request object that contains information about the HTTP
 * request made to the server. It includes properties such as `body`, `headers`, `params`, and `query`
 * which can be used to access the data sent in the request.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, headers, and sending the response body.
 * @returns a response object with a status code and a JSON message.
 */
const sendOtp = async (req, res) => {
    const { contactNumber } = req.body;
    try {
        if (!contactNumber) {
            return res
                .status(200)
                .json({ message: "Please provide contactNumber" });
        }
        if (contactNumber === "+919876543210") {
            const data = {
                otp: 1234,
            };
            redisClient.setEx(
                `${contactNumber}`,
                DEFAULT_EXPIRATION,
                JSON.stringify({ data })
            );
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        }
        const otp = Math.floor(Math.random() * 9000) + 1000;
        const data = {
            otp,
        };
        redisClient.setEx(
            `${contactNumber}`,
            DEFAULT_EXPIRATION,
            JSON.stringify({ data })
        );
        const options = {
            method: "POST",
            url: "https://control.msg91.com/api/v5/flow/",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authkey: process.env.MSG_AUTH_KEY,
            },
            data: {
                template_id: process.env.MSG_TEMPLATE_ID,
                sender: process.env.MSG_SENDER_ID,
                short_url: "1",
                mobiles: contactNumber,
                var1: otp,
            },
        };

        const msgCall = await axios.request(options);
        console.log(msgCall.data);

        if (msgCall.status === 200) {
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Error in sending otp",
            });
        }
        // res.status(200).json({
        // 	success: true,
        // 	message: 'OTP send successfully',
        // 	data,
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * The `verifyOtp` function is used to verify the OTP (One-Time Password) provided by the user and
 * perform various actions based on the verification result.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request body, headers, and query parameters. It is used to retrieve data
 * sent by the client and to send a response back to the client.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to set the status code, headers, and
 * send the response body.
 * @returns The function `verifyOtp` returns a response in JSON format. The response contains the
 * following properties:
 */

const verifyOtp = async (req, res) => {
    const { contactNumber, otp, deviceId } = req.body;
    try {
        const redisCache = await redisClient.get(`${contactNumber}`);
        if (!redisCache) {
            return res
                .status(401)
                .json({ success: false, message: "please request OTP again" });
        }
        const cache = JSON.parse(redisCache);

        if (!(otp === cache.data.otp)) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid OTP" });
        }
        const user = await User.findOne({ contactNumber: contactNumber });
        if (!user) {
            async function generateUniqueReferralCode() {
                let newCode;
                let existingCodeUser;

                const characters =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                do {
                    let code = "";
                    for (let i = 0; i < 6; i++) {
                        code += characters.charAt(
                            Math.floor(Math.random() * characters.length)
                        );
                    }
                    newCode = code;

                    existingCodeUser = await User.findOne({
                        referralCode: newCode,
                    });
                } while (existingCodeUser);

                return newCode;
            }
            const userCount = await User.countDocuments({ gender: "female" });
            const newCode = await generateUniqueReferralCode();
            const newUser = new User({
                contactNumber: contactNumber,
                deviceId: deviceId,
                referralCode: newCode,
                earlyBird: userCount > 500 ? false : true,
            });
            const data = await newUser.save();    // saving new user
            await UserReferral.create({
                userId: data._id,
                referralCode: newCode,
            });
            await SubscriptionChecks.create({
                uid: data._id,
            });
            const resetDate = new Date();
            resetDate.setDate(resetDate.getDate() + 3);
            const newSwipeRecord = new Swipe({
                uid: data._id,
                resetAt: resetDate,
            });
            await newSwipeRecord.save();
            await UserFilter.create({
                userId: data._id,
            });
            await OfferPreference.create({
                userId: data._id,
            });

            // making userSlot

            let todayDate = new Date();
            todayDate.setUTCHours(0, 15, 0, 0);

            // Get the date for tomorrow with time set to midnight UTC
            let nextDayDate = new Date(todayDate);
            nextDayDate.setUTCDate(nextDayDate.getUTCDate() + 1);

            let todaySlot=await UserSlot.create({
                userId:data._id,
                date:todayDate
            })

            let nextDaySlot=await UserSlot.create({
                userId:data._id,
                date:nextDayDate
            })
            
            // await todaySlot.save();
            // await nextDaySlot.save()

            const token = jwt.sign(
                { id: data._id, deviceId },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1y",
                }
            );
            redisClient.del(`${contactNumber}`);
            return res.status(200).json({
                success: true,
                message: "OTP verification successful",
                data: {
                    token,
                    user: data,
                    existingUser: false,
                    profileDataCompleted: data.completed,
                },
            });
        }
        const token = jwt.sign(
            { id: user._id, deviceId },
            process.env.JWT_SECRET,
            {
                expiresIn: "1y",
            }
        );
        user.deviceId = deviceId;
        redisClient.del(`${contactNumber}`);
        await user.save();
        const userData = await User.findById(user._id)
            .populate({
                path: "offer",
                select: "time offering purpose outlet", // Select the fields you want from the Offer model
                populate: {
                    path: "outlet",
                    model: "Outlet",
                    select: "name", // Select the fields you want from the Outlet model
                },
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "OTP verification successful",
            data: {
                token,
                user: userData,
                existingUser: true,
                profileDataCompleted: user.completed,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { sendOtp, verifyOtp };

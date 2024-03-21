const express = require("express");
const {
    getUser,
    getAllUsers,
    addUserDetails,
    updateLocation,
    handleImageUpload,
    getPrompts,
    addPromptToProfile,
    generateOtpToVerifyAadhaar,
    submitOptForAadhaarVerification,
    getInstantQueueUsers,
    updateCoordinates,
    reportUser,
    blockMatchedUser,
    unmatch,
    getFilterData,
    updateFilter,
    getPreference,
    updatePreference,
    handleReferral,
    getReferralStatus,
    claimOffer,
    noReferral,
    deleteSingleImage,
    handleImageUploadForVerification,
    snoozeToggle,
    softDeleteProfile,
    deletePrompt,
    whoLikedYou,
    getOtherUserPreference,
    getOtherUser,
    addUserQuery,
    getUserQuery,
    addUserFeedback,
    cancelfreeOffer,
    checkIfFloatOffer
    /*updateUserDetails,*/
} = require("../../controllers/index.controllers");
const { authorizeRequest } = require("../../middleware/index.middleware");
const router = express.Router();
const multer = require("multer");
const { TimeSlot, OutletMenu } = require("../../models/index.models");
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB in bytes (you can adjust this value)
    },
});

router.get("/getUser", authorizeRequest, getUser);
router.get("/getAllUser/:page", authorizeRequest, getAllUsers,checkIfFloatOffer);
router.post(
    "/addUserDetails",
    authorizeRequest,
    upload.single("image"),
    addUserDetails
);
router.post(
    "/addImage",
    authorizeRequest,
    upload.single("image"),
    handleImageUpload
);
router.post(
    "/addVerificationImage",
    authorizeRequest,
    upload.single("image"),
    handleImageUploadForVerification
);

router.route("/prompt/questions").get(authorizeRequest, getPrompts);
router.route("/prompt/answer").post(authorizeRequest, addPromptToProfile);
router.route("/travel").post(authorizeRequest, updateLocation);
// router.put('/updateUserDetails', authorizeRequest, updateUserDetails);
router
    .route("/aadhaar/generate/otp")
    .post(authorizeRequest, generateOtpToVerifyAadhaar);
router
    .route("/aadhaar/verify/otp")
    .post(authorizeRequest, submitOptForAadhaarVerification);

router.route("/update/loc").post(authorizeRequest, updateCoordinates);

router
    .route("/getInstantQueue/:page")
    .get(authorizeRequest, getInstantQueueUsers);

router.route("/reportUser").post(authorizeRequest, reportUser);

router.route("/blockUser").post(authorizeRequest, blockMatchedUser);

router.route("/unmatch").post(authorizeRequest, unmatch);
router.route("/filters/get").get(authorizeRequest, getFilterData);
router.route("/filters/update").post(authorizeRequest, updateFilter);
router.route("/preference/update").post(authorizeRequest, updatePreference);
router.route("/preference/get").get(authorizeRequest, getPreference);
router.route("/handleReferral").post(authorizeRequest, handleReferral);
router.route("/getReferralStatus").get(authorizeRequest, getReferralStatus);
router.route("/claimOffer").get(authorizeRequest, claimOffer);

router.route("/noReferral").get(authorizeRequest, noReferral);
router.route("/delete/singleImage").post(authorizeRequest, deleteSingleImage);
router.post("/snooze/toggle", authorizeRequest, snoozeToggle);
router.post("/delete", authorizeRequest, softDeleteProfile);
router.post("/deletePrompt", authorizeRequest, deletePrompt);
router.get("/likes", authorizeRequest, whoLikedYou);
router.post("/other/preference", authorizeRequest, getOtherUserPreference);
router.post("/other", authorizeRequest, getOtherUser);
router.post(
    "/addUserQuery",
    authorizeRequest,
    upload.array("image", 3),
    addUserQuery
);
router.post(
    "/addUserFeedback",
    authorizeRequest,
    upload.array("image", 3),
    addUserFeedback
);
router.get("/getUserQuery", authorizeRequest, getUserQuery);
router.get("/freeOffer/cancel", authorizeRequest, cancelfreeOffer);

// router.get("/temp", async (req, res) => {
//     try {
// const data = await TimeSlot.find();
// const operations = data.map((doc) => {
//     let date = 20;
//     let data = [];
//     const checkVal = Math.floor(doc.slots.length / 2);
//     for (let i = 0; i < checkVal; i++) {
//         data.push(doc.slots[i]);
//     }
//     let update = [];
//     for (let j = date; j <= 23; j++) {
//         // Update the 'date' property of each element in 'data' to the value of 'j'
//         let updatedData = data.map((item) => ({
//             ...item,
//             date: `${j}/11/23`,
//         }));
//         // Use the spread operator to flatten the array and push elements into 'update'
//         update.push(...updatedData);
//     }
//     return {
//         updateOne: {
//             filter: { _id: doc._id },
//             update: { $set: { slots: update } },
//         },
//     };
// });

// // Perform all updates in a single operation
// await TimeSlot.bulkWrite(operations);
// Get all documents
//---------------------------------------
//         const page = req.query.page;
//         const menus = await OutletMenu.find()
//             .sort({ createdAt: 1 }) // Sort by 'createdAt' in ascending order
//             .limit(60) // Limit to 20 documents
//             .skip(page * 60);

//         // Iterate over each document
//         for (let menu of menus) {
//             // Check if menuTitleTags exists and is an array
//             if (Array.isArray(menu.menuTitleTags)) {
//                 // Update each string in menuTitleTags
//                 menu.menuTitleTags = menu.menuTitleTags.map((tag) => {
//                     // Capitalize first letter and join it with the rest of the string
//                     return tag.charAt(0).toUpperCase() + tag.slice(1);
//                 });

//                 // Save the updated document
//                 await menu.save();
//             }
//         }
//         // await OutletMenu.updateMany({}, { $set: { price: 5 } });
//         res.send("done");
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

module.exports = router;

const express = require("express");
const {
    getAllOutlet,
    getMenu,
    createOffer,
    floatOffer,
    useOffer,
    getOfferDetails,
    getOfferResponse,
    handleOfferResponse,
    activeDeals,
    myOffers,
    getEarlyBirdOutlet,
    getEarlyBirdOutletItem,
    confirmOffer,
    takeActionAgainstOffer,
    sendAlert,
    acceptRejectOffer,
    sendData,
    confirmFreeDeal,
    getOfferNotification,
    superOffer,
    superOfferWithFloatingOffer,
    createGroup,
    createGroupOffer
} = require("../../controllers/index.controllers");
const { authorizeRequest } = require("../../middleware/index.middleware");

const router = express.Router();

router.route("/outlets/:page").get(authorizeRequest, getAllOutlet);
router.route("/menu/:outletId").get(authorizeRequest, getMenu);
router.route("/create").post(authorizeRequest, createOffer);
router.route("/superOffer").post(authorizeRequest, superOffer);
router.route("/superOfferWithFloatingOffer").post(authorizeRequest,superOfferWithFloatingOffer);
router.route("/float").post(authorizeRequest, floatOffer);
router.route("/checkIn").post(authorizeRequest, useOffer); //
router.route("/detail/:offerId").get(authorizeRequest, getOfferDetails);
router.route("/response/:offerId").get(authorizeRequest, getOfferResponse);
router.route("/handleResponse").post(authorizeRequest, handleOfferResponse);
router.route("/coupons").get(authorizeRequest, activeDeals);
router.route("/all").get(authorizeRequest, myOffers);
router.route("/earlyBird/outlets").get(authorizeRequest, getEarlyBirdOutlet);
router
    .route("/earlyBird/outletsItem/:outletId")
    .get(authorizeRequest, getEarlyBirdOutletItem);

router.route("/earlyBird/confirmOffer").post(authorizeRequest, confirmOffer);
router.route("/action").post(authorizeRequest, takeActionAgainstOffer);
router.route("/alert").post(authorizeRequest, sendAlert);
router.route("/acceptRejectOffer").post(authorizeRequest, acceptRejectOffer);
router.route("/orderDetails/:offerId").get(authorizeRequest, sendData);
router.route("/freeOffer/create").post(authorizeRequest, confirmFreeDeal);
router.route("/notification").get(authorizeRequest, getOfferNotification);
router.route("/createGroup").post(authorizeRequest, createGroup);
router.route("/createGroupOffer").post(authorizeRequest,createGroupOffer)
module.exports = router;

const express = require('express');
const {
	orderStatusUpdate,
	getArrivalAndOrder,
	getOrderHistory,
	getRevenue,
	getActiveArrivals,
	completeArrivalStatus,
	updateOutletStatus,
	getOutlet,
	getUpcomingArrivals,
	allotTable,
	getMenuItems,
	addMenuItem,
	updateMenuItemStatus,
	deleteMenuItem,
	updateMenuItem,
	getInprogressArrivals,
	resolveAlert,
	getTodaysOrder,
	editOutlet,
} = require('../../controllers/index.controllers');
const { authorizeRequest } = require('../../middleware/index.middleware');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100 * 1024 * 1024,
	},
});
router.put('/orderStatusUpdate', authorizeRequest, orderStatusUpdate);
router.get('/getOrderHistory', authorizeRequest, getOrderHistory);
router.get('/getRevenue', authorizeRequest, getRevenue);
router.get('/getActiveArrivals', authorizeRequest, getActiveArrivals);
router.put('/completeArrival', authorizeRequest, completeArrivalStatus);
router.put('/updateOutletStatus', authorizeRequest, updateOutletStatus);
router.get('/getOutlet', authorizeRequest, getOutlet);
router.get('/getUpcomingArrivals', authorizeRequest, getUpcomingArrivals);
router.put('/allotTable', authorizeRequest, allotTable);
router.get('/getMenuItems', authorizeRequest, getMenuItems);
router.post(
	'/addMenuItem',
	authorizeRequest,
	upload.array('images', 10),
	addMenuItem
);
router.put('/updateItemStatus', authorizeRequest, updateMenuItemStatus);
router.delete('/deleteMenuItem/:itemId', authorizeRequest, deleteMenuItem);
router.post(
	'/updateMenuItem',
	authorizeRequest,
	upload.array('images', 10),
	updateMenuItem
);
router.get('/getInprogressArrivals', authorizeRequest, getInprogressArrivals);
router.post('/addMenuItem', authorizeRequest, addMenuItem);
router.post('/resolveAlert', authorizeRequest, resolveAlert);
router.get('/getTodaysOrder', authorizeRequest, getTodaysOrder);
router.put(
	'/editOutlet',
	authorizeRequest,
	upload.array('image', 10),
	editOutlet
);

// router.post(
// 	'/addUserDetails',
// 	authorizeRequest,
// 	upload.single('image'),
// 	addUserDetails
// );

module.exports = router;

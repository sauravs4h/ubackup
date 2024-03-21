const { OnboardRequest } = require('../../models/index.models');
const { containerClient } = require('../../utils/index.utils');

const createOnboardRequest = async (req, res) => {
	const {
		companyName,
		category,
		executiveName,
		contactNumber,
		city,
		openAt,
		closeAt,
		address,
	} = req.body;
	// console.log(req.body, req.files);
	try {
		const bodyData = {
			companyName,
			category,
			executiveName,
			contactNumber,
			city,
			openAt,
			closeAt,
			address,
			images: [],
		};
		const files = req.files;
		if (files && files.length > 0) {
			for (const file of files) {
				const blobName = `${Date.now()}-${file.originalname}`;
				const blockBlobClient =
					containerClient.getBlockBlobClient(blobName);

				const response = await blockBlobClient.uploadData(file.buffer, {
					blobHTTPHeaders: { blobContentType: file.mimetype },
				});
				const imageUrl = blockBlobClient.url;
				bodyData.images.push(imageUrl);
			}
		}
		const onboardRequest = await OnboardRequest.create(bodyData);
		res.status(200).json({ onboardRequest });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getOnboardRequests = async (req, res) => {
	const filter = req.query.status ? { status: req.query.status } : {};
	try {
		const requests = await OnboardRequest.find(filter);
		res.status(200).json({ requests });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const handleOnboardRequest = async (req, res) => {
	const { status, requestId } = req.body;
	try {
		const onboardRequest = await OnboardRequest.findById(requestId);
		onboardRequest.status = status;
		const updatedRequest = await onboardRequest.save();
		res.status(200).json({ request: updatedRequest });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createOnboardRequest,
	getOnboardRequests,
	handleOnboardRequest,
};

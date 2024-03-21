const { Partner } = require('../../models/index.models');
const { containerClient } = require('../../utils/index.utils');

const addPartnerDetails = async (req, res) => {
	const partnerAdminId = req.user.id;
	const { name, bio, tags } = req.body;
	const uploadedFiles = req.files;
	try {
		const tagsArray = tags.split('-');
		const imageArray = await Promise.all(
			uploadedFiles.map(async (file, index) => {
				const blobName = `${Date.now()}-${file.originalname}`;
				const blockBlobClient =
					containerClient.getBlockBlobClient(blobName);
				await blockBlobClient.uploadData(file.buffer, {
					blobHTTPHeaders: { blobContentType: file.mimetype },
				});
				const imageUrl = blockBlobClient.url;
				return imageUrl;
			})
		);
		const newPartner = new Partner({
			name,
			bio,
			pAdminId: partnerAdminId,
			tags: tagsArray,
			image: imageArray,
		});
		const partner = await newPartner.save();
		res.status(201).json({ partner });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

module.exports = { addPartnerDetails };

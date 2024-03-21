const { Partner, Outlet } = require('../../models/index.models');
const { containerClient } = require('../../utils/index.utils');

const addOutletDetails = async (req, res) => {
	const { name, bio, outletTags, location, address, opensAt, closesAt } =
		req.body;
	const uploadedFiles = req.files;
	const pAdminId = req.user.id;
	try {
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
		const outletTagsArray = outletTags.split('-');
		const partner = await Partner.findOne({ pAdminId });
		const newOutlet = new Outlet({
			pid: partner._id,
			name,
			bio,
			outletTags: outletTagsArray,
			info: {
				location,
				address,
				timing: {
					opensAt,
					closesAt,
				},
				image: imageArray,
			},
		});
		const data = await newOutlet.save();
		partner.outlets.push(data._id);
		await partner.save();
		res.status(201).json({ outlet: data });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

module.exports = { addOutletDetails };

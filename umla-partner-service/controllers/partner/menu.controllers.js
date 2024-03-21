const { OutletMenu, Outlet } = require('../../models/index.models');
const { containerClient } = require('../../utils/index.utils');

const addOutletMenu = async (req, res) => {
	const { outletId, name, bio, price, menuTitleTags, nonVeg } = req.body; //!update for veg non-veg
	const uploadedFiles = req.files;
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
		const tagsArray = menuTitleTags.split('-');
		const newMenuItem = new OutletMenu({
			outletId,
			name,
			bio,
			price,
			menuTitleTags,
			image: imageArray,
			nonVeg,
		});
		const menuItem = await newMenuItem.save();
		const outlet = await Outlet.findById(outletId);
		const arr = [...outlet.menuTitle, ...menuTitleTags];
		outlet.menuTitle = [...new Set(arr)];
		await outlet.save();
		res.status(201).json({ addedItem: menuItem });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};
module.exports = { addOutletMenu };

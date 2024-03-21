const { User, Swipe } = require('../../models/index.models');
const validateRequest = async (req, res) => {
	try {
		const { id, deviceId } = req.user;
		const user = User.findOne({ _id: id, deviceId });
		if (!user) {
			return res.status(403).json({ error: 'You must be logged In.' });
		}
		res.status(200).json({ verification: 'Success', id });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};

module.exports = { validateRequest };

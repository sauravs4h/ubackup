const { PartnerAdmin } = require('../../models/index.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	try {
		const user = await PartnerAdmin.findOne({ email: req.body.email });
		if (!user) return res.status(400).json({ msg: 'User does not exist' });

		const isMatch = await bcrypt.compare(req.body.password, user.password);
		if (!isMatch)
			return res.status(400).json({ msg: ' Invalid credentials.' });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		res.status(200).json({
			token,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { login };

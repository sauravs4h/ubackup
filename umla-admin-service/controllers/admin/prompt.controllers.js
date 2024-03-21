const { Prompt } = require('../../models/index.models');

const createPrompt = async (req, res) => {
	const { tag, question } = req.body;
	try {
		const prompt = await Prompt.create({
			tag,
			question,
		});
		res.status(201).json({ prompt });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Something went wrong' });
	}
};

module.exports = { createPrompt };

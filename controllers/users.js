
const User = require('../models/user');

const users = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Errorسشيسي' });
    }
};

module.exports = { users }

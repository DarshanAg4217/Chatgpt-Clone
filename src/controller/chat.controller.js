const chatModel = require('../models/chat.model');


const createChat = async (req, res) => {
    try {
        const { title } = req.body;
        const user = req.user;

        const chat = await chatModel.create({
            user: user._id,
            title
        });

        res.status(201).json({
            message: 'Chat created successfully',
            chat: {
                id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }
        })

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createChat
};
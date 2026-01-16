
const { Server } = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/auth.model');
const aiService = require('../service/ai.service');
const messageModel = require('../models/message.model');

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {})

    io.use(async (socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || '');

        if (!cookies.token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

            const user = await userModel.findById(decoded.id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;

            next();

        } catch (err) {
            return next(new Error('Authentication error'));
        }

    });

    io.on('connection', (socket) => {

        socket.on('ai-message', async (messagePayload) => {
            console.log('Received ai-message:', messagePayload);

            await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: messagePayload.content,
                role: 'user'
            });

            const chatHistory = await messageModel.find({ chat: messagePayload.chat });

            console.log('Chat history:', {

            });

            // Here you can integrate with your AI service to get a response

            const response = await aiService.generateResponse(chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]

                };
            }));

            await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: response,
                role: 'model'
            });



            console.log(messagePayload);

            socket.emit('ai-response',
                {
                    content: response,
                    chat: messagePayload.chat
                });
        })

    })
}

module.exports = initSocketServer;
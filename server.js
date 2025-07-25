const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

const PORT = process.env.PORT || 3000;

let currentGameState = {
    round: 1,
    countdown: 10,
    result: null,
};

let bets = [];

setInterval(() => {
    if (currentGameState.countdown > 0) {
        currentGameState.countdown--;
        io.emit('countdown', currentGameState.countdown);
    } else {
        currentGameState.result = Math.random() < 0.5 ? 'TÀI' : 'XỈU';
        io.emit('round-result', {
            result: currentGameState.result,
            bets,
        });

        currentGameState.round++;
        currentGameState.countdown = 10;
        bets = [];
    }
}, 1000);

io.on('connection', (socket) => {
    console.log('🔗 Người chơi đã kết nối:', socket.id);

    socket.emit('init', currentGameState);

    socket.on('dat-cuoc', (data) => {
        console.log('💰 Cược từ', socket.id, data);
        bets.push({ socketId: socket.id, ...data });
    });

    socket.on('chat-message', (msg) => {
        io.emit('chat-message', {
            from: socket.id,
            message: msg,
        });
    });
});

http.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors()); // <<-- Thêm dòng này

const io = new Server(server, {
    cors: {
        origin: "*", // hoặc chỉ Netlify domain nếu muốn giới hạn
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🟢 Người chơi đã kết nối:", socket.id);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

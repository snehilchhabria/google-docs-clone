const mongoose = require("mongoose")

 mongoose.connect('mongodb://127.0.0.1/google-docs-clone');

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

io.on("connection", socket => {
    socket.on('get-document', documentId => {
        const data = ""
        socket.join(documentId)
        socket.emit("load-document", data)

        socket.on("send-changes",delta => {
         socket.broadcast.to(documentId).emit("receive-changes", delta) // so ths broadcasts the changes to evryone else on the server except us
    })
    })
})
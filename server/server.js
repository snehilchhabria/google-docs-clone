const mongoose = require("mongoose")
const Document = require("./Document")

 mongoose.connect('mongodb://127.0.0.1/google-docs-clone');

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})
const defaultValue = ""

io.on("connection", socket => {
    socket.on('get-document', documentId => {
        const document = findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        socket.on("send-changes",delta => {
         socket.broadcast.to(documentId).emit("receive-changes", delta) // so ths broadcasts the changes to evryone else on the server except us
    })
    })
})

async function findOrCreateDocument(id){
    if(id == null) return 

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id: id, data: defaultValue})
}
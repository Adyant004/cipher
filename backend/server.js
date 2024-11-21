const express = require('express');
const server = express();
const cors = require('cors');
const { router } = require('./routes/cipherRoutes')

server.use(cors());
server.use(express.json());
server.use('/cipher',router);

const PORT = 5000;

server.get('/',(req,res)=>{
    res.send("Working!")
})

server.listen(PORT, () => {
    console.log("Server is listening at PORT 5000....");
});
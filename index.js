const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    return res.send('The wedding snap server is running.')
})


app.listen(port, (req, res) => {
    console.log(`Wedding snap server is running on port ${port}`)
})
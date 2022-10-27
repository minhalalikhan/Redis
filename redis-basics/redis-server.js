const express = require('express')
const cors = require('cors')
const axios = require('axios')
const redis = require('redis')

const redisclient = redis.createClient()
redisclient.connect()
redisclient.on("error", function(err) {
    console.log("Error " + err);
});

redisclient.on("connect", function() {
    console.log("client connected");
});
redisclient.on("ready", function() {
    console.log("client ready to use");
});



const app = express()
    //app.use(express.urlencoded({ extended: true }))

app.use(cors())


app.get('/', (req, res) => {

    console.log("welcome")

    res.send("thanks")
})

app.get('/photos', async(req, res) => {


    const photos = await redisclient.get('photos')

    if (photos != null)
        res.json(JSON.parse(photos))
    else {
        const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos")

        redisclient.set('photos', JSON.stringify(data))
        res.json(data)
    }

})


app.get('/photos/:id', async(req, res) => {

    const photos = await redisclient.get('photos/' + req.params.id)

    if (photos != null)
        res.json(JSON.parse(photos))
    else {
        const { data } = await axios.get("https://jsonplaceholder.typicode.com/photos/" + req.params.id)

        redisclient.set('photos/' + req.params.id, JSON.stringify(data))
        res.json(data)
    }
})

app.listen(8080, () => {
    console.log("server at 8080")
})
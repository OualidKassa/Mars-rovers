require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get("/roverInfo/:rover_name", async (req, res) => {
    const url = "https://api.nasa.gov/mars-photos/api/v1/";
    try {
        const roverManifest = await fetch(`${url}manifests/${req.params.rover_name}?api_key=${process.env.API_KEY}`)
            .then(res => res.json());

        const max_date = roverManifest["photo_manifest"]["max_date"];
        const roverPhotos = await fetch(`${url}rovers/${req.params.rover_name}/photos?earth_date=${max_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send(roverPhotos);

    } catch (err) {
        console.log("errors:", err);
    }
})

app.listen(port, () => console.log(`Run on port: ${port}!`))
